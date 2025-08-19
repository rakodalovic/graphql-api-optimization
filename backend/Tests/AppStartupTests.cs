using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace GraphQLApi.Tests;

public class AppStartupTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public AppStartupTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task Application_ShouldStartSuccessfully()
    {
        // Act - Simply creating the client and making a request should verify the app starts
        var response = await _client.GetAsync("/");

        // Assert
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        
        Assert.Contains("GraphQL API is running", responseString);
        Assert.Contains("/graphql", responseString);
    }

    [Fact]
    public async Task GraphQL_Endpoint_ShouldBeAccessible()
    {
        // Act
        var response = await _client.GetAsync("/graphql");

        // Assert - GET request to GraphQL endpoint should return method not allowed or similar
        Assert.True(response.StatusCode == System.Net.HttpStatusCode.MethodNotAllowed || 
                   response.StatusCode == System.Net.HttpStatusCode.BadRequest ||
                   response.StatusCode == System.Net.HttpStatusCode.OK);
    }
}