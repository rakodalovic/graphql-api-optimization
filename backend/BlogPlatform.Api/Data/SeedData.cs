using BlogPlatform.Api.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace BlogPlatform.Api.Data;

public static class SeedData
{
    public static async Task InitializeAsync(BlogDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        // Check if data already exists
        if (await context.Users.AnyAsync())
        {
            return; // Database has been seeded
        }

        // Seed Categories
        var categories = new[]
        {
            new Category { Name = "Technology", Description = "Posts about technology and programming" },
            new Category { Name = "Science", Description = "Scientific discoveries and research" },
            new Category { Name = "Travel", Description = "Travel experiences and guides" },
            new Category { Name = "Food", Description = "Recipes and food reviews" },
            new Category { Name = "Lifestyle", Description = "Lifestyle tips and personal experiences" }
        };

        await context.Categories.AddRangeAsync(categories);
        await context.SaveChangesAsync();

        // Seed Users
        var users = new[]
        {
            new User
            {
                Username = "admin",
                Email = "admin@blogplatform.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                Role = "Admin"
            },
            new User
            {
                Username = "author1",
                Email = "author1@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                Role = "Author"
            },
            new User
            {
                Username = "author2",
                Email = "author2@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                Role = "Author"
            },
            new User
            {
                Username = "user1",
                Email = "user1@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                Role = "User"
            },
            new User
            {
                Username = "user2",
                Email = "user2@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                Role = "User"
            }
        };

        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();

        // Seed Posts
        var posts = new[]
        {
            new Post
            {
                Title = "Introduction to GraphQL",
                Content = "GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.",
                Summary = "Learn the basics of GraphQL and how it differs from REST APIs.",
                AuthorId = users[1].Id,
                CategoryId = categories[0].Id,
                IsPublished = true,
                PublishedAt = DateTime.UtcNow.AddDays(-10)
            },
            new Post
            {
                Title = "Building Modern Web Applications",
                Content = "Modern web applications require careful consideration of performance, scalability, and user experience. In this post, we'll explore best practices for building web applications that can handle high traffic and provide excellent user experiences.",
                Summary = "Best practices for building scalable and performant web applications.",
                AuthorId = users[1].Id,
                CategoryId = categories[0].Id,
                IsPublished = true,
                PublishedAt = DateTime.UtcNow.AddDays(-8)
            },
            new Post
            {
                Title = "The Future of Space Exploration",
                Content = "Space exploration has come a long way since the first moon landing. With private companies entering the space race and new technologies being developed, the future of space exploration looks brighter than ever. From Mars colonization to asteroid mining, the possibilities are endless.",
                Summary = "Exploring the exciting future of space exploration and colonization.",
                AuthorId = users[2].Id,
                CategoryId = categories[1].Id,
                IsPublished = true,
                PublishedAt = DateTime.UtcNow.AddDays(-6)
            },
            new Post
            {
                Title = "Hidden Gems of Europe",
                Content = "Europe is full of hidden gems waiting to be discovered. From small medieval towns to breathtaking natural landscapes, there's so much more to Europe than the popular tourist destinations. In this guide, we'll explore some of the most beautiful and lesser-known places in Europe.",
                Summary = "Discover Europe's best-kept secrets and hidden travel destinations.",
                AuthorId = users[2].Id,
                CategoryId = categories[2].Id,
                IsPublished = true,
                PublishedAt = DateTime.UtcNow.AddDays(-4)
            },
            new Post
            {
                Title = "Healthy Cooking on a Budget",
                Content = "Eating healthy doesn't have to break the bank. With some planning and creativity, you can prepare nutritious and delicious meals without spending a fortune. Here are some tips and recipes for healthy cooking on a budget.",
                Summary = "Tips and recipes for maintaining a healthy diet without overspending.",
                AuthorId = users[1].Id,
                CategoryId = categories[3].Id,
                IsPublished = true,
                PublishedAt = DateTime.UtcNow.AddDays(-2)
            },
            new Post
            {
                Title = "Work-Life Balance in the Digital Age",
                Content = "In today's digital age, maintaining a healthy work-life balance has become more challenging than ever. With remote work becoming the norm and technology keeping us connected 24/7, it's important to set boundaries and prioritize our well-being.",
                Summary = "Strategies for maintaining work-life balance in our connected world.",
                AuthorId = users[2].Id,
                CategoryId = categories[4].Id,
                IsPublished = false
            }
        };

        await context.Posts.AddRangeAsync(posts);
        await context.SaveChangesAsync();

        // Seed Comments
        var comments = new[]
        {
            new Comment
            {
                Content = "Great introduction to GraphQL! I've been wanting to learn more about it.",
                PostId = posts[0].Id,
                UserId = users[3].Id
            },
            new Comment
            {
                Content = "This really helped me understand the benefits of GraphQL over REST.",
                PostId = posts[0].Id,
                UserId = users[4].Id
            },
            new Comment
            {
                Content = "Excellent tips! I'll definitely try implementing these in my next project.",
                PostId = posts[1].Id,
                UserId = users[3].Id
            },
            new Comment
            {
                Content = "Fascinating article! Can't wait to see what the future holds for space exploration.",
                PostId = posts[2].Id,
                UserId = users[3].Id
            },
            new Comment
            {
                Content = "I've been to some of these places and they're absolutely beautiful!",
                PostId = posts[3].Id,
                UserId = users[4].Id
            },
            new Comment
            {
                Content = "Thanks for sharing these budget-friendly recipes. My wallet appreciates it!",
                PostId = posts[4].Id,
                UserId = users[3].Id
            }
        };

        await context.Comments.AddRangeAsync(comments);
        await context.SaveChangesAsync();
    }
}