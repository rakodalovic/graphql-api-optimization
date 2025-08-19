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

    // User update mutation
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<UserPayload> UpdateUser([Service] ApplicationDbContext context, UpdateUserInput input)
    {
        var user = await context.Users.FindAsync(input.Id);
        if (user == null)
        {
            return new UserPayload
            {
                Success = false,
                Message = "User not found"
            };
        }

        // Check if email is being changed and if it already exists
        if (!string.IsNullOrEmpty(input.Email) && input.Email != user.Email)
        {
            if (await context.Users.AnyAsync(u => u.Email == input.Email && u.Id != input.Id))
            {
                return new UserPayload
                {
                    Success = false,
                    Message = "Email already exists"
                };
            }
            user.Email = input.Email;
        }

        // Check if username is being changed and if it already exists
        if (!string.IsNullOrEmpty(input.Username) && input.Username != user.Username)
        {
            if (await context.Users.AnyAsync(u => u.Username == input.Username && u.Id != input.Id))
            {
                return new UserPayload
                {
                    Success = false,
                    Message = "Username already exists"
                };
            }
            user.Username = input.Username;
        }

        // Update other fields if provided
        if (!string.IsNullOrEmpty(input.FirstName))
            user.FirstName = input.FirstName;
        
        if (!string.IsNullOrEmpty(input.LastName))
            user.LastName = input.LastName;
        
        if (input.PhoneNumber != null)
            user.PhoneNumber = input.PhoneNumber;
        
        if (input.IsActive.HasValue)
            user.IsActive = input.IsActive.Value;

        await context.SaveChangesAsync();

        return new UserPayload
        {
            User = user,
            Success = true,
            Message = "User updated successfully"
        };
    }

    // User delete mutation (soft delete)
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<UserPayload> DeleteUser([Service] ApplicationDbContext context, int id)
    {
        var user = await context.Users.FindAsync(id);
        if (user == null)
        {
            return new UserPayload
            {
                Success = false,
                Message = "User not found"
            };
        }

        // Check if user has active orders
        var hasActiveOrders = await context.Orders
            .AnyAsync(o => o.UserId == id && o.Status != OrderStatus.Cancelled && o.Status != OrderStatus.Delivered);
        
        if (hasActiveOrders)
        {
            return new UserPayload
            {
                Success = false,
                Message = "Cannot delete user with active orders"
            };
        }

        // Soft delete by setting IsActive to false
        user.IsActive = false;
        await context.SaveChangesAsync();

        return new UserPayload
        {
            User = user,
            Success = true,
            Message = "User deleted successfully"
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

    // Product update mutation
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<ProductPayload> UpdateProduct([Service] ApplicationDbContext context, UpdateProductInput input)
    {
        var product = await context.Products.FindAsync(input.Id);
        if (product == null)
        {
            return new ProductPayload
            {
                Success = false,
                Message = "Product not found"
            };
        }

        // Check if SKU is being changed and if it already exists
        if (!string.IsNullOrEmpty(input.Sku) && input.Sku != product.Sku)
        {
            if (await context.Products.AnyAsync(p => p.Sku == input.Sku && p.Id != input.Id))
            {
                return new ProductPayload
                {
                    Success = false,
                    Message = "SKU already exists"
                };
            }
            product.Sku = input.Sku;
        }

        // Update fields if provided
        if (!string.IsNullOrEmpty(input.Name))
            product.Name = input.Name;
        
        if (input.Description != null)
            product.Description = input.Description;
        
        if (input.Price.HasValue)
            product.Price = input.Price.Value;
        
        if (input.CompareAtPrice.HasValue)
            product.CompareAtPrice = input.CompareAtPrice;
        
        if (input.StockQuantity.HasValue)
            product.StockQuantity = input.StockQuantity.Value;
        
        if (input.CategoryId.HasValue)
            product.CategoryId = input.CategoryId.Value;
        
        if (input.IsActive.HasValue)
            product.IsActive = input.IsActive.Value;
        
        if (input.Weight.HasValue)
            product.Weight = input.Weight;
        
        if (input.WeightUnit != null)
            product.WeightUnit = input.WeightUnit;

        await context.SaveChangesAsync();

        return new ProductPayload
        {
            Product = product,
            Success = true,
            Message = "Product updated successfully"
        };
    }

    // Product delete mutation (soft delete)
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<ProductPayload> DeleteProduct([Service] ApplicationDbContext context, int id)
    {
        var product = await context.Products.FindAsync(id);
        if (product == null)
        {
            return new ProductPayload
            {
                Success = false,
                Message = "Product not found"
            };
        }

        // Check if product is in any active carts or pending orders
        var isInActiveCarts = await context.CartItems
            .AnyAsync(ci => ci.ProductId == id && ci.Cart.IsActive);
        
        var isInPendingOrders = await context.OrderItems
            .AnyAsync(oi => oi.ProductId == id && 
                (oi.Order.Status == OrderStatus.Pending || oi.Order.Status == OrderStatus.Confirmed || oi.Order.Status == OrderStatus.Processing));

        if (isInActiveCarts || isInPendingOrders)
        {
            return new ProductPayload
            {
                Success = false,
                Message = "Cannot delete product that is in active carts or pending orders"
            };
        }

        // Soft delete by setting IsActive to false
        product.IsActive = false;
        await context.SaveChangesAsync();

        return new ProductPayload
        {
            Product = product,
            Success = true,
            Message = "Product deleted successfully"
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

    // Remove from cart mutation
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<CartPayload> RemoveFromCart([Service] ApplicationDbContext context, RemoveFromCartInput input)
    {
        var cart = await context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == input.UserId && c.IsActive);

        if (cart == null)
        {
            return new CartPayload
            {
                Success = false,
                Message = "Cart not found"
            };
        }

        var cartItem = cart.CartItems
            .FirstOrDefault(ci => ci.ProductId == input.ProductId && ci.ProductVariantId == input.ProductVariantId);

        if (cartItem == null)
        {
            return new CartPayload
            {
                Success = false,
                Message = "Item not found in cart"
            };
        }

        context.CartItems.Remove(cartItem);
        await UpdateCartTotals(context, cart);
        await context.SaveChangesAsync();

        return new CartPayload
        {
            Cart = cart,
            Success = true,
            Message = "Item removed from cart successfully"
        };
    }

    // Update cart item mutation
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<CartPayload> UpdateCartItem([Service] ApplicationDbContext context, UpdateCartItemInput input)
    {
        var cart = await context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == input.UserId && c.IsActive);

        if (cart == null)
        {
            return new CartPayload
            {
                Success = false,
                Message = "Cart not found"
            };
        }

        var cartItem = cart.CartItems
            .FirstOrDefault(ci => ci.ProductId == input.ProductId && ci.ProductVariantId == input.ProductVariantId);

        if (cartItem == null)
        {
            return new CartPayload
            {
                Success = false,
                Message = "Item not found in cart"
            };
        }

        if (input.Quantity <= 0)
        {
            context.CartItems.Remove(cartItem);
        }
        else
        {
            cartItem.Quantity = input.Quantity;
            cartItem.TotalPrice = cartItem.UnitPrice * cartItem.Quantity;
        }

        await UpdateCartTotals(context, cart);
        await context.SaveChangesAsync();

        return new CartPayload
        {
            Cart = cart,
            Success = true,
            Message = "Cart item updated successfully"
        };
    }

    // Clear cart mutation
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<CartPayload> ClearCart([Service] ApplicationDbContext context, int userId)
    {
        var cart = await context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId && c.IsActive);

        if (cart == null)
        {
            return new CartPayload
            {
                Success = false,
                Message = "Cart not found"
            };
        }

        context.CartItems.RemoveRange(cart.CartItems);
        cart.SubtotalAmount = 0;
        cart.TotalAmount = 0;
        cart.TotalItems = 0;

        await context.SaveChangesAsync();

        return new CartPayload
        {
            Cart = cart,
            Success = true,
            Message = "Cart cleared successfully"
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

    // Order update mutation
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<OrderPayload> UpdateOrder([Service] ApplicationDbContext context, UpdateOrderInput input)
    {
        var order = await context.Orders
            .Include(o => o.StatusHistory)
            .FirstOrDefaultAsync(o => o.Id == input.Id);

        if (order == null)
        {
            return new OrderPayload
            {
                Success = false,
                Message = "Order not found"
            };
        }

        bool statusChanged = false;

        // Update status if provided and different
        if (input.Status.HasValue && input.Status.Value != order.Status)
        {
            // Validate status transition
            if (!IsValidStatusTransition(order.Status, input.Status.Value))
            {
                return new OrderPayload
                {
                    Success = false,
                    Message = $"Invalid status transition from {order.Status} to {input.Status.Value}"
                };
            }

            order.Status = input.Status.Value;
            statusChanged = true;

            // Update timestamp fields based on status
            switch (input.Status.Value)
            {
                case OrderStatus.Shipped:
                    order.ShippedAt = DateTime.UtcNow;
                    break;
                case OrderStatus.Delivered:
                    order.DeliveredAt = DateTime.UtcNow;
                    break;
                case OrderStatus.Cancelled:
                    order.CancelledAt = DateTime.UtcNow;
                    if (!string.IsNullOrEmpty(input.CancellationReason))
                        order.CancellationReason = input.CancellationReason;
                    break;
            }
        }

        // Update other fields if provided
        if (input.Notes != null)
            order.Notes = input.Notes;

        if (input.ShippingAddressId.HasValue)
            order.ShippingAddressId = input.ShippingAddressId.Value;

        if (input.BillingAddressId.HasValue)
            order.BillingAddressId = input.BillingAddressId.Value;

        // Add status history if status changed
        if (statusChanged)
        {
            var statusHistory = new OrderStatusHistory
            {
                OrderId = order.Id,
                Status = order.Status,
                Notes = input.StatusNotes ?? $"Status updated to {order.Status}",
                ChangedAt = DateTime.UtcNow,
                ChangedBy = "System"
            };
            context.OrderStatusHistory.Add(statusHistory);
        }

        await context.SaveChangesAsync();

        return new OrderPayload
        {
            Order = order,
            Success = true,
            Message = "Order updated successfully"
        };
    }

    // Order delete mutation (cancel order)
    [UseDbContext(typeof(ApplicationDbContext))]
    public async Task<OrderPayload> DeleteOrder([Service] ApplicationDbContext context, DeleteOrderInput input)
    {
        var order = await context.Orders.FindAsync(input.Id);
        if (order == null)
        {
            return new OrderPayload
            {
                Success = false,
                Message = "Order not found"
            };
        }

        // Only allow cancellation of orders that haven't been shipped
        if (order.Status == OrderStatus.Shipped || order.Status == OrderStatus.Delivered)
        {
            return new OrderPayload
            {
                Success = false,
                Message = "Cannot cancel orders that have been shipped or delivered"
            };
        }

        if (order.Status == OrderStatus.Cancelled)
        {
            return new OrderPayload
            {
                Success = false,
                Message = "Order is already cancelled"
            };
        }

        // Cancel the order
        order.Status = OrderStatus.Cancelled;
        order.CancelledAt = DateTime.UtcNow;
        order.CancellationReason = input.CancellationReason ?? "Order cancelled";

        // Add status history
        var statusHistory = new OrderStatusHistory
        {
            OrderId = order.Id,
            Status = OrderStatus.Cancelled,
            Notes = order.CancellationReason,
            ChangedAt = DateTime.UtcNow,
            ChangedBy = "System"
        };
        context.OrderStatusHistory.Add(statusHistory);

        await context.SaveChangesAsync();

        return new OrderPayload
        {
            Order = order,
            Success = true,
            Message = "Order cancelled successfully"
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

    private static bool IsValidStatusTransition(OrderStatus currentStatus, OrderStatus newStatus)
    {
        return currentStatus switch
        {
            OrderStatus.Pending => newStatus == OrderStatus.Confirmed || newStatus == OrderStatus.Cancelled,
            OrderStatus.Confirmed => newStatus == OrderStatus.Processing || newStatus == OrderStatus.Cancelled,
            OrderStatus.Processing => newStatus == OrderStatus.Shipped || newStatus == OrderStatus.Cancelled,
            OrderStatus.Shipped => newStatus == OrderStatus.Delivered,
            OrderStatus.Delivered => newStatus == OrderStatus.Returned,
            OrderStatus.Cancelled => false, // Cannot transition from cancelled
            OrderStatus.Refunded => false, // Cannot transition from refunded
            OrderStatus.Returned => newStatus == OrderStatus.Refunded,
            _ => false
        };
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

public record UpdateUserInput
{
    public int Id { get; init; }
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    [GraphQLType(typeof(GraphQLApi.GraphQL.Scalars.EmailType))]
    public string? Email { get; init; }
    public string? Username { get; init; }
    public string? PhoneNumber { get; init; }
    public bool? IsActive { get; init; }
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

public record UpdateProductInput
{
    public int Id { get; init; }
    public string? Name { get; init; }
    public string? Description { get; init; }
    public string? Sku { get; init; }
    public decimal? Price { get; init; }
    public decimal? CompareAtPrice { get; init; }
    public int? StockQuantity { get; init; }
    public int? CategoryId { get; init; }
    public bool? IsActive { get; init; }
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

public record RemoveFromCartInput
{
    public int UserId { get; init; }
    public int ProductId { get; init; }
    public int? ProductVariantId { get; init; }
}

public record UpdateCartItemInput
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

public record UpdateOrderInput
{
    public int Id { get; init; }
    public OrderStatus? Status { get; init; }
    public string? Notes { get; init; }
    public int? ShippingAddressId { get; init; }
    public int? BillingAddressId { get; init; }
    public string? StatusNotes { get; init; }
    public string? CancellationReason { get; init; }
}

public record DeleteOrderInput
{
    public int Id { get; init; }
    public string? CancellationReason { get; init; }
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