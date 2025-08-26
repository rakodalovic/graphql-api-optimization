using GraphQLApi.Data;
using GraphQLApi.Models;
using GraphQLApi.GraphQL.Types;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Data.Sorting;
using HotChocolate.Resolvers;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace GraphQLApi.GraphQL;

public class Query
{
    public ApiVersion GetVersion() => new ApiVersion
    {
        Version = "1.0.0",
        Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production",
        BuildDate = DateTime.UtcNow
    };

    // User queries
    [UseDbContext(typeof(ApplicationDbContext))]
    [UsePaging]
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
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    public IQueryable<Product> GetProducts([Service] ApplicationDbContext context, IResolverContext resolverContext)
    {
        var products = context.Products.Where(p => p.IsActive);
        
        // Handle sorting manually to fix SQLite decimal ordering issues
        var orderArgument = resolverContext.ArgumentValue<IReadOnlyList<object>>("order");
        if (orderArgument != null && orderArgument.Count > 0)
        {
            // Convert to list to handle sorting in memory for SQLite decimal fields
            var productList = products.ToList();
            
            foreach (var orderItem in orderArgument)
            {
                if (orderItem is IReadOnlyDictionary<string, object> orderDict)
                {
                    foreach (var kvp in orderDict)
                    {
                        var fieldName = kvp.Key.ToLower();
                        var direction = kvp.Value?.ToString()?.ToUpper();
                        
                        switch (fieldName)
                        {
                            case "price":
                                productList = direction == "DESC" 
                                    ? productList.OrderByDescending(p => p.Price).ToList()
                                    : productList.OrderBy(p => p.Price).ToList();
                                break;
                            case "compareatprice":
                                productList = direction == "DESC" 
                                    ? productList.OrderByDescending(p => p.CompareAtPrice ?? 0).ToList()
                                    : productList.OrderBy(p => p.CompareAtPrice ?? 0).ToList();
                                break;
                            case "costprice":
                                productList = direction == "DESC" 
                                    ? productList.OrderByDescending(p => p.CostPrice ?? 0).ToList()
                                    : productList.OrderBy(p => p.CostPrice ?? 0).ToList();
                                break;
                            case "name":
                                productList = direction == "DESC" 
                                    ? productList.OrderByDescending(p => p.Name).ToList()
                                    : productList.OrderBy(p => p.Name).ToList();
                                break;
                            case "createdat":
                                productList = direction == "DESC" 
                                    ? productList.OrderByDescending(p => p.CreatedAt).ToList()
                                    : productList.OrderBy(p => p.CreatedAt).ToList();
                                break;
                            case "updatedat":
                                productList = direction == "DESC" 
                                    ? productList.OrderByDescending(p => p.UpdatedAt).ToList()
                                    : productList.OrderBy(p => p.UpdatedAt).ToList();
                                break;
                            case "stockquantity":
                                productList = direction == "DESC" 
                                    ? productList.OrderByDescending(p => p.StockQuantity).ToList()
                                    : productList.OrderBy(p => p.StockQuantity).ToList();
                                break;
                            default:
                                // For other fields, try to sort by name as fallback
                                productList = productList.OrderBy(p => p.Name).ToList();
                                break;
                        }
                        // Only apply the first sort order to keep it simple
                        break;
                    }
                    // Only process the first order item
                    break;
                }
            }
            
            return productList.AsQueryable();
        }
        
        return products;
    }

    // Products sorted by price - handles SQLite decimal sorting limitation
    [UseDbContext(typeof(ApplicationDbContext))]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    public IQueryable<Product> GetProductsSortedByPrice([Service] ApplicationDbContext context, bool ascending = true)
    {
        var products = context.Products.Where(p => p.IsActive).ToList();
        
        if (ascending)
        {
            return products.OrderBy(p => p.Price).AsQueryable();
        }
        else
        {
            return products.OrderByDescending(p => p.Price).AsQueryable();
        }
    }

    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<Product?> GetProduct([Service] ApplicationDbContext context, int id)
    {
        var product = await context.Products
            .Include(p => p.Category)
            .Include(p => p.Variants)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

        if (product != null)
        {
            // Load approved reviews separately to ensure proper initialization
            var approvedReviews = await context.Reviews
                .Include(r => r.User)
                .Where(r => r.ProductId == id && r.IsApproved)
                .ToListAsync();
            
            product.Reviews = approvedReviews;
        }

        return product;
    }

    // Category queries
    [UseDbContext(typeof(ApplicationDbContext))]
    [UsePaging]
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
    [UsePaging]
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
    [UsePaging]
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
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Models.Tag> GetTags([Service] ApplicationDbContext context)
        => context.Tags.Where(t => t.IsActive);

    // Notification queries
    [UseDbContext(typeof(ApplicationDbContext))]
    [UsePaging]
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
        
        var totalRevenueDouble = await context.Orders
            .Where(o => o.Status == OrderStatus.Delivered)
            .SumAsync(o => (double)o.TotalAmount);
        
        var totalRevenue = (decimal)totalRevenueDouble;

        return new DashboardStats
        {
            TotalUsers = totalUsers,
            TotalProducts = totalProducts,
            TotalOrders = totalOrders,
            TotalRevenue = totalRevenue
        };
    }

    // Search functionality returning SearchResult union
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<SearchResults> Search([Service] ApplicationDbContext context, string searchTerm)
    {
        var results = new SearchResults();

        if (string.IsNullOrWhiteSpace(searchTerm))
            return results;

        var searchTermLower = searchTerm.ToLower();

        // Search users
        results.Users = await context.Users
            .Where(u => u.IsActive && 
                (u.FirstName.ToLower().Contains(searchTermLower) ||
                 u.LastName.ToLower().Contains(searchTermLower) ||
                 u.Username.ToLower().Contains(searchTermLower) ||
                 u.Email.ToLower().Contains(searchTermLower)))
            .Take(10)
            .ToListAsync();

        // Search products
        results.Products = await context.Products
            .Where(p => p.IsActive && 
                (p.Name.ToLower().Contains(searchTermLower) ||
                 (p.Description != null && p.Description.ToLower().Contains(searchTermLower)) ||
                 (p.Sku != null && p.Sku.ToLower().Contains(searchTermLower))))
            .Take(10)
            .ToListAsync();

        // Search categories
        results.Categories = await context.Categories
            .Where(c => c.IsActive && 
                (c.Name.ToLower().Contains(searchTermLower) ||
                 (c.Description != null && c.Description.ToLower().Contains(searchTermLower))))
            .Take(10)
            .ToListAsync();

        return results;
    }

    // Payment method queries
    [UseDbContext(typeof(ApplicationDbContext))]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<CreditCardPayment> GetCreditCardPayments([Service] ApplicationDbContext context)
        => context.CreditCardPayments;

    [UseDbContext(typeof(ApplicationDbContext))]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<PaypalPayment> GetPaypalPayments([Service] ApplicationDbContext context)
        => context.PaypalPayments;

    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<PaymentMethodResults> GetPaymentMethods([Service] ApplicationDbContext context, int paymentId)
    {
        var results = new PaymentMethodResults();

        results.CreditCardPayments = await context.CreditCardPayments
            .Where(ccp => ccp.PaymentId == paymentId)
            .ToListAsync();

        results.PaypalPayments = await context.PaypalPayments
            .Where(pp => pp.PaymentId == paymentId)
            .ToListAsync();

        return results;
    }

    // Example query to demonstrate custom scalars and enums
    public ExampleType GetExampleWithCustomTypes()
    {
        return new ExampleType
        {
            Id = 1,
            Email = "example@test.com",
            Website = "https://example.com",
            Metadata = JsonSerializer.Deserialize<JsonElement>("{\"key\": \"value\", \"number\": 42}"),
            OrderStatus = OrderStatus.Processing,
            PaymentStatus = PaymentStatus.Completed
        };
    }

    // Query to get all possible order statuses
    public OrderStatus[] GetOrderStatuses()
    {
        return Enum.GetValues<OrderStatus>();
    }

    // Query to get all possible payment statuses
    public PaymentStatus[] GetPaymentStatuses()
    {
        return Enum.GetValues<PaymentStatus>();
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

public class SearchResults
{
    public List<User> Users { get; set; } = new List<User>();
    public List<Product> Products { get; set; } = new List<Product>();
    public List<Category> Categories { get; set; } = new List<Category>();
}

public class PaymentMethodResults
{
    public List<CreditCardPayment> CreditCardPayments { get; set; } = new List<CreditCardPayment>();
    public List<PaypalPayment> PaypalPayments { get; set; } = new List<PaypalPayment>();
}