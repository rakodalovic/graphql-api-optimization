using GraphQLApi.Models;
using Microsoft.EntityFrameworkCore;

namespace GraphQLApi.Data.Seed;

public static class SeedData
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        await SeedRolesAsync(context);
        await SeedCategoriesAsync(context);
        await SeedTagsAsync(context);
        await SeedUsersAsync(context);
        await SeedProductsAsync(context);
        await SeedOrdersAsync(context);
        await SeedReviewsAsync(context);
        await SeedNotificationsAsync(context);
        await SeedPaymentMethodsAsync(context);
    }

    private static async Task SeedRolesAsync(ApplicationDbContext context)
    {
        if (await context.Roles.AnyAsync()) return;

        var roles = new List<Role>
        {
            new() { Name = "Admin", Description = "System Administrator", IsActive = true },
            new() { Name = "Customer", Description = "Regular Customer", IsActive = true },
            new() { Name = "Manager", Description = "Store Manager", IsActive = true },
            new() { Name = "Support", Description = "Customer Support", IsActive = true }
        };

        context.Roles.AddRange(roles);
        await context.SaveChangesAsync();
    }

    private static async Task SeedCategoriesAsync(ApplicationDbContext context)
    {
        if (await context.Categories.AnyAsync()) return;

        var categories = new List<Category>
        {
            new() 
            { 
                Name = "Electronics", 
                Description = "Electronic devices and accessories",
                Slug = "electronics",
                IsActive = true,
                SortOrder = 1
            },
            new() 
            { 
                Name = "Clothing", 
                Description = "Apparel and fashion items",
                Slug = "clothing",
                IsActive = true,
                SortOrder = 2
            },
            new() 
            { 
                Name = "Books", 
                Description = "Books and educational materials",
                Slug = "books",
                IsActive = true,
                SortOrder = 3
            },
            new() 
            { 
                Name = "Home & Garden", 
                Description = "Home improvement and garden supplies",
                Slug = "home-garden",
                IsActive = true,
                SortOrder = 4
            }
        };

        context.Categories.AddRange(categories);
        await context.SaveChangesAsync();

        // Add subcategories
        var electronics = await context.Categories.FirstAsync(c => c.Name == "Electronics");
        var clothing = await context.Categories.FirstAsync(c => c.Name == "Clothing");

        var subCategories = new List<Category>
        {
            new() 
            { 
                Name = "Smartphones", 
                Description = "Mobile phones and accessories",
                Slug = "smartphones",
                ParentCategoryId = electronics.Id,
                IsActive = true,
                SortOrder = 1
            },
            new() 
            { 
                Name = "Laptops", 
                Description = "Portable computers",
                Slug = "laptops",
                ParentCategoryId = electronics.Id,
                IsActive = true,
                SortOrder = 2
            },
            new() 
            { 
                Name = "Men's Clothing", 
                Description = "Clothing for men",
                Slug = "mens-clothing",
                ParentCategoryId = clothing.Id,
                IsActive = true,
                SortOrder = 1
            },
            new() 
            { 
                Name = "Women's Clothing", 
                Description = "Clothing for women",
                Slug = "womens-clothing",
                ParentCategoryId = clothing.Id,
                IsActive = true,
                SortOrder = 2
            }
        };

        context.Categories.AddRange(subCategories);
        await context.SaveChangesAsync();
    }

    private static async Task SeedTagsAsync(ApplicationDbContext context)
    {
        if (await context.Tags.AnyAsync()) return;

        var tags = new List<Models.Tag>
        {
            new() { Name = "New Arrival", Slug = "new-arrival", Type = TagType.Promotion, Color = "#28a745", IsActive = true },
            new() { Name = "Best Seller", Slug = "best-seller", Type = TagType.Promotion, Color = "#ffc107", IsActive = true },
            new() { Name = "On Sale", Slug = "on-sale", Type = TagType.Promotion, Color = "#dc3545", IsActive = true },
            new() { Name = "Premium", Slug = "premium", Type = TagType.Feature, Color = "#6f42c1", IsActive = true },
            new() { Name = "Eco Friendly", Slug = "eco-friendly", Type = TagType.Feature, Color = "#20c997", IsActive = true },
            new() { Name = "Limited Edition", Slug = "limited-edition", Type = TagType.Promotion, Color = "#fd7e14", IsActive = true }
        };

        context.Tags.AddRange(tags);
        await context.SaveChangesAsync();
    }

    private static async Task SeedUsersAsync(ApplicationDbContext context)
    {
        if (await context.Users.AnyAsync()) return;

        var customerRole = await context.Roles.FirstAsync(r => r.Name == "Customer");
        var adminRole = await context.Roles.FirstAsync(r => r.Name == "Admin");

        var users = new List<User>
        {
            new()
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Username = "johndoe",
                PasswordHash = "hashed_password_here", // In real app, use proper password hashing
                IsActive = true,
                EmailConfirmed = true
            },
            new()
            {
                FirstName = "Jane",
                LastName = "Smith",
                Email = "jane.smith@example.com",
                Username = "janesmith",
                PasswordHash = "hashed_password_here",
                IsActive = true,
                EmailConfirmed = true
            },
            new()
            {
                FirstName = "Admin",
                LastName = "User",
                Email = "admin@example.com",
                Username = "admin",
                PasswordHash = "hashed_password_here",
                IsActive = true,
                EmailConfirmed = true
            }
        };

        context.Users.AddRange(users);
        await context.SaveChangesAsync();

        // Assign roles
        var johnDoe = await context.Users.FirstAsync(u => u.Username == "johndoe");
        var janeSmith = await context.Users.FirstAsync(u => u.Username == "janesmith");
        var adminUser = await context.Users.FirstAsync(u => u.Username == "admin");

        var userRoles = new List<UserRole>
        {
            new() { UserId = johnDoe.Id, RoleId = customerRole.Id, IsActive = true },
            new() { UserId = janeSmith.Id, RoleId = customerRole.Id, IsActive = true },
            new() { UserId = adminUser.Id, RoleId = adminRole.Id, IsActive = true }
        };

        context.UserRoles.AddRange(userRoles);
        await context.SaveChangesAsync();

        // Add user profiles
        var profiles = new List<UserProfile>
        {
            new()
            {
                UserId = johnDoe.Id,
                Bio = "Software developer and tech enthusiast",
                Country = "United States",
                City = "New York"
            },
            new()
            {
                UserId = janeSmith.Id,
                Bio = "Marketing professional and book lover",
                Country = "Canada",
                City = "Toronto"
            }
        };

        context.UserProfiles.AddRange(profiles);
        await context.SaveChangesAsync();

        // Add user preferences
        var preferences = new List<UserPreferences>
        {
            new()
            {
                UserId = johnDoe.Id,
                EmailNotifications = true,
                PushNotifications = true,
                Language = "en",
                Currency = "USD",
                Theme = "dark"
            },
            new()
            {
                UserId = janeSmith.Id,
                EmailNotifications = true,
                PushNotifications = false,
                Language = "en",
                Currency = "CAD",
                Theme = "light"
            }
        };

        context.UserPreferences.AddRange(preferences);
        await context.SaveChangesAsync();
    }

    private static async Task SeedProductsAsync(ApplicationDbContext context)
    {
        if (await context.Products.AnyAsync()) return;

        var electronicsCategory = await context.Categories.FirstAsync(c => c.Name == "Electronics");
        var smartphoneCategory = await context.Categories.FirstAsync(c => c.Name == "Smartphones");

        var products = new List<Product>
        {
            new()
            {
                Name = "iPhone 15 Pro",
                Description = "Latest iPhone with advanced features",
                Sku = "IPHONE15PRO",
                Price = 999.99m,
                CompareAtPrice = 1099.99m,
                StockQuantity = 50,
                IsActive = true,
                IsFeatured = true,
                CategoryId = smartphoneCategory.Id,
                Weight = 0.187m,
                WeightUnit = "kg"
            },
            new()
            {
                Name = "Samsung Galaxy S24",
                Description = "Premium Android smartphone",
                Sku = "GALAXYS24",
                Price = 899.99m,
                StockQuantity = 30,
                IsActive = true,
                CategoryId = smartphoneCategory.Id,
                Weight = 0.168m,
                WeightUnit = "kg"
            },
            new()
            {
                Name = "MacBook Pro 16\"",
                Description = "Professional laptop for developers",
                Sku = "MBP16",
                Price = 2399.99m,
                StockQuantity = 15,
                IsActive = true,
                IsFeatured = true,
                CategoryId = electronicsCategory.Id,
                Weight = 2.1m,
                WeightUnit = "kg"
            }
        };

        context.Products.AddRange(products);
        await context.SaveChangesAsync();

        // Add product variants
        var iphone = await context.Products.FirstAsync(p => p.Sku == "IPHONE15PRO");
        
        var variants = new List<ProductVariant>
        {
            new()
            {
                ProductId = iphone.Id,
                Name = "128GB - Natural Titanium",
                Sku = "IPHONE15PRO-128-NT",
                Price = 999.99m,
                StockQuantity = 20,
                IsActive = true,
                SortOrder = 1
            },
            new()
            {
                ProductId = iphone.Id,
                Name = "256GB - Natural Titanium",
                Sku = "IPHONE15PRO-256-NT",
                Price = 1099.99m,
                StockQuantity = 15,
                IsActive = true,
                SortOrder = 2
            }
        };

        context.ProductVariants.AddRange(variants);
        await context.SaveChangesAsync();
    }

    private static async Task SeedOrdersAsync(ApplicationDbContext context)
    {
        if (await context.Orders.AnyAsync()) return;

        var johnUser = await context.Users.FirstAsync(u => u.Username == "johndoe");
        var janeUser = await context.Users.FirstAsync(u => u.Username == "janesmith");
        var adminUser = await context.Users.FirstAsync(u => u.Username == "admin");
        var product = await context.Products.FirstAsync(p => p.Sku == "IPHONE15PRO");

        // Create multiple orders for different users to demonstrate DataLoader batching
        var orders = new List<Order>
        {
            // John's orders
            new()
            {
                OrderNumber = "ORD-2024-001",
                UserId = johnUser.Id,
                Status = OrderStatus.Delivered,
                SubtotalAmount = 999.99m,
                TaxAmount = 79.99m,
                ShippingAmount = 9.99m,
                TotalAmount = 1089.97m,
                Currency = "USD"
            },
            new()
            {
                OrderNumber = "ORD-2024-002",
                UserId = johnUser.Id,
                Status = OrderStatus.Processing,
                SubtotalAmount = 599.99m,
                TaxAmount = 47.99m,
                ShippingAmount = 9.99m,
                TotalAmount = 657.97m,
                Currency = "USD"
            },
            // Jane's orders
            new()
            {
                OrderNumber = "ORD-2024-003",
                UserId = janeUser.Id,
                Status = OrderStatus.Shipped,
                SubtotalAmount = 299.99m,
                TaxAmount = 23.99m,
                ShippingAmount = 9.99m,
                TotalAmount = 333.97m,
                Currency = "USD"
            },
            new()
            {
                OrderNumber = "ORD-2024-004",
                UserId = janeUser.Id,
                Status = OrderStatus.Confirmed,
                SubtotalAmount = 199.99m,
                TaxAmount = 15.99m,
                ShippingAmount = 9.99m,
                TotalAmount = 225.97m,
                Currency = "USD"
            },
            // Admin user order
            new()
            {
                OrderNumber = "ORD-2024-005",
                UserId = adminUser.Id,
                Status = OrderStatus.Cancelled,
                SubtotalAmount = 99.99m,
                TaxAmount = 7.99m,
                ShippingAmount = 9.99m,
                TotalAmount = 117.97m,
                Currency = "USD"
            }
        };

        context.Orders.AddRange(orders);
        await context.SaveChangesAsync();

        // Add order items for the first order (keeping it simple)
        var orderItem = new OrderItem
        {
            OrderId = orders[0].Id,
            ProductId = product.Id,
            ProductName = product.Name,
            ProductSku = product.Sku,
            Quantity = 1,
            UnitPrice = 999.99m,
            TotalPrice = 999.99m
        };

        context.OrderItems.Add(orderItem);
        await context.SaveChangesAsync();
    }

    private static async Task SeedReviewsAsync(ApplicationDbContext context)
    {
        if (await context.Reviews.AnyAsync()) return;

        var customer = await context.Users.FirstAsync(u => u.Username == "johndoe");
        var product = await context.Products.FirstAsync(p => p.Sku == "IPHONE15PRO");

        var review = new Review
        {
            UserId = customer.Id,
            ProductId = product.Id,
            Rating = 5,
            Title = "Excellent phone!",
            Comment = "This phone exceeded my expectations. The camera quality is amazing and the performance is top-notch.",
            IsVerifiedPurchase = true,
            IsApproved = true,
            ApprovedAt = DateTime.UtcNow
        };

        context.Reviews.Add(review);
        await context.SaveChangesAsync();
    }

    private static async Task SeedNotificationsAsync(ApplicationDbContext context)
    {
        if (await context.Notifications.AnyAsync()) return;

        var customer = await context.Users.FirstAsync(u => u.Username == "johndoe");

        var notifications = new List<Notification>
        {
            new()
            {
                UserId = customer.Id,
                Title = "Order Delivered",
                Message = "Your order ORD-2024-001 has been delivered successfully!",
                Type = NotificationType.Order,
                Priority = NotificationPriority.Normal,
                IsRead = false
            },
            new()
            {
                UserId = customer.Id,
                Title = "Welcome to our store!",
                Message = "Thank you for joining us. Enjoy 10% off your first purchase!",
                Type = NotificationType.Marketing,
                Priority = NotificationPriority.Low,
                IsRead = true,
                ReadAt = DateTime.UtcNow.AddDays(-1)
            }
        };

        context.Notifications.AddRange(notifications);
        await context.SaveChangesAsync();
    }

    private static async Task SeedPaymentMethodsAsync(ApplicationDbContext context)
    {
        if (await context.CreditCardPayments.AnyAsync() || await context.PaypalPayments.AnyAsync()) return;

        // Get or create a payment to associate with payment methods
        var payment = await context.Payments.FirstOrDefaultAsync();
        if (payment == null)
        {
            // Create a sample payment
            var user = await context.Users.FirstAsync(u => u.Username == "johndoe");
            var order = await context.Orders.FirstAsync();
            
            payment = new Payment
            {
                UserId = user.Id,
                OrderId = order.Id,
                PaymentNumber = "PAY-2024-001",
                Method = PaymentMethod.CreditCard,
                Status = PaymentStatus.Completed,
                Amount = 999.99m,
                Currency = "USD",
                TransactionId = "txn_sample_123",
                PaymentGateway = "Stripe",
                ProcessedAt = DateTime.UtcNow
            };
            
            context.Payments.Add(payment);
            await context.SaveChangesAsync();
        }

        var creditCardPayments = new List<CreditCardPayment>
        {
            new()
            {
                PaymentId = payment.Id,
                Amount = 999.99m,
                Currency = "USD",
                TransactionId = "cc_txn_123456789",
                Status = PaymentStatus.Completed,
                LastFourDigits = "4242",
                CardBrand = "Visa",
                CardHolderName = "John Doe",
                ExpiryMonth = 12,
                ExpiryYear = 2026,
                AuthorizationCode = "AUTH123456",
                ProcessorName = "Stripe"
            },
            new()
            {
                PaymentId = payment.Id,
                Amount = 89.99m,
                Currency = "USD",
                TransactionId = "cc_txn_987654321",
                Status = PaymentStatus.Completed,
                LastFourDigits = "1234",
                CardBrand = "Mastercard",
                CardHolderName = "Jane Smith",
                ExpiryMonth = 8,
                ExpiryYear = 2025,
                AuthorizationCode = "AUTH789012",
                ProcessorName = "Stripe"
            }
        };

        var paypalPayments = new List<PaypalPayment>
        {
            new()
            {
                PaymentId = payment.Id,
                Amount = 299.99m,
                Currency = "USD",
                TransactionId = "pp_txn_abcdef123",
                Status = PaymentStatus.Completed,
                PaypalTransactionId = "PAYPAL123456789",
                PayerId = "PAYER123",
                PayerEmail = "customer@example.com",
                PayerName = "Customer Name",
                PaymentMethod = "instant",
                PaypalResponse = "COMPLETED"
            }
        };

        context.CreditCardPayments.AddRange(creditCardPayments);
        context.PaypalPayments.AddRange(paypalPayments);
        await context.SaveChangesAsync();
    }
}