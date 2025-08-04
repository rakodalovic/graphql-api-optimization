using BlogPlatform.Api.Data;
using BlogPlatform.Api.Models;
using BlogPlatform.Api.Services;
using HotChocolate.Authorization;
using HotChocolate.Subscriptions;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BlogPlatform.Api.GraphQL;

public class SimpleMutation
{
    public async Task<AuthPayload> LoginAsync(
        string username,
        string password,
        IAuthService authService)
    {
        var token = await authService.AuthenticateAsync(username, password);
        if (token == null)
        {
            throw new GraphQLException("Invalid username or password");
        }

        var user = await authService.GetUserByUsernameAsync(username);
        return new AuthPayload(token, user!);
    }

    public async Task<AuthPayload> RegisterAsync(
        string username,
        string email,
        string password,
        IAuthService authService)
    {
        try
        {
            var user = await authService.RegisterAsync(username, email, password);
            var token = authService.GenerateJwtToken(user);
            return new AuthPayload(token, user);
        }
        catch (InvalidOperationException ex)
        {
            throw new GraphQLException(ex.Message);
        }
    }

    [Authorize]
    public async Task<Post> CreatePostAsync(
        CreatePostInput input,
        ClaimsPrincipal claimsPrincipal,
        BlogDbContext context,
        ITopicEventSender eventSender)
    {
        var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
        {
            throw new GraphQLException("User not found");
        }

        var post = new Post
        {
            Title = input.Title,
            Content = input.Content,
            Summary = input.Summary,
            AuthorId = userId,
            CategoryId = input.CategoryId,
            IsPublished = input.IsPublished,
            PublishedAt = input.IsPublished ? DateTime.UtcNow : null
        };

        context.Posts.Add(post);
        await context.SaveChangesAsync();

        // Load the post with related data for the response
        await context.Entry(post)
            .Reference(p => p.Author)
            .LoadAsync();
        await context.Entry(post)
            .Reference(p => p.Category)
            .LoadAsync();

        if (post.IsPublished)
        {
            await eventSender.SendAsync(nameof(SimpleSubscription.OnPostPublished), post);
        }

        return post;
    }

    [Authorize]
    public async Task<Post> UpdatePostAsync(
        int id,
        UpdatePostInput input,
        ClaimsPrincipal claimsPrincipal,
        BlogDbContext context,
        ITopicEventSender eventSender)
    {
        var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier);
        var userRoleClaim = claimsPrincipal.FindFirst(ClaimTypes.Role);
        
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
        {
            throw new GraphQLException("User not found");
        }

        var post = await context.Posts.FindAsync(id);
        if (post == null)
        {
            throw new GraphQLException("Post not found");
        }

        // Check if user can edit this post
        if (post.AuthorId != userId && userRoleClaim?.Value != "Admin")
        {
            throw new GraphQLException("You can only edit your own posts");
        }

        var wasPublished = post.IsPublished;

        if (input.Title != null) post.Title = input.Title;
        if (input.Content != null) post.Content = input.Content;
        if (input.Summary != null) post.Summary = input.Summary;
        if (input.CategoryId.HasValue) post.CategoryId = input.CategoryId.Value;
        if (input.IsPublished.HasValue)
        {
            post.IsPublished = input.IsPublished.Value;
            if (input.IsPublished.Value && !wasPublished)
            {
                post.PublishedAt = DateTime.UtcNow;
            }
        }

        post.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        // Load related data
        await context.Entry(post)
            .Reference(p => p.Author)
            .LoadAsync();
        await context.Entry(post)
            .Reference(p => p.Category)
            .LoadAsync();

        if (post.IsPublished && !wasPublished)
        {
            await eventSender.SendAsync(nameof(SimpleSubscription.OnPostPublished), post);
        }

        return post;
    }

    [Authorize]
    public async Task<bool> DeletePostAsync(
        int id,
        ClaimsPrincipal claimsPrincipal,
        BlogDbContext context)
    {
        var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier);
        var userRoleClaim = claimsPrincipal.FindFirst(ClaimTypes.Role);
        
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
        {
            throw new GraphQLException("User not found");
        }

        var post = await context.Posts.FindAsync(id);
        if (post == null)
        {
            return false;
        }

        // Check if user can delete this post
        if (post.AuthorId != userId && userRoleClaim?.Value != "Admin")
        {
            throw new GraphQLException("You can only delete your own posts");
        }

        context.Posts.Remove(post);
        await context.SaveChangesAsync();
        return true;
    }

    [Authorize]
    public async Task<Comment> CreateCommentAsync(
        CreateCommentInput input,
        ClaimsPrincipal claimsPrincipal,
        BlogDbContext context,
        ITopicEventSender eventSender)
    {
        var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
        {
            throw new GraphQLException("User not found");
        }

        // Verify post exists and is published
        var post = await context.Posts.FindAsync(input.PostId);
        if (post == null || !post.IsPublished)
        {
            throw new GraphQLException("Post not found or not published");
        }

        var comment = new Comment
        {
            Content = input.Content,
            PostId = input.PostId,
            UserId = userId
        };

        context.Comments.Add(comment);
        await context.SaveChangesAsync();

        // Load related data
        await context.Entry(comment)
            .Reference(c => c.User)
            .LoadAsync();
        await context.Entry(comment)
            .Reference(c => c.Post)
            .LoadAsync();

        await eventSender.SendAsync($"{nameof(SimpleSubscription.OnCommentAdded)}_{input.PostId}", comment);

        return comment;
    }

    [Authorize]
    public async Task<Comment> UpdateCommentAsync(
        int id,
        string content,
        ClaimsPrincipal claimsPrincipal,
        BlogDbContext context)
    {
        var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier);
        var userRoleClaim = claimsPrincipal.FindFirst(ClaimTypes.Role);
        
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
        {
            throw new GraphQLException("User not found");
        }

        var comment = await context.Comments.FindAsync(id);
        if (comment == null)
        {
            throw new GraphQLException("Comment not found");
        }

        // Check if user can edit this comment
        if (comment.UserId != userId && userRoleClaim?.Value != "Admin")
        {
            throw new GraphQLException("You can only edit your own comments");
        }

        comment.Content = content;
        comment.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        // Load related data
        await context.Entry(comment)
            .Reference(c => c.User)
            .LoadAsync();
        await context.Entry(comment)
            .Reference(c => c.Post)
            .LoadAsync();

        return comment;
    }

    [Authorize]
    public async Task<bool> DeleteCommentAsync(
        int id,
        ClaimsPrincipal claimsPrincipal,
        BlogDbContext context)
    {
        var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier);
        var userRoleClaim = claimsPrincipal.FindFirst(ClaimTypes.Role);
        
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
        {
            throw new GraphQLException("User not found");
        }

        var comment = await context.Comments.FindAsync(id);
        if (comment == null)
        {
            return false;
        }

        // Check if user can delete this comment
        if (comment.UserId != userId && userRoleClaim?.Value != "Admin")
        {
            throw new GraphQLException("You can only delete your own comments");
        }

        context.Comments.Remove(comment);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<Category> CreateCategoryAsync(
        CreateCategoryInput input,
        BlogDbContext context)
    {
        var category = new Category
        {
            Name = input.Name,
            Description = input.Description
        };

        context.Categories.Add(category);
        await context.SaveChangesAsync();
        return category;
    }
}

// Input types
public record CreatePostInput(string Title, string Content, string? Summary, int CategoryId, bool IsPublished = false);
public record UpdatePostInput(string? Title, string? Content, string? Summary, int? CategoryId, bool? IsPublished);
public record CreateCommentInput(string Content, int PostId);
public record CreateCategoryInput(string Name, string? Description);
public record AuthPayload(string Token, User User);