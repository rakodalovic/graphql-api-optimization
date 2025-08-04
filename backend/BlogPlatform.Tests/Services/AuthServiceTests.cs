using BlogPlatform.Api.Models;
using FluentAssertions;
using Xunit;

namespace BlogPlatform.Tests.Services;

public class AuthServiceTests
{
    [Fact]
    public void User_Model_ShouldHaveRequiredProperties()
    {
        // Arrange & Act
        var user = new User
        {
            Id = 1,
            Username = "testuser",
            Email = "test@example.com",
            PasswordHash = "hashedpassword",
            Role = "User",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Assert
        user.Id.Should().Be(1);
        user.Username.Should().Be("testuser");
        user.Email.Should().Be("test@example.com");
        user.Role.Should().Be("User");
        user.PasswordHash.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public void Post_Model_ShouldHaveRequiredProperties()
    {
        // Arrange & Act
        var post = new Post
        {
            Id = 1,
            Title = "Test Post",
            Content = "Test content",
            Summary = "Test summary",
            AuthorId = 1,
            CategoryId = 1,
            IsPublished = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            PublishedAt = DateTime.UtcNow
        };

        // Assert
        post.Id.Should().Be(1);
        post.Title.Should().Be("Test Post");
        post.Content.Should().Be("Test content");
        post.IsPublished.Should().BeTrue();
    }

    [Fact]
    public void Comment_Model_ShouldHaveRequiredProperties()
    {
        // Arrange & Act
        var comment = new Comment
        {
            Id = 1,
            Content = "Test comment",
            PostId = 1,
            UserId = 1,
            CreatedAt = DateTime.UtcNow
        };

        // Assert
        comment.Id.Should().Be(1);
        comment.Content.Should().Be("Test comment");
        comment.PostId.Should().Be(1);
        comment.UserId.Should().Be(1);
    }

    [Fact]
    public void Category_Model_ShouldHaveRequiredProperties()
    {
        // Arrange & Act
        var category = new Category
        {
            Id = 1,
            Name = "Technology",
            Description = "Tech posts",
            CreatedAt = DateTime.UtcNow
        };

        // Assert
        category.Id.Should().Be(1);
        category.Name.Should().Be("Technology");
        category.Description.Should().Be("Tech posts");
    }
}