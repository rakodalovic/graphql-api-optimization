using HotChocolate;

namespace GraphQLApi.GraphQL;

public class Query
{
    /// <summary>
    /// Returns a simple "Hello World" message
    /// </summary>
    /// <returns>Hello World string</returns>
    public string GetHello() => "Hello World";

    /// <summary>
    /// Returns a personalized greeting
    /// </summary>
    /// <param name="name">Name to greet</param>
    /// <returns>Personalized greeting</returns>
    public string GetGreeting(string name = "World") => $"Hello, {name}!";

    /// <summary>
    /// Returns current server time
    /// </summary>
    /// <returns>Current UTC time</returns>
    public DateTime GetServerTime() => DateTime.UtcNow;

    /// <summary>
    /// Returns API version information
    /// </summary>
    /// <returns>API version info</returns>
    public ApiVersion GetVersion() => new ApiVersion
    {
        Version = "1.0.0",
        Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production",
        BuildDate = DateTime.UtcNow
    };
}

public record ApiVersion
{
    public string Version { get; init; } = string.Empty;
    public string Environment { get; init; } = string.Empty;
    public DateTime BuildDate { get; init; }
}