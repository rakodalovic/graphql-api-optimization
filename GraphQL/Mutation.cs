using GraphQLApi.Data;
using GraphQLApi.Models;
using HotChocolate;
using Microsoft.EntityFrameworkCore;

namespace GraphQLApi.GraphQL;

public class Mutation
{
    /// <summary>
    /// Echo mutation that returns the input message
    /// </summary>
    /// <param name="message">Message to echo</param>
    /// <returns>Echo response</returns>
    public EchoPayload Echo(string message)
    {
        return new EchoPayload
        {
            Message = message,
            Timestamp = DateTime.UtcNow,
            Success = true
        };
    }

    /// <summary>
    /// Simple calculation mutation
    /// </summary>
    /// <param name="a">First number</param>
    /// <param name="b">Second number</param>
    /// <param name="operation">Operation to perform</param>
    /// <returns>Calculation result</returns>
    public CalculationPayload Calculate(double a, double b, CalculationOperation operation = CalculationOperation.Add)
    {
        double result = operation switch
        {
            CalculationOperation.Add => a + b,
            CalculationOperation.Subtract => a - b,
            CalculationOperation.Multiply => a * b,
            CalculationOperation.Divide => b != 0 ? a / b : throw new GraphQLException("Division by zero is not allowed"),
            _ => throw new GraphQLException("Invalid operation")
        };

        return new CalculationPayload
        {
            Result = result,
            Operation = operation,
            InputA = a,
            InputB = b,
            Success = true
        };
    }

    // User mutations
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<UserPayload> CreateUser([Service] ApplicationDbContext context, CreateUserInput input)
    {
        // Check if email already exists
        if (await context.Users.AnyAsync(u => u.Email == input.Email))
        {
            return new UserPayload
            {
                Success = false,
                Message = "Email already exists"
            };
        }

        // Check if username already exists
        if (await context.Users.AnyAsync(u => u.Username == input.Username))
        {
            return new UserPayload
            {
                Success = false,
                Message = "Username already exists"
            };
        }

        var user = new User
        {
            FirstName = input.FirstName,
            LastName = input.LastName,
            Email = input.Email,
            Username = input.Username,
            PasswordHash = input.Password, // In real app, hash the password
            PhoneNumber = input.PhoneNumber,
            IsActive = true,
            EmailConfirmed = false
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        // Assign default customer role
        var customerRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Customer");
        if (customerRole != null)
        {
            var userRole = new UserRole
            {
                UserId = user.Id,
                RoleId = customerRole.Id,
                IsActive = true
            };
            context.UserRoles.Add(userRole);
            await context.SaveChangesAsync();
        }

        return new UserPayload
        {
            User = user,
            Success = true,
            Message = "User created successfully"
        };
    }

    // Product mutations
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<ProductPayload> CreateProduct([Service] ApplicationDbContext context, CreateProductInput input)
    {
        // Check if SKU already exists
        if (!string.IsNullOrEmpty(input.Sku) && await context.Products.AnyAsync(p => p.Sku == input.Sku))
        {
            return new ProductPayload
            {
                Success = false,
                Message = "SKU already exists"
            };
        }

        var product = new Product
        {
            Name = input.Name,
            Description = input.Description,
            Sku = input.Sku,
            Price = input.Price,
            CompareAtPrice = input.CompareAtPrice,
            StockQuantity = input.StockQuantity,
            CategoryId = input.CategoryId,
            IsActive = true,
            Weight = input.Weight,
            WeightUnit = input.WeightUnit
        };

        context.Products.Add(product);
        await context.SaveChangesAsync();

        return new ProductPayload
        {
            Product = product,
            Success = true,
            Message = "Product created successfully"
        };
    }

    // Cart mutations
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<CartPayload> AddToCart([Service] ApplicationDbContext context, AddToCartInput input)
    {
        // Get or create active cart
        var cart = await context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == input.UserId && c.IsActive);

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = input.UserId,
                IsActive = true,
                Currency = "USD"
            };
            context.Carts.Add(cart);
            await context.SaveChangesAsync();
        }

        // Check if item already exists in cart
        var existingItem = cart.CartItems
            .FirstOrDefault(ci => ci.ProductId == input.ProductId && ci.ProductVariantId == input.ProductVariantId);

        if (existingItem != null)
        {
            existingItem.Quantity += input.Quantity;
            existingItem.TotalPrice = existingItem.UnitPrice * existingItem.Quantity;
        }
        else
        {
            // Get product price
            var product = await context.Products.FindAsync(input.ProductId);
            if (product == null)
            {
                return new CartPayload
                {
                    Success = false,
                    Message = "Product not found"
                };
            }

            decimal unitPrice = product.Price;
            if (input.ProductVariantId.HasValue)
            {
                var variant = await context.ProductVariants.FindAsync(input.ProductVariantId.Value);
                if (variant != null)
                {
                    unitPrice = variant.Price;
                }
            }

            var cartItem = new CartItem
            {
                CartId = cart.Id,
                ProductId = input.ProductId,
                ProductVariantId = input.ProductVariantId,
                Quantity = input.Quantity,
                UnitPrice = unitPrice,
                TotalPrice = unitPrice * input.Quantity
            };

            context.CartItems.Add(cartItem);
        }

        // Update cart totals
        await UpdateCartTotals(context, cart);
        await context.SaveChangesAsync();

        return new CartPayload
        {
            Cart = cart,
            Success = true,
            Message = "Item added to cart successfully"
        };
    }

    // Review mutations
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<ReviewPayload> CreateReview([Service] ApplicationDbContext context, CreateReviewInput input)
    {
        // Check if user already reviewed this product
        if (await context.Reviews.AnyAsync(r => r.UserId == input.UserId && r.ProductId == input.ProductId))
        {
            return new ReviewPayload
            {
                Success = false,
                Message = "You have already reviewed this product"
            };
        }

        var review = new Review
        {
            UserId = input.UserId,
            ProductId = input.ProductId,
            Rating = input.Rating,
            Title = input.Title,
            Comment = input.Comment,
            IsVerifiedPurchase = await context.OrderItems
                .AnyAsync(oi => oi.Order.UserId == input.UserId && oi.ProductId == input.ProductId),
            IsApproved = false // Reviews need approval
        };

        context.Reviews.Add(review);
        await context.SaveChangesAsync();

        return new ReviewPayload
        {
            Review = review,
            Success = true,
            Message = "Review submitted successfully and is pending approval"
        };
    }

    private static async Task UpdateCartTotals(ApplicationDbContext context, Cart cart)
    {
        var cartItems = await context.CartItems
            .Where(ci => ci.CartId == cart.Id)
            .ToListAsync();

        cart.SubtotalAmount = cartItems.Sum(ci => ci.TotalPrice);
        cart.TotalItems = cartItems.Sum(ci => ci.Quantity);
        cart.TotalAmount = cart.SubtotalAmount + cart.TaxAmount + cart.ShippingAmount - cart.DiscountAmount;
    }
}

// Input types
public record CreateUserInput
{
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Username { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string? PhoneNumber { get; init; }
}

public record CreateProductInput
{
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Sku { get; init; }
    public decimal Price { get; init; }
    public decimal? CompareAtPrice { get; init; }
    public int StockQuantity { get; init; }
    public int CategoryId { get; init; }
    public decimal? Weight { get; init; }
    public string? WeightUnit { get; init; }
}

public record AddToCartInput
{
    public int UserId { get; init; }
    public int ProductId { get; init; }
    public int? ProductVariantId { get; init; }
    public int Quantity { get; init; }
}

public record CreateReviewInput
{
    public int UserId { get; init; }
    public int ProductId { get; init; }
    public int Rating { get; init; }
    public string? Title { get; init; }
    public string? Comment { get; init; }
}

// Payload types
public record UserPayload
{
    public User? User { get; init; }
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
}

public record ProductPayload
{
    public Product? Product { get; init; }
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
}

public record CartPayload
{
    public Cart? Cart { get; init; }
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
}

public record ReviewPayload
{
    public Review? Review { get; init; }
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
}

// Existing types
public record EchoPayload
{
    public string Message { get; init; } = string.Empty;
    public DateTime Timestamp { get; init; }
    public bool Success { get; init; }
}

public record CalculationPayload
{
    public double Result { get; init; }
    public CalculationOperation Operation { get; init; }
    public double InputA { get; init; }
    public double InputB { get; init; }
    public bool Success { get; init; }
}

public enum CalculationOperation
{
    Add,
    Subtract,
    Multiply,
    Divide
}