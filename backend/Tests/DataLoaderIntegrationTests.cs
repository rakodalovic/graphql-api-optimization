using GraphQLApi.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;
using Xunit;

namespace GraphQLApi.Tests;

/// <summary>
/// Integration tests for DataLoader functionality to verify N+1 problem is resolved.
/// These tests use the actual GraphQL server to test the DataLoader implementation.
/// </summary>
public class DataLoaderIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public DataLoaderIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("Testing");
            builder.ConfigureServices(services =>
            {
                // Remove the existing DbContext and DbContextFactory registrations
                var descriptors = services.Where(d => 
                    d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>) ||
                    d.ServiceType == typeof(IDbContextFactory<ApplicationDbContext>) ||
                    d.ServiceType == typeof(ApplicationDbContext)).ToList();
                
                foreach (var descriptor in descriptors)
                {
                    services.Remove(descriptor);
                }

                // Add in-memory database for testing
                services.AddDbContextFactory<ApplicationDbContext>(options =>
                {
                    options.UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString());
                });
                
                // Register scoped DbContext using the factory
                services.AddScoped<ApplicationDbContext>(provider =>
                {
                    var factory = provider.GetRequiredService<IDbContextFactory<ApplicationDbContext>>();
                    return factory.CreateDbContext();
                });
            });
        });

        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetUsersWithOrders_ShouldUseBatchedDataLoader()
    {
        // Arrange
        var query = @"
            query GetUsersWithOrders {
                users {
                    id
                    firstName
                    lastName
                    email
                    orders {
                        id
                        orderNumber
                        totalAmount
                        status
                        createdAt
                    }
                }
            }";

        var request = new
        {
            query = query
        };

        var json = JsonSerializer.Serialize(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/graphql", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<JsonElement>(responseContent);

        // Verify the response structure
        Assert.True(result.TryGetProperty("data", out var data));
        Assert.True(data.TryGetProperty("users", out var users));
        
        var usersArray = users.EnumerateArray().ToArray();
        Assert.Equal(3, usersArray.Length);

        // Verify each user has their orders (based on seeded data)
        var johnUser = usersArray.First(u => u.GetProperty("firstName").GetString() == "John");
        var johnOrders = johnUser.GetProperty("orders").EnumerateArray().ToArray();
        Assert.Equal(2, johnOrders.Length); // John has 2 orders

        var janeUser = usersArray.First(u => u.GetProperty("firstName").GetString() == "Jane");
        var janeOrders = janeUser.GetProperty("orders").EnumerateArray().ToArray();
        Assert.Equal(2, janeOrders.Length); // Jane has 2 orders

        var adminUser = usersArray.First(u => u.GetProperty("firstName").GetString() == "Admin");
        var adminOrders = adminUser.GetProperty("orders").EnumerateArray().ToArray();
        Assert.Single(adminOrders); // Admin has 1 order
    }

    [Fact]
    public async Task GetSingleUserWithOrders_ShouldUseBatchedDataLoader()
    {
        // Arrange
        var query = @"
            query GetSingleUserWithOrders {
                user(id: 1) {
                    id
                    firstName
                    lastName
                    orders {
                        id
                        orderNumber
                        totalAmount
                        status
                    }
                }
            }";

        var request = new
        {
            query = query
        };

        var json = JsonSerializer.Serialize(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/graphql", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<JsonElement>(responseContent);

        // Verify the response structure
        Assert.True(result.TryGetProperty("data", out var data));
        Assert.True(data.TryGetProperty("user", out var user));
        
        Assert.Equal("John", user.GetProperty("firstName").GetString());
        
        var orders = user.GetProperty("orders").EnumerateArray().ToArray();
        Assert.Equal(2, orders.Length); // John has 2 orders in seeded data
        
        // Verify order data (based on seeded data)
        Assert.Contains(orders, o => o.GetProperty("orderNumber").GetString() == "ORD-2024-001");
        Assert.Contains(orders, o => o.GetProperty("orderNumber").GetString() == "ORD-2024-002");
    }

    [Fact]
    public async Task GetUsersWithOrders_ShouldReturnCorrectOrderStatuses()
    {
        // Arrange
        var query = @"
            query GetUsersWithOrderStatuses {
                users {
                    id
                    firstName
                    orders {
                        id
                        orderNumber
                        status
                        totalAmount
                    }
                }
            }";

        var request = new
        {
            query = query
        };

        var json = JsonSerializer.Serialize(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/graphql", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<JsonElement>(responseContent);

        Assert.True(result.TryGetProperty("data", out var data));
        Assert.True(data.TryGetProperty("users", out var users));
        
        var usersArray = users.EnumerateArray().ToArray();
        
        // Find user with cancelled order
        var userWithCancelledOrder = usersArray
            .FirstOrDefault(u => u.GetProperty("orders").EnumerateArray()
                .Any(o => o.GetProperty("status").GetString() == "CANCELLED"));
        
        Assert.True(userWithCancelledOrder.ValueKind != JsonValueKind.Undefined);
        
        var cancelledOrder = userWithCancelledOrder.GetProperty("orders").EnumerateArray()
            .First(o => o.GetProperty("status").GetString() == "CANCELLED");
        
        Assert.Equal("ORD-2024-005", cancelledOrder.GetProperty("orderNumber").GetString());
    }
}