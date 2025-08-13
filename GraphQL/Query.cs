using GraphQLApi.Data;
using GraphQLApi.Models;
using HotChocolate;
using HotChocolate.Data;
using Microsoft.EntityFrameworkCore;

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

    // User queries
    [UseDbContext(typeof(ApplicationDbContext))]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<User> GetUsers([Service] ApplicationDbContext context)
        => context.Users.Where(u => u.IsActive);

    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<User?> GetUser([Service] ApplicationDbContext context, int id)
        => await context.Users
            .Include(u => u.Profile)
            .Include(u => u.Preferences)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == id && u.IsActive);

    // Product queries
    [UseDbContext(typeof(ApplicationDbContext))]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Product> GetProducts([Service] ApplicationDbContext context)
        => context.Products.Where(p => p.IsActive);

    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<Product?> GetProduct([Service] ApplicationDbContext context, int id)
        => await context.Products
            .Include(p => p.Category)
            .Include(p => p.Variants)
            .Include(p => p.Images)
            .Include(p => p.Reviews.Where(r => r.IsApproved))
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

    // Category queries
    [UseDbContext(typeof(ApplicationDbContext))]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Category> GetCategories([Service] ApplicationDbContext context)
        => context.Categories.Where(c => c.IsActive);

    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<Category?> GetCategory([Service] ApplicationDbContext context, int id)
        => await context.Categories
            .Include(c => c.ParentCategory)
            .Include(c => c.SubCategories.Where(sc => sc.IsActive))
            .Include(c => c.Products.Where(p => p.IsActive))
            .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

    // Order queries
    [UseDbContext(typeof(ApplicationDbContext))]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Order> GetOrders([Service] ApplicationDbContext context)
        => context.Orders;

    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<Order?> GetOrder([Service] ApplicationDbContext context, int id)
        => await context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Include(o => o.ShippingAddress)
            .Include(o => o.BillingAddress)
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == id);

    // Review queries
    [UseDbContext(typeof(ApplicationDbContext))]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Review> GetReviews([Service] ApplicationDbContext context)
        => context.Reviews.Where(r => r.IsApproved);

    // Cart queries
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<Cart?> GetActiveCart([Service] ApplicationDbContext context, int userId)
        => await context.Carts
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.ProductVariant)
            .FirstOrDefaultAsync(c => c.UserId == userId && c.IsActive);

    // Tag queries
    [UseDbContext(typeof(ApplicationDbContext))]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Models.Tag> GetTags([Service] ApplicationDbContext context)
        => context.Tags.Where(t => t.IsActive);

    // Notification queries
    [UseDbContext(typeof(ApplicationDbContext))]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Notification> GetNotifications([Service] ApplicationDbContext context, int userId)
        => context.Notifications.Where(n => n.UserId == userId && !n.IsArchived);

    // Statistics queries
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<DashboardStats> GetDashboardStats([Service] ApplicationDbContext context)
    {
        var totalUsers = await context.Users.CountAsync(u => u.IsActive);
        var totalProducts = await context.Products.CountAsync(p => p.IsActive);
        var totalOrders = await context.Orders.CountAsync();
        
        // SQLite doesn't support SUM on decimal types directly, so we convert to double first
        var totalRevenueDouble = await context.Orders
            .Where(o => o.Status == OrderStatus.Delivered)
            .SumAsync(o => (double)o.TotalAmount);
        
        // Convert back to decimal for the response
        var totalRevenue = (decimal)totalRevenueDouble;

        return new DashboardStats
        {
            TotalUsers = totalUsers,
            TotalProducts = totalProducts,
            TotalOrders = totalOrders,
            TotalRevenue = totalRevenue
        };
    }
}

public record ApiVersion
{
    public string Version { get; init; } = string.Empty;
    public string Environment { get; init; } = string.Empty;
    public DateTime BuildDate { get; init; }
}

public record DashboardStats
{
    public int TotalUsers { get; init; }
    public int TotalProducts { get; init; }
    public int TotalOrders { get; init; }
    public decimal TotalRevenue { get; init; }
}