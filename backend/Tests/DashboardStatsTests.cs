using GraphQLApi.Data;
using GraphQLApi.GraphQL;
using GraphQLApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace GraphQLApi.Tests;

public class DashboardStatsTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly Query _query;

    public DashboardStatsTests()
    {
        // Setup in-memory SQLite database for testing
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlite("Data Source=:memory:")
            .Options;

        _context = new ApplicationDbContext(options);
        
        // Open the connection to keep the in-memory database alive
        _context.Database.OpenConnection();
        
        // Create the database schema
        _context.Database.EnsureCreated();
        
        _query = new Query();
        
        // Seed test data
        SeedTestData();
    }

    private void SeedTestData()
    {
        // Add test users
        var users = new List<User>
        {
            new() { Id = 1, Username = "user1", Email = "user1@test.com", IsActive = true },
            new() { Id = 2, Username = "user2", Email = "user2@test.com", IsActive = true },
            new() { Id = 3, Username = "user3", Email = "user3@test.com", IsActive = false } // Inactive user
        };
        _context.Users.AddRange(users);

        // Add test categories
        var category = new Category 
        { 
            Id = 1, 
            Name = "Test Category", 
            Slug = "test-category", 
            IsActive = true 
        };
        _context.Categories.Add(category);

        // Add test products
        var products = new List<Product>
        {
            new() { Id = 1, Name = "Product 1", Price = 100.50m, CategoryId = 1, IsActive = true },
            new() { Id = 2, Name = "Product 2", Price = 200.75m, CategoryId = 1, IsActive = true },
            new() { Id = 3, Name = "Product 3", Price = 300.25m, CategoryId = 1, IsActive = false } // Inactive product
        };
        _context.Products.AddRange(products);

        // Add test orders with different statuses
        var orders = new List<Order>
        {
            new() 
            { 
                Id = 1, 
                OrderNumber = "ORD-001", 
                UserId = 1, 
                Status = OrderStatus.Delivered, 
                TotalAmount = 150.75m,
                SubtotalAmount = 150.75m
            },
            new() 
            { 
                Id = 2, 
                OrderNumber = "ORD-002", 
                UserId = 2, 
                Status = OrderStatus.Delivered, 
                TotalAmount = 299.99m,
                SubtotalAmount = 299.99m
            },
            new() 
            { 
                Id = 3, 
                OrderNumber = "ORD-003", 
                UserId = 1, 
                Status = OrderStatus.Pending, 
                TotalAmount = 75.50m, // This should not be counted in revenue
                SubtotalAmount = 75.50m
            }
        };
        _context.Orders.AddRange(orders);

        _context.SaveChanges();
    }

    [Fact]
    public async Task GetDashboardStats_ShouldReturnCorrectCounts()
    {
        // Act
        var result = await _query.GetDashboardStats(_context);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.TotalUsers); // Only active users
        Assert.Equal(2, result.TotalProducts); // Only active products
        Assert.Equal(3, result.TotalOrders); // All orders
    }

    [Fact]
    public async Task GetDashboardStats_ShouldCalculateRevenueCorrectly()
    {
        // Act
        var result = await _query.GetDashboardStats(_context);

        // Assert
        Assert.NotNull(result);
        // Only orders with Delivered status should be counted: 150.75 + 299.99 = 450.74
        Assert.Equal(450.74m, result.TotalRevenue);
    }

    [Fact]
    public async Task GetDashboardStats_WithNoDeliveredOrders_ShouldReturnZeroRevenue()
    {
        // Arrange - Update all orders to non-delivered status
        var orders = await _context.Orders.ToListAsync();
        foreach (var order in orders)
        {
            order.Status = OrderStatus.Pending;
        }
        await _context.SaveChangesAsync();

        // Act
        var result = await _query.GetDashboardStats(_context);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(0m, result.TotalRevenue);
    }

    [Fact]
    public async Task GetDashboardStats_WithEmptyDatabase_ShouldReturnZeros()
    {
        // Arrange - Clear all data
        _context.Orders.RemoveRange(_context.Orders);
        _context.Products.RemoveRange(_context.Products);
        _context.Users.RemoveRange(_context.Users);
        await _context.SaveChangesAsync();

        // Act
        var result = await _query.GetDashboardStats(_context);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(0, result.TotalUsers);
        Assert.Equal(0, result.TotalProducts);
        Assert.Equal(0, result.TotalOrders);
        Assert.Equal(0m, result.TotalRevenue);
    }

    [Fact]
    public async Task GetDashboardStats_WithLargeDecimalAmounts_ShouldHandleCorrectly()
    {
        // Arrange - Add an order with a large decimal amount
        var largeOrder = new Order
        {
            Id = 4,
            OrderNumber = "ORD-004",
            UserId = 1,
            Status = OrderStatus.Delivered,
            TotalAmount = 999999.99m, // Large decimal amount
            SubtotalAmount = 999999.99m
        };
        _context.Orders.Add(largeOrder);
        await _context.SaveChangesAsync();

        // Act
        var result = await _query.GetDashboardStats(_context);

        // Assert
        Assert.NotNull(result);
        // Should be 150.75 + 299.99 + 999999.99 = 1000450.73
        Assert.Equal(1000450.73m, result.TotalRevenue);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Database.CloseConnection();
        _context.Dispose();
    }
}