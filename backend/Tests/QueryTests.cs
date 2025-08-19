using GraphQLApi.Data;
using GraphQLApi.GraphQL;
using GraphQLApi.Models;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GraphQLApi.Tests;

public class QueryTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly Query _query;

    public QueryTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlite("Data Source=:memory:")
            .Options;

        _context = new ApplicationDbContext(options);
        _context.Database.OpenConnection();
        _context.Database.EnsureCreated();
        
        _query = new Query();
        SeedTestData();
    }

    private void SeedTestData()
    {
        // Add test categories
        var category = new Category 
        { 
            Id = 1, 
            Name = "Electronics", 
            Slug = "electronics", 
            IsActive = true 
        };
        _context.Categories.Add(category);

        // Add test users
        var users = new List<User>
        {
            new() { 
                Id = 1, 
                Username = "john_doe", 
                Email = "john@test.com", 
                FirstName = "John",
                LastName = "Doe",
                PasswordHash = "hashedpassword",
                IsActive = true 
            },
            new() { 
                Id = 2, 
                Username = "jane_smith", 
                Email = "jane@test.com", 
                FirstName = "Jane",
                LastName = "Smith",
                PasswordHash = "hashedpassword",
                IsActive = true 
            },
            new() { 
                Id = 3, 
                Username = "inactive_user", 
                Email = "inactive@test.com", 
                FirstName = "Inactive",
                LastName = "User",
                PasswordHash = "hashedpassword",
                IsActive = false 
            }
        };
        _context.Users.AddRange(users);

        // Add test products
        var products = new List<Product>
        {
            new() { 
                Id = 1, 
                Name = "Laptop", 
                Description = "High-performance laptop",
                Sku = "LAP001",
                Price = 999.99m, 
                StockQuantity = 10,
                CategoryId = 1, 
                IsActive = true 
            },
            new() { 
                Id = 2, 
                Name = "Mouse", 
                Description = "Wireless mouse",
                Sku = "MOU001",
                Price = 29.99m, 
                StockQuantity = 50,
                CategoryId = 1, 
                IsActive = true 
            },
            new() { 
                Id = 3, 
                Name = "Discontinued Product", 
                Description = "Old product",
                Sku = "OLD001",
                Price = 99.99m, 
                StockQuantity = 0,
                CategoryId = 1, 
                IsActive = false 
            }
        };
        _context.Products.AddRange(products);

        // Add test orders
        var orders = new List<Order>
        {
            new() 
            { 
                Id = 1, 
                OrderNumber = "ORD-001", 
                UserId = 1, 
                Status = OrderStatus.Delivered, 
                TotalAmount = 999.99m,
                SubtotalAmount = 999.99m,
                Currency = "USD"
            },
            new() 
            { 
                Id = 2, 
                OrderNumber = "ORD-002", 
                UserId = 2, 
                Status = OrderStatus.Processing, 
                TotalAmount = 29.99m,
                SubtotalAmount = 29.99m,
                Currency = "USD"
            }
        };
        _context.Orders.AddRange(orders);

        _context.SaveChanges();
    }

    [Fact]
    public void GetUsers_ShouldReturnOnlyActiveUsers()
    {
        // Act
        var result = _query.GetUsers(_context).ToList();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.All(result, user => Assert.True(user.IsActive));
        Assert.Contains(result, u => u.Username == "john_doe");
        Assert.Contains(result, u => u.Username == "jane_smith");
        Assert.DoesNotContain(result, u => u.Username == "inactive_user");
    }

    [Fact]
    public async Task GetUser_WithValidId_ShouldReturnUser()
    {
        // Act
        var result = await _query.GetUser(_context, 1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("john_doe", result.Username);
        Assert.Equal("john@test.com", result.Email);
        Assert.True(result.IsActive);
    }

    [Fact]
    public async Task GetUser_WithInvalidId_ShouldReturnNull()
    {
        // Act
        var result = await _query.GetUser(_context, 999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetUser_WithInactiveUserId_ShouldReturnNull()
    {
        // Act
        var result = await _query.GetUser(_context, 3);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public void GetProducts_ShouldReturnOnlyActiveProducts()
    {
        // Act
        var result = _query.GetProducts(_context).ToList();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.All(result, product => Assert.True(product.IsActive));
        Assert.Contains(result, p => p.Name == "Laptop");
        Assert.Contains(result, p => p.Name == "Mouse");
        Assert.DoesNotContain(result, p => p.Name == "Discontinued Product");
    }

    [Fact]
    public async Task GetProduct_WithValidId_ShouldReturnProduct()
    {
        // Act
        var result = await _query.GetProduct(_context, 1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Laptop", result.Name);
        Assert.Equal("LAP001", result.Sku);
        Assert.Equal(999.99m, result.Price);
        Assert.True(result.IsActive);
    }

    [Fact]
    public async Task GetProduct_WithInvalidId_ShouldReturnNull()
    {
        // Act
        var result = await _query.GetProduct(_context, 999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetProduct_WithInactiveProductId_ShouldReturnNull()
    {
        // Act
        var result = await _query.GetProduct(_context, 3);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetOrder_WithValidId_ShouldReturnOrder()
    {
        // Act
        var result = await _query.GetOrder(_context, 1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("ORD-001", result.OrderNumber);
        Assert.Equal(1, result.UserId);
        Assert.Equal(OrderStatus.Delivered, result.Status);
        Assert.Equal(999.99m, result.TotalAmount);
    }

    [Fact]
    public async Task GetOrder_WithInvalidId_ShouldReturnNull()
    {
        // Act
        var result = await _query.GetOrder(_context, 999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task Search_WithValidTerm_ShouldReturnResults()
    {
        // Act
        var result = await _query.Search(_context, "laptop");

        // Assert
        Assert.NotNull(result);
        Assert.Single(result.Products);
        Assert.Equal("Laptop", result.Products.First().Name);
        Assert.Empty(result.Users);
        Assert.Empty(result.Categories);
    }

    [Fact]
    public async Task Search_WithUserTerm_ShouldReturnUsers()
    {
        // Act
        var result = await _query.Search(_context, "john");

        // Assert
        Assert.NotNull(result);
        Assert.Single(result.Users);
        Assert.Equal("john_doe", result.Users.First().Username);
        Assert.Empty(result.Products);
        Assert.Empty(result.Categories);
    }

    [Fact]
    public async Task Search_WithEmptyTerm_ShouldReturnEmptyResults()
    {
        // Act
        var result = await _query.Search(_context, "");

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result.Users);
        Assert.Empty(result.Products);
        Assert.Empty(result.Categories);
    }

    [Fact]
    public async Task Search_WithNonExistentTerm_ShouldReturnEmptyResults()
    {
        // Act
        var result = await _query.Search(_context, "nonexistent");

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result.Users);
        Assert.Empty(result.Products);
        Assert.Empty(result.Categories);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Database.CloseConnection();
        _context.Dispose();
    }
}