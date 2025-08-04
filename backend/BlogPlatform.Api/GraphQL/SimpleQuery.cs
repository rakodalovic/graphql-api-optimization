using BlogPlatform.Api.Data;
using BlogPlatform.Api.Models;
using BlogPlatform.Api.Services;
using HotChocolate.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BlogPlatform.Api.GraphQL;

public class SimpleQuery
{
    public async Task<IEnumerable<Post>> GetPostsAsync(BlogDbContext context)
    {
        return await context.Posts
            .Where(p => p.IsPublished)
            .Include(p => p.Author)
            .Include(p => p.Category)
            .OrderByDescending(p => p.PublishedAt)
            .ToListAsync();
    }

    public async Task<Post?> GetPostAsync(int id, BlogDbContext context)
    {
        return await context.Posts
            .Include(p => p.Author)
            .Include(p => p.Category)
            .Include(p => p.Comments)
                .ThenInclude(c => c.User)
            .FirstOrDefaultAsync(p => p.Id == id && p.IsPublished);
    }

    public async Task<IEnumerable<Category>> GetCategoriesAsync(BlogDbContext context)
    {
        return await context.Categories.ToListAsync();
    }

    public async Task<Category?> GetCategoryAsync(int id, BlogDbContext context)
    {
        return await context.Categories
            .Include(c => c.Posts.Where(p => p.IsPublished))
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IEnumerable<Comment>> GetCommentsAsync(int postId, BlogDbContext context)
    {
        return await context.Comments
            .Where(c => c.PostId == postId)
            .Include(c => c.User)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetUsersAsync(BlogDbContext context)
    {
        return await context.Users.ToListAsync();
    }

    public async Task<User?> GetUserAsync(int id, BlogDbContext context)
    {
        return await context.Users
            .Include(u => u.Posts.Where(p => p.IsPublished))
            .Include(u => u.Comments)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetMeAsync(
        ClaimsPrincipal claimsPrincipal,
        IAuthService authService)
    {
        var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId))
        {
            return await authService.GetUserByIdAsync(userId);
        }
        return null;
    }

    public async Task<IEnumerable<Post>> SearchPostsAsync(
        string searchTerm,
        BlogDbContext context)
    {
        return await context.Posts
            .Where(p => p.IsPublished && 
                       (p.Title.Contains(searchTerm) || 
                        p.Content.Contains(searchTerm) || 
                        (p.Summary != null && p.Summary.Contains(searchTerm))))
            .Include(p => p.Author)
            .Include(p => p.Category)
            .OrderByDescending(p => p.PublishedAt)
            .Take(20)
            .ToListAsync();
    }
}