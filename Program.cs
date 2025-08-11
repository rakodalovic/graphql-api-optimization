using GraphQLApi.Data;
using GraphQLApi.Data.Seed;
using GraphQLApi.GraphQL;
using HotChocolate.AspNetCore;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Text.Json;

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

    // Configure Entity Framework
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
    {
        if (builder.Environment.IsDevelopment())
        {
            // Use In-Memory database for development
            options.UseInMemoryDatabase("GraphQLApiDb");
        }
        else
        {
            // Use SQL Server for production
            options.UseSqlServer(
                builder.Configuration.GetConnectionString("DefaultConnection") ?? 
                "Server=(localdb)\\mssqllocaldb;Database=GraphQLApiDb;Trusted_Connection=true;MultipleActiveResultSets=true"
            );
        }
        
        options.EnableSensitiveDataLogging(builder.Environment.IsDevelopment());
        options.EnableDetailedErrors(builder.Environment.IsDevelopment());
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

    // Add Health Checks
    builder.Services.AddHealthChecks()
        .AddCheck("self", () => Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Healthy("API is running"))
        .AddDbContextCheck<ApplicationDbContext>("database");

    // Configure GraphQL with HotChocolate
    builder.Services
        .AddGraphQLServer()
        .AddQueryType<Query>()
        .AddMutationType<Mutation>()
        .AddFiltering()
        .AddSorting()
        .AddProjections()
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
        
        if (app.Environment.IsDevelopment())
        {
            // For in-memory database, ensure it's created
            await context.Database.EnsureCreatedAsync();
        }
        else
        {
            // For SQL Server, run migrations
            await context.Database.MigrateAsync();
        }

        // Seed the database
        await SeedData.SeedAsync(context);
        Log.Information("Database seeded successfully");
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
        timestamp = DateTime.UtcNow
    });

    Log.Information("GraphQL API application configured successfully");

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