using BlogPlatform.Api.GraphQL;
using FluentAssertions;
using Xunit;

namespace BlogPlatform.Tests.GraphQL;

public class SimpleQueryTests
{
    [Fact]
    public void SimpleQuery_ShouldBeInstantiable()
    {
        // Act
        var query = new SimpleQuery();

        // Assert
        query.Should().NotBeNull();
    }

    [Fact]
    public void SimpleMutation_ShouldBeInstantiable()
    {
        // Act
        var mutation = new SimpleMutation();

        // Assert
        mutation.Should().NotBeNull();
    }

    [Fact]
    public void SimpleSubscription_ShouldBeInstantiable()
    {
        // Act
        var subscription = new SimpleSubscription();

        // Assert
        subscription.Should().NotBeNull();
    }
}