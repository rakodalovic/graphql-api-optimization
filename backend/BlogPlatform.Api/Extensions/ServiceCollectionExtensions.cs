using BlogPlatform.Api.Data;
using BlogPlatform.Api.Services;
using BlogPlatform.Api.GraphQL;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace BlogPlatform.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBlogPlatformServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        var usePostgreSQL = configuration.GetValue<bool>("UsePostgreSQL");

        if (usePostgreSQL)
        {
            services.AddDbContext<BlogDbContext>(options =>
                options.UseNpgsql(connectionString));
        }
        else
        {
            services.AddDbContext<BlogDbContext>(options =>
                options.UseSqlite(connectionString));
        }

        services.AddDbContextFactory<BlogDbContext>(options =>
        {
            if (usePostgreSQL)
            {
                options.UseNpgsql(connectionString);
            }
            else
            {
                options.UseSqlite(connectionString);
            }
        }, ServiceLifetime.Scoped);

        // Services
        services.AddScoped<IAuthService, AuthService>();

        // JWT Authentication
        var jwtSettings = configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
        var issuer = jwtSettings["Issuer"] ?? "BlogPlatform";
        var audience = jwtSettings["Audience"] ?? "BlogPlatform";

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
                };

                // For GraphQL subscriptions over WebSocket
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        
                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/graphql"))
                        {
                            context.Token = accessToken;
                        }
                        
                        return Task.CompletedTask;
                    }
                };
            });

        services.AddAuthorization();

        // GraphQL
        services
            .AddGraphQLServer()
            .AddQueryType<SimpleQuery>()
            .AddMutationType<SimpleMutation>()
            .AddSubscriptionType<SimpleSubscription>()
            .AddInMemorySubscriptions()
            .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = true);

        // CORS
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", builder =>
            {
                builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });

        return services;
    }
}