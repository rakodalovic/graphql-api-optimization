using GraphQLApi.Data;
using GraphQLApi.Models;
using HotChocolate;
using HotChocolate.Subscriptions;
using Microsoft.EntityFrameworkCore;

namespace GraphQLApi.GraphQL;

public class Mutation
{
    // User mutations
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<UserPayload> CreateUser([Service] ApplicationDbContext context, CreateUserInput input)
    {
        if (await context.Users.AnyAsync(u => u.Email == input.Email))
        {
            return new UserPayload
            {
                Success = false,
                Message = "Email already exists"
            };
        }

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
            PasswordHash = input.Password,
            PhoneNumber = input.PhoneNumber,
            IsActive = true,
            EmailConfirmed = false
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

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

        var existingItem = cart.CartItems
            .FirstOrDefault(ci => ci.ProductId == input.ProductId && ci.ProductVariantId == input.ProductVariantId);

        if (existingItem != null)
        {
            existingItem.Quantity += input.Quantity;
            existingItem.TotalPrice = existingItem.UnitPrice * existingItem.Quantity;
        }
        else
        {
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
            IsApproved = false
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

    // Order mutations
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<OrderPayload> CreateOrder([Service] ApplicationDbContext context, [Service] ITopicEventSender eventSender, CreateOrderInput input)
    {
        var user = await context.Users.FindAsync(input.UserId);
        if (user == null)
        {
            return new OrderPayload
            {
                Success = false,
                Message = "User not found"
            };
        }

        var cart = await context.Carts
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == input.UserId && c.IsActive);

        if (cart == null || !cart.CartItems.Any())
        {
            return new OrderPayload
            {
                Success = false,
                Message = "Cart is empty or not found"
            };
        }

        var order = new Order
        {
            OrderNumber = GenerateOrderNumber(),
            UserId = input.UserId,
            Status = OrderStatus.Pending,
            SubtotalAmount = cart.SubtotalAmount,
            TaxAmount = cart.TaxAmount,
            ShippingAmount = cart.ShippingAmount,
            DiscountAmount = cart.DiscountAmount,
            TotalAmount = cart.TotalAmount,
            Currency = cart.Currency ?? "USD",
            Notes = input.Notes,
            ShippingAddressId = input.ShippingAddressId,
            BillingAddressId = input.BillingAddressId
        };

        context.Orders.Add(order);
        await context.SaveChangesAsync();

        // Create order items from cart items
        foreach (var cartItem in cart.CartItems)
        {
            var orderItem = new OrderItem
            {
                OrderId = order.Id,
                ProductId = cartItem.ProductId,
                ProductVariantId = cartItem.ProductVariantId,
                ProductName = cartItem.Product.Name,
                ProductSku = cartItem.Product.Sku,
                Quantity = cartItem.Quantity,
                UnitPrice = cartItem.UnitPrice,
                TotalPrice = cartItem.TotalPrice
            };

            context.OrderItems.Add(orderItem);
        }

        // Create order status history
        var statusHistory = new OrderStatusHistory
        {
            OrderId = order.Id,
            Status = OrderStatus.Pending,
            Notes = "Order created",
            ChangedAt = DateTime.UtcNow,
            ChangedBy = "System"
        };

        context.OrderStatusHistory.Add(statusHistory);

        // Clear the cart
        cart.IsActive = false;
        context.CartItems.RemoveRange(cart.CartItems);

        await context.SaveChangesAsync();

        // Load the complete order with navigation properties for the subscription
        var completeOrder = await context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Include(o => o.ShippingAddress)
            .Include(o => o.BillingAddress)
            .FirstAsync(o => o.Id == order.Id);

        // Publish the order created event
        await eventSender.SendAsync("order_created", completeOrder);

        return new OrderPayload
        {
            Order = completeOrder,
            Success = true,
            Message = "Order created successfully"
        };
    }

    // Notification mutations
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<NotificationPayload> CreateNotification([Service] ApplicationDbContext context, [Service] ITopicEventSender eventSender, CreateNotificationInput input)
    {
        var user = await context.Users.FindAsync(input.UserId);
        if (user == null)
        {
            return new NotificationPayload
            {
                Success = false,
                Message = "User not found"
            };
        }

        var notification = new Notification
        {
            UserId = input.UserId,
            Title = input.Title,
            Message = input.Message,
            Type = input.Type,
            Priority = input.Priority,
            ActionUrl = input.ActionUrl,
            ActionText = input.ActionText,
            ImageUrl = input.ImageUrl,
            Metadata = input.Metadata,
            ExpiresAt = input.ExpiresAt
        };

        context.Notifications.Add(notification);
        await context.SaveChangesAsync();

        // Load the complete notification with navigation properties for the subscription
        var completeNotification = await context.Notifications
            .Include(n => n.User)
            .FirstAsync(n => n.Id == notification.Id);

        // Publish the notification received event
        await eventSender.SendAsync("notification_received", completeNotification);

        return new NotificationPayload
        {
            Notification = completeNotification,
            Success = true,
            Message = "Notification created successfully"
        };
    }

    private static string GenerateOrderNumber()
    {
        return $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
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
    [GraphQLType(typeof(GraphQLApi.GraphQL.Scalars.EmailType))]
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

public record CreateOrderInput
{
    public int UserId { get; init; }
    public string? Notes { get; init; }
    public int? ShippingAddressId { get; init; }
    public int? BillingAddressId { get; init; }
}

public record CreateNotificationInput
{
    public int UserId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public NotificationType Type { get; init; }
    public NotificationPriority Priority { get; init; } = NotificationPriority.Normal;
    public string? ActionUrl { get; init; }
    public string? ActionText { get; init; }
    public string? ImageUrl { get; init; }
    public string? Metadata { get; init; }
    public DateTime? ExpiresAt { get; init; }
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

public record OrderPayload
{
    public Order? Order { get; init; }
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
}

public record NotificationPayload
{
    public Notification? Notification { get; init; }
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