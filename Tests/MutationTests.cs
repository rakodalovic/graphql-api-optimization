using GraphQLApi.Data;
using GraphQLApi.GraphQL;
using GraphQLApi.Models;
using Microsoft.EntityFrameworkCore;
using HotChocolate.Subscriptions;
using Moq;
using Xunit;

namespace GraphQLApi.Tests;

public class MutationTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly Mutation _mutation;
    private readonly Mock<ITopicEventSender> _mockEventSender;

    public MutationTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlite("Data Source=:memory:")
            .Options;

        _context = new ApplicationDbContext(options);
        _context.Database.OpenConnection();
        _context.Database.EnsureCreated();
        
        _mutation = new Mutation();
        _mockEventSender = new Mock<ITopicEventSender>();
        
        SeedTestData();
    }

    private void SeedTestData()
    {
        // Add test category
        var category = new Category 
        { 
            Id = 1, 
            Name = "Electronics", 
            Slug = "electronics", 
            IsActive = true 
        };
        _context.Categories.Add(category);

        // Add test role
        var role = new Role
        {
            Id = 1,
            Name = "Customer",
            Description = "Regular customer role",
            IsActive = true
        };
        _context.Roles.Add(role);

        // Add test user
        var user = new User
        {
            Id = 1,
            Username = "existing_user",
            Email = "existing@test.com",
            FirstName = "Existing",
            LastName = "User",
            PasswordHash = "hashedpassword",
            IsActive = true
        };
        _context.Users.Add(user);

        // Add test product
        var product = new Product
        {
            Id = 1,
            Name = "Test Product",
            Description = "A test product",
            Sku = "TEST001",
            Price = 99.99m,
            StockQuantity = 10,
            CategoryId = 1,
            IsActive = true
        };
        _context.Products.Add(product);

        _context.SaveChanges();
    }

    [Fact]
    public async Task CreateUser_WithValidInput_ShouldCreateUser()
    {
        // Arrange
        var input = new CreateUserInput
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@test.com",
            Username = "john_doe",
            Password = "password123",
            PhoneNumber = "+1234567890"
        };

        // Act
        var result = await _mutation.CreateUser(_context, input);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.Success);
        Assert.Equal("User created successfully", result.Message);
        Assert.NotNull(result.User);
        Assert.Equal("john_doe", result.User.Username);
        Assert.Equal("john.doe@test.com", result.User.Email);
        Assert.True(result.User.IsActive);
        Assert.False(result.User.EmailConfirmed);

        // Verify user was saved to database
        var savedUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == "john_doe");
        Assert.NotNull(savedUser);
        
        // Verify role was assigned
        var userRole = await _context.UserRoles.FirstOrDefaultAsync(ur => ur.UserId == savedUser.Id);
        Assert.NotNull(userRole);
        Assert.Equal(1, userRole.RoleId);
    }

    [Fact]
    public async Task CreateUser_WithExistingEmail_ShouldReturnError()
    {
        // Arrange
        var input = new CreateUserInput
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "existing@test.com", // This email already exists
            Username = "new_username",
            Password = "password123"
        };

        // Act
        var result = await _mutation.CreateUser(_context, input);

        // Assert
        Assert.NotNull(result);
        Assert.False(result.Success);
        Assert.Equal("Email already exists", result.Message);
        Assert.Null(result.User);
    }

    [Fact]
    public async Task CreateUser_WithExistingUsername_ShouldReturnError()
    {
        // Arrange
        var input = new CreateUserInput
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "new@test.com",
            Username = "existing_user", // This username already exists
            Password = "password123"
        };

        // Act
        var result = await _mutation.CreateUser(_context, input);

        // Assert
        Assert.NotNull(result);
        Assert.False(result.Success);
        Assert.Equal("Username already exists", result.Message);
        Assert.Null(result.User);
    }

    [Fact]
    public async Task CreateProduct_WithValidInput_ShouldCreateProduct()
    {
        // Arrange
        var input = new CreateProductInput
        {
            Name = "New Product",
            Description = "A new test product",
            Sku = "NEW001",
            Price = 149.99m,
            CompareAtPrice = 199.99m,
            StockQuantity = 20,
            CategoryId = 1,
            Weight = 1.5m,
            WeightUnit = "kg"
        };

        // Act
        var result = await _mutation.CreateProduct(_context, input);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.Success);
        Assert.Equal("Product created successfully", result.Message);
        Assert.NotNull(result.Product);
        Assert.Equal("New Product", result.Product.Name);
        Assert.Equal("NEW001", result.Product.Sku);
        Assert.Equal(149.99m, result.Product.Price);
        Assert.True(result.Product.IsActive);

        // Verify product was saved to database
        var savedProduct = await _context.Products.FirstOrDefaultAsync(p => p.Sku == "NEW001");
        Assert.NotNull(savedProduct);
    }

    [Fact]
    public async Task CreateProduct_WithExistingSku_ShouldReturnError()
    {
        // Arrange
        var input = new CreateProductInput
        {
            Name = "Duplicate SKU Product",
            Description = "Product with duplicate SKU",
            Sku = "TEST001", // This SKU already exists
            Price = 99.99m,
            StockQuantity = 5,
            CategoryId = 1
        };

        // Act
        var result = await _mutation.CreateProduct(_context, input);

        // Assert
        Assert.NotNull(result);
        Assert.False(result.Success);
        Assert.Equal("SKU already exists", result.Message);
        Assert.Null(result.Product);
    }

    [Fact]
    public async Task CreateProduct_WithoutSku_ShouldCreateProduct()
    {
        // Arrange
        var input = new CreateProductInput
        {
            Name = "Product Without SKU",
            Description = "A product without SKU",
            Sku = null, // No SKU provided
            Price = 79.99m,
            StockQuantity = 15,
            CategoryId = 1
        };

        // Act
        var result = await _mutation.CreateProduct(_context, input);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.Success);
        Assert.Equal("Product created successfully", result.Message);
        Assert.NotNull(result.Product);
        Assert.Equal("Product Without SKU", result.Product.Name);
        Assert.Null(result.Product.Sku);
    }

    [Fact]
    public async Task AddToCart_WithValidInput_ShouldAddItemToCart()
    {
        // Arrange
        var input = new AddToCartInput
        {
            UserId = 1,
            ProductId = 1,
            ProductVariantId = null,
            Quantity = 2
        };

        // Act
        var result = await _mutation.AddToCart(_context, input);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.Success);
        Assert.Equal("Item added to cart successfully", result.Message);
        Assert.NotNull(result.Cart);
        Assert.Equal(1, result.Cart.UserId);
        Assert.True(result.Cart.IsActive);

        // Verify cart item was created
        var cartItem = await _context.CartItems.FirstOrDefaultAsync(ci => ci.CartId == result.Cart.Id);
        Assert.NotNull(cartItem);
        Assert.Equal(1, cartItem.ProductId);
        Assert.Equal(2, cartItem.Quantity);
        Assert.Equal(99.99m, cartItem.UnitPrice);
        Assert.Equal(199.98m, cartItem.TotalPrice);
    }

    [Fact]
    public async Task AddToCart_WithNonExistentProduct_ShouldReturnError()
    {
        // Arrange
        var input = new AddToCartInput
        {
            UserId = 1,
            ProductId = 999, // Non-existent product
            ProductVariantId = null,
            Quantity = 1
        };

        // Act
        var result = await _mutation.AddToCart(_context, input);

        // Assert
        Assert.NotNull(result);
        Assert.False(result.Success);
        Assert.Equal("Product not found", result.Message);
        Assert.Null(result.Cart);
    }

    [Fact]
    public async Task AddToCart_ToExistingCart_ShouldUpdateQuantity()
    {
        // Arrange - First add an item to cart
        var firstInput = new AddToCartInput
        {
            UserId = 1,
            ProductId = 1,
            ProductVariantId = null,
            Quantity = 1
        };
        await _mutation.AddToCart(_context, firstInput);

        // Act - Add the same item again
        var secondInput = new AddToCartInput
        {
            UserId = 1,
            ProductId = 1,
            ProductVariantId = null,
            Quantity = 2
        };
        var result = await _mutation.AddToCart(_context, secondInput);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.Success);
        
        // Verify quantity was updated (1 + 2 = 3)
        var cartItem = await _context.CartItems.FirstOrDefaultAsync(ci => ci.ProductId == 1);
        Assert.NotNull(cartItem);
        Assert.Equal(3, cartItem.Quantity);
        Assert.Equal(299.97m, cartItem.TotalPrice); // 99.99 * 3
    }

    [Fact]
    public async Task CreateOrder_WithValidCart_ShouldCreateOrder()
    {
        // Arrange - First create a cart with items
        var cartInput = new AddToCartInput
        {
            UserId = 1,
            ProductId = 1,
            ProductVariantId = null,
            Quantity = 2
        };
        await _mutation.AddToCart(_context, cartInput);

        var orderInput = new CreateOrderInput
        {
            UserId = 1,
            Notes = "Test order",
            ShippingAddressId = null,
            BillingAddressId = null
        };

        // Act
        var result = await _mutation.CreateOrder(_context, _mockEventSender.Object, orderInput);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.Success);
        Assert.Equal("Order created successfully", result.Message);
        Assert.NotNull(result.Order);
        Assert.Equal(1, result.Order.UserId);
        Assert.Equal(OrderStatus.Pending, result.Order.Status);
        Assert.StartsWith("ORD-", result.Order.OrderNumber);
        Assert.Equal("Test order", result.Order.Notes);

        // Verify order items were created
        var orderItems = await _context.OrderItems.Where(oi => oi.OrderId == result.Order.Id).ToListAsync();
        Assert.Single(orderItems);
        Assert.Equal(1, orderItems[0].ProductId);
        Assert.Equal(2, orderItems[0].Quantity);

        // Verify cart was deactivated
        var cart = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == 1);
        Assert.NotNull(cart);
        Assert.False(cart.IsActive);

        // Verify event was published
        _mockEventSender.Verify(x => x.SendAsync("order_created", It.IsAny<Order>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CreateOrder_WithNonExistentUser_ShouldReturnError()
    {
        // Arrange
        var input = new CreateOrderInput
        {
            UserId = 999, // Non-existent user
            Notes = "Test order"
        };

        // Act
        var result = await _mutation.CreateOrder(_context, _mockEventSender.Object, input);

        // Assert
        Assert.NotNull(result);
        Assert.False(result.Success);
        Assert.Equal("User not found", result.Message);
        Assert.Null(result.Order);
    }

    [Fact]
    public async Task CreateOrder_WithEmptyCart_ShouldReturnError()
    {
        // Arrange - User exists but has no cart
        var input = new CreateOrderInput
        {
            UserId = 1,
            Notes = "Test order"
        };

        // Act
        var result = await _mutation.CreateOrder(_context, _mockEventSender.Object, input);

        // Assert
        Assert.NotNull(result);
        Assert.False(result.Success);
        Assert.Equal("Cart is empty or not found", result.Message);
        Assert.Null(result.Order);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Database.CloseConnection();
        _context.Dispose();
    }
}