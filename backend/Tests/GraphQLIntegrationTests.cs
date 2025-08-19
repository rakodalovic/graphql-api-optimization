using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using System.Text;
using System.Text.Json;
using Xunit;
using GraphQLApi.Data;
using Microsoft.EntityFrameworkCore;

namespace GraphQLApi.Tests;

public class GraphQLIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public GraphQLIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GraphQL_GetVersion_ShouldReturnVersionInfo()
    {
        // Arrange
        var query = new
        {
            query = @"
                query {
                    version {
                        version
                        environment
                        buildDate
                    }
                }"
        };

        var json = JsonSerializer.Serialize(query);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/graphql", content);

        // Assert
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        
        Assert.Contains("\"version\":", responseString);
        Assert.Contains("\"environment\":", responseString);
        Assert.Contains("\"buildDate\":", responseString);
    }

    [Fact]
    public async Task GraphQL_GetUsers_ShouldReturnUsers()
    {
        // Arrange
        var query = new
        {
            query = @"
                query {
                    users {
                        id
                        username
                        email
                        firstName
                        lastName
                        isActive
                    }
                }"
        };

        var json = JsonSerializer.Serialize(query);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/graphql", content);

        // Assert
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        
        Assert.Contains("\"users\":", responseString);
        Assert.DoesNotContain("\"errors\":", responseString);
    }

    [Fact]
    public async Task GraphQL_GetProducts_ShouldReturnProducts()
    {
        // Arrange
        var query = new
        {
            query = @"
                query {
                    products {
                        id
                        name
                        description
                        price
                        stockQuantity
                        isActive
                    }
                }"
        };

        var json = JsonSerializer.Serialize(query);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/graphql", content);

        // Assert
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        
        Assert.Contains("\"products\":", responseString);
        Assert.DoesNotContain("\"errors\":", responseString);
    }





    [Fact]
    public async Task RootEndpoint_ShouldReturnApiInfo()
    {
        // Act
        var response = await _client.GetAsync("/");

        // Assert
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        
        Assert.Contains("\"message\":\"GraphQL API is running\"", responseString);
        Assert.Contains("\"graphql\":\"/graphql\"", responseString);
        Assert.Contains("\"health\":\"/health\"", responseString);
    }

    [Fact]
    public async Task GraphQL_GetDashboardStats_ShouldReturnStats()
    {
        // Arrange
        var query = new
        {
            query = @"
                query {
                    dashboardStats {
                        totalUsers
                        totalProducts
                        totalOrders
                        totalRevenue
                    }
                }"
        };

        var json = JsonSerializer.Serialize(query);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/graphql", content);

        // Assert
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        
        Assert.Contains("\"dashboardStats\":", responseString);
        Assert.Contains("\"totalUsers\":", responseString);
        Assert.Contains("\"totalProducts\":", responseString);
        Assert.Contains("\"totalOrders\":", responseString);
        Assert.Contains("\"totalRevenue\":", responseString);
        Assert.DoesNotContain("\"errors\":", responseString);
    }
}