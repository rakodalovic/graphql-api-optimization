using GraphQLApi.Data;
using GraphQLApi.Data.Seed;
using GraphQLApi.GraphQL;
using GraphQLApi.GraphQL.DataLoaders;
using GraphQLApi.GraphQL.Scalars;
using GraphQLApi.GraphQL.Types;
using HotChocolate.AspNetCore;
using HotChocolate.Types.Pagination;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite;
using Serilog;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", optional: true)
        .Build())
    .CreateLogger();

try
{
    Log.Information("Starting GraphQL API application");

    var builder = WebApplication.CreateBuilder(args);

    // Add Serilog
    builder.Host.UseSerilog();

    // Add services to the container
    builder.Services.AddControllers();

    // Helper method to configure DbContext options
    void ConfigureDbContextOptions(DbContextOptionsBuilder options)
    {
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
            ?? "Data Source=graphql_api.db";
        
        // Create connection string with foreign key constraints enabled
        var connectionStringBuilder = new SqliteConnectionStringBuilder(connectionString)
        {
            ForeignKeys = true
        };
        
        options.UseSqlite(connectionStringBuilder.ToString(), sqliteOptions =>
        {
            sqliteOptions.CommandTimeout(30);
        });
        
        options.EnableSensitiveDataLogging(builder.Environment.IsDevelopment());
        options.EnableDetailedErrors(builder.Environment.IsDevelopment());
    }

    // Add DbContextFactory for GraphQL and general use
    builder.Services.AddDbContextFactory<ApplicationDbContext>(ConfigureDbContextOptions);

    // Register scoped DbContext using the factory
    builder.Services.AddScoped<ApplicationDbContext>(provider =>
    {
        var factory = provider.GetRequiredService<IDbContextFactory<ApplicationDbContext>>();
        return factory.CreateDbContext();
    });

    // Configure CORS
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("GraphQLPolicy", policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
    });

    // Configure JWT Authentication
    var jwtSettings = builder.Configuration.GetSection("JwtSettings");
    var secretKey = jwtSettings["SecretKey"] ?? "YourDefaultSecretKeyThatIsAtLeast32CharactersLong";
    var issuer = jwtSettings["Issuer"] ?? "GraphQLApi";
    var audience = jwtSettings["Audience"] ?? "GraphQLApi";

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = issuer,
                ValidAudience = audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey)),
                ClockSkew = TimeSpan.Zero
            };
        });

    builder.Services.AddAuthorization();

    // Add Health Checks
    builder.Services.AddHealthChecks()
        .AddCheck("self", () => Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Healthy("API is running"))
        .AddDbContextCheck<ApplicationDbContext>("database");

    // Register DataLoaders
    builder.Services.AddScoped<OrdersByUserIdDataLoader>();

    // Configure GraphQL with HotChocolate
    builder.Services
        .AddGraphQLServer()
        .AddQueryType<Query>()
        .AddMutationType<Mutation>()
        .AddSubscriptionType<Subscription>()
        .AddType<SearchResultUnion>()
        .AddType<PaymentMethodUnion>()
        .AddInterfaceType<IEntityNode>()
        .AddInterfaceType<IAuditable>()
        .AddType<GraphQLApi.GraphQL.Scalars.EmailType>()
        .AddType<GraphQLApi.GraphQL.Scalars.UrlType>()
        .AddType<GraphQLApi.GraphQL.Scalars.JsonType>()
        .AddType<OrderStatusType>()
        .AddType<PaymentStatusType>()
        .AddType<ExampleType>()
        .AddType<ProductSortType>()
        .AddTypeExtension<UserTypeExtensions>()
        .AddFiltering()
        .AddSorting()
        .AddProjections()
        .SetPagingOptions(new PagingOptions { IncludeTotalCount = true })
        .AddInMemorySubscriptions()
        .RegisterDbContext<ApplicationDbContext>(DbContextKind.Pooled)
        .ModifyRequestOptions(opt =>
        {
            opt.IncludeExceptionDetails = builder.Environment.IsDevelopment();
        });

    var app = builder.Build();

    // Ensure database is created and seeded
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        
        try
        {
            // Apply migrations (skip for in-memory database in tests)
            if (!context.Database.IsInMemory())
            {
                await context.Database.MigrateAsync();
                Log.Information("Database migrations applied successfully");

                // Verify foreign key constraints are enabled
                var connection = context.Database.GetDbConnection();
                await connection.OpenAsync();
                using var command = connection.CreateCommand();
                command.CommandText = "PRAGMA foreign_keys;";
                var result = await command.ExecuteScalarAsync();
                Log.Information("Foreign key constraints status: {Status}", result);
            }
            else
            {
                // For in-memory database, ensure it's created
                await context.Database.EnsureCreatedAsync();
                Log.Information("In-memory database created successfully");
            }

            // Seed the database
            await SeedData.SeedAsync(context);
            Log.Information("Database seeded successfully");
        }
        catch (Exception ex)
        {
            Log.Error(ex, "An error occurred while migrating or seeding the database");
            throw;
        }
    }

    // Configure the HTTP request pipeline
    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    else
    {
        app.UseExceptionHandler("/Error");
        app.UseHsts();
    }

    // Use Serilog request logging
    app.UseSerilogRequestLogging(options =>
    {
        options.MessageTemplate = "Handled {RequestPath} in {Elapsed:0.0000} ms";
        options.GetLevel = (httpContext, elapsed, ex) => ex != null
            ? Serilog.Events.LogEventLevel.Error
            : httpContext.Response.StatusCode > 499
                ? Serilog.Events.LogEventLevel.Error
                : Serilog.Events.LogEventLevel.Information;
    });

    app.UseHttpsRedirection();
    app.UseRouting();

    // Use CORS
    app.UseCors("GraphQLPolicy");

    // Use Authentication and Authorization
    app.UseAuthentication();
    app.UseAuthorization();

    // Add WebSocket support for subscriptions
    app.UseWebSockets();

    // Map GraphQL endpoint
    app.MapGraphQL("/graphql")
        .WithOptions(new GraphQLServerOptions
        {
            Tool = {
                Enable = app.Environment.IsDevelopment()
            }
        });

    // Map Health Checks
    app.MapHealthChecks("/health", new HealthCheckOptions
    {
        ResponseWriter = async (context, report) =>
        {
            context.Response.ContentType = "application/json";
            var response = new
            {
                status = report.Status.ToString(),
                checks = report.Entries.Select(x => new
                {
                    name = x.Key,
                    status = x.Value.Status.ToString(),
                    exception = x.Value.Exception?.Message,
                    duration = x.Value.Duration.ToString()
                }),
                totalDuration = report.TotalDuration.ToString()
            };
            await context.Response.WriteAsync(JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            }));
        }
    });

    // Map a simple health check endpoint
    app.MapHealthChecks("/health/ready");
    app.MapHealthChecks("/health/live");

    // Add a simple root endpoint
    app.MapGet("/", () => new
    {
        message = "GraphQL API is running",
        graphql = "/graphql",
        health = "/health",
        environment = app.Environment.EnvironmentName,
        timestamp = DateTime.UtcNow,
        database = "SQLite"
    });

    Log.Information("GraphQL API application configured successfully with SQLite database");

    await app.RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

// Make Program class accessible for testing
public partial class Program { }