using System.Text.Json;
using HotChocolate;
using HotChocolate.Language;
using Xunit;
using EmailType = GraphQLApi.GraphQL.Scalars.EmailType;
using UrlType = GraphQLApi.GraphQL.Scalars.UrlType;
using JsonType = GraphQLApi.GraphQL.Scalars.JsonType;

namespace GraphQLApi.Tests;

public class ScalarTypesTests
{
    [Fact]
    public void EmailType_ValidEmail_ShouldParseSuccessfully()
    {
        // Arrange
        var emailType = new EmailType();
        var validEmail = "test@example.com";
        var valueSyntax = new StringValueNode(validEmail);

        // Act
        var result = emailType.ParseLiteral(valueSyntax);

        // Assert
        Assert.Equal(validEmail, result);
    }

    [Theory]
    [InlineData("invalid-email")]
    [InlineData("@example.com")]
    [InlineData("test@")]
    [InlineData("")]
    [InlineData(" ")]
    public void EmailType_InvalidEmail_ShouldThrowSerializationException(string invalidEmail)
    {
        // Arrange
        var emailType = new EmailType();
        var valueSyntax = new StringValueNode(invalidEmail);

        // Act & Assert
        Assert.Throws<SerializationException>(() => emailType.ParseLiteral(valueSyntax));
    }

    [Fact]
    public void EmailType_TrySerialize_ValidEmail_ShouldReturnTrue()
    {
        // Arrange
        var emailType = new EmailType();
        var validEmail = "user@domain.com";

        // Act
        var success = emailType.TrySerialize(validEmail, out var result);

        // Assert
        Assert.True(success);
        Assert.Equal(validEmail, result);
    }

    [Fact]
    public void EmailType_TrySerialize_InvalidEmail_ShouldReturnFalse()
    {
        // Arrange
        var emailType = new EmailType();
        var invalidEmail = "not-an-email";

        // Act
        var success = emailType.TrySerialize(invalidEmail, out var result);

        // Assert
        Assert.False(success);
        Assert.Null(result);
    }

    [Fact]
    public void EmailType_TryDeserialize_ValidEmail_ShouldReturnTrue()
    {
        // Arrange
        var emailType = new EmailType();
        var validEmail = "test@example.org";

        // Act
        var success = emailType.TryDeserialize(validEmail, out var result);

        // Assert
        Assert.True(success);
        Assert.Equal(validEmail, result);
    }

    [Theory]
    [InlineData("https://example.com", "https://example.com/")]
    [InlineData("http://test.org", "http://test.org/")]
    [InlineData("https://subdomain.example.com/path?query=value", "https://subdomain.example.com/path?query=value")]
    public void UrlType_ValidUrl_ShouldParseSuccessfully(string validUrl, string expectedUrl)
    {
        // Arrange
        var urlType = new UrlType();
        var valueSyntax = new StringValueNode(validUrl);

        // Act
        var result = urlType.ParseLiteral(valueSyntax);

        // Assert
        Assert.Equal(expectedUrl, result);
    }

    [Theory]
    [InlineData("not-a-url")]
    [InlineData("ftp://example.com")]
    [InlineData("")]
    [InlineData("javascript:alert('xss')")]
    public void UrlType_InvalidUrl_ShouldThrowSerializationException(string invalidUrl)
    {
        // Arrange
        var urlType = new UrlType();
        var valueSyntax = new StringValueNode(invalidUrl);

        // Act & Assert
        Assert.Throws<SerializationException>(() => urlType.ParseLiteral(valueSyntax));
    }

    [Fact]
    public void UrlType_TrySerialize_ValidUrl_ShouldReturnTrue()
    {
        // Arrange
        var urlType = new UrlType();
        var validUrl = "https://www.example.com";

        // Act
        var success = urlType.TrySerialize(validUrl, out var result);

        // Assert
        Assert.True(success);
        Assert.Equal("https://www.example.com/", result); // URI formatting adds trailing slash
    }

    [Fact]
    public void UrlType_TrySerialize_InvalidUrl_ShouldReturnFalse()
    {
        // Arrange
        var urlType = new UrlType();
        var invalidUrl = "not-a-valid-url";

        // Act
        var success = urlType.TrySerialize(invalidUrl, out var result);

        // Assert
        Assert.False(success);
        Assert.Null(result);
    }

    [Theory]
    [InlineData("{\"name\": \"test\", \"value\": 123}")]
    [InlineData("[1, 2, 3]")]
    [InlineData("\"simple string\"")]
    [InlineData("true")]
    [InlineData("null")]
    [InlineData("42")]
    public void JsonType_ValidJson_ShouldParseSuccessfully(string validJson)
    {
        // Arrange
        var jsonType = new JsonType();
        var valueSyntax = new StringValueNode(validJson);

        // Act
        var result = jsonType.ParseLiteral(valueSyntax);

        // Assert
        Assert.NotEqual(default(JsonElement), result);
    }

    [Theory]
    [InlineData("{invalid json}")]
    [InlineData("[1, 2, 3")]
    [InlineData("")]
    [InlineData("undefined")]
    public void JsonType_InvalidJson_ShouldThrowSerializationException(string invalidJson)
    {
        // Arrange
        var jsonType = new JsonType();
        var valueSyntax = new StringValueNode(invalidJson);

        // Act & Assert
        Assert.Throws<SerializationException>(() => jsonType.ParseLiteral(valueSyntax));
    }

    [Fact]
    public void JsonType_TrySerialize_ValidJsonString_ShouldReturnTrue()
    {
        // Arrange
        var jsonType = new JsonType();
        var validJson = "{\"test\": \"value\"}";

        // Act
        var success = jsonType.TrySerialize(validJson, out var result);

        // Assert
        Assert.True(success);
        Assert.Equal(validJson, result);
    }

    [Fact]
    public void JsonType_TrySerialize_Object_ShouldReturnTrue()
    {
        // Arrange
        var jsonType = new JsonType();
        var testObject = new { name = "test", value = 123 };

        // Act
        var success = jsonType.TrySerialize(testObject, out var result);

        // Assert
        Assert.True(success);
        Assert.NotNull(result);
        Assert.Contains("test", result.ToString());
        Assert.Contains("123", result.ToString());
    }

    [Fact]
    public void JsonType_TryDeserialize_ValidJson_ShouldReturnTrue()
    {
        // Arrange
        var jsonType = new JsonType();
        var validJson = "{\"name\": \"test\", \"value\": 123}";

        // Act
        var success = jsonType.TryDeserialize(validJson, out var result);

        // Assert
        Assert.True(success);
        Assert.NotNull(result);
        Assert.IsType<JsonElement>(result);
    }

    [Fact]
    public void JsonType_TryDeserialize_InvalidJson_ShouldReturnFalse()
    {
        // Arrange
        var jsonType = new JsonType();
        var invalidJson = "{invalid json}";

        // Act
        var success = jsonType.TryDeserialize(invalidJson, out var result);

        // Assert
        Assert.False(success);
        Assert.Null(result);
    }

    [Fact]
    public void EmailType_NullValue_ShouldHandleGracefully()
    {
        // Arrange
        var emailType = new EmailType();

        // Act
        var serializeSuccess = emailType.TrySerialize(null, out var serializeResult);
        var deserializeSuccess = emailType.TryDeserialize(null, out var deserializeResult);

        // Assert
        Assert.True(serializeSuccess);
        Assert.Null(serializeResult);
        Assert.True(deserializeSuccess);
        Assert.Null(deserializeResult);
    }

    [Fact]
    public void UrlType_NullValue_ShouldHandleGracefully()
    {
        // Arrange
        var urlType = new UrlType();

        // Act
        var serializeSuccess = urlType.TrySerialize(null, out var serializeResult);
        var deserializeSuccess = urlType.TryDeserialize(null, out var deserializeResult);

        // Assert
        Assert.True(serializeSuccess);
        Assert.Null(serializeResult);
        Assert.True(deserializeSuccess);
        Assert.Null(deserializeResult);
    }

    [Fact]
    public void JsonType_NullValue_ShouldHandleGracefully()
    {
        // Arrange
        var jsonType = new JsonType();

        // Act
        var serializeSuccess = jsonType.TrySerialize(null, out var serializeResult);
        var deserializeSuccess = jsonType.TryDeserialize(null, out var deserializeResult);

        // Assert
        Assert.True(serializeSuccess);
        Assert.Null(serializeResult);
        Assert.True(deserializeSuccess);
        Assert.Null(deserializeResult);
    }

    [Fact]
    public void EmailType_LongEmail_ShouldBeRejected()
    {
        // Arrange
        var emailType = new EmailType();
        var longEmail = new string('a', 250) + "@example.com"; // Over 254 characters

        // Act
        var success = emailType.TrySerialize(longEmail, out var result);

        // Assert
        Assert.False(success);
        Assert.Null(result);
    }

    [Fact]
    public void UrlType_LongUrl_ShouldBeRejected()
    {
        // Arrange
        var urlType = new UrlType();
        var longUrl = "https://example.com/" + new string('a', 2050); // Over 2048 characters

        // Act
        var success = urlType.TrySerialize(longUrl, out var result);

        // Assert
        Assert.False(success);
        Assert.Null(result);
    }
}