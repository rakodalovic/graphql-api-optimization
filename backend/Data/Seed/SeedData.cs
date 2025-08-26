using GraphQLApi.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

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
        await SeedProductImagesAsync(context);
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
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"), // Password: password123
                IsActive = true,
                EmailConfirmed = true
            },
            new()
            {
                FirstName = "Jane",
                LastName = "Smith",
                Email = "jane.smith@example.com",
                Username = "janesmith",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"), // Password: password123
                IsActive = true,
                EmailConfirmed = true
            },
            new()
            {
                FirstName = "Admin",
                LastName = "User",
                Email = "admin@example.com",
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"), // Password: admin123
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
        var laptopCategory = await context.Categories.FirstAsync(c => c.Name == "Laptops");
        var clothingCategory = await context.Categories.FirstAsync(c => c.Name == "Clothing");
        var mensClothingCategory = await context.Categories.FirstAsync(c => c.Name == "Men's Clothing");
        var womensClothingCategory = await context.Categories.FirstAsync(c => c.Name == "Women's Clothing");
        var booksCategory = await context.Categories.FirstAsync(c => c.Name == "Books");
        var homeGardenCategory = await context.Categories.FirstAsync(c => c.Name == "Home & Garden");

        var products = new List<Product>
        {
            // Electronics - Smartphones
            new()
            {
                Name = "iPhone 15 Pro",
                Description = "Experience the ultimate in smartphone technology with the iPhone 15 Pro. Featuring a titanium design, advanced camera system with 5x telephoto zoom, and the powerful A17 Pro chip for unmatched performance.",
                Sku = "IPHONE15PRO",
                Price = 999.99m,
                CompareAtPrice = 1099.99m,
                StockQuantity = 50,
                IsActive = true,
                IsFeatured = true,
                CategoryId = smartphoneCategory.Id,
                Weight = 0.187m,
                WeightUnit = "kg",
                MetaTitle = "iPhone 15 Pro - Premium Smartphone",
                MetaDescription = "Get the latest iPhone 15 Pro with titanium design and advanced features"
            },
            new()
            {
                Name = "Samsung Galaxy S24 Ultra",
                Description = "Unleash your creativity with the Samsung Galaxy S24 Ultra. Features a built-in S Pen, 200MP camera with AI enhancement, and the most powerful Galaxy processor ever built.",
                Sku = "GALAXYS24ULTRA",
                Price = 1199.99m,
                CompareAtPrice = 1299.99m,
                StockQuantity = 35,
                IsActive = true,
                IsFeatured = true,
                CategoryId = smartphoneCategory.Id,
                Weight = 0.232m,
                WeightUnit = "kg",
                MetaTitle = "Samsung Galaxy S24 Ultra - AI Smartphone",
                MetaDescription = "Advanced AI smartphone with S Pen and 200MP camera"
            },
            new()
            {
                Name = "Google Pixel 8 Pro",
                Description = "Capture life's moments with the Google Pixel 8 Pro. Powered by Google AI for the best photos and videos, featuring Magic Eraser, Best Take, and 7 years of security updates.",
                Sku = "PIXEL8PRO",
                Price = 899.99m,
                StockQuantity = 25,
                IsActive = true,
                CategoryId = smartphoneCategory.Id,
                Weight = 0.210m,
                WeightUnit = "kg",
                MetaTitle = "Google Pixel 8 Pro - AI Photography",
                MetaDescription = "AI-powered smartphone with advanced photography features"
            },
            
            // Electronics - Laptops
            new()
            {
                Name = "MacBook Pro 16\" M3",
                Description = "Supercharge your workflow with the MacBook Pro 16\" featuring the M3 chip. Perfect for developers, creators, and professionals who demand the best performance and battery life.",
                Sku = "MBP16M3",
                Price = 2499.99m,
                CompareAtPrice = 2699.99m,
                StockQuantity = 20,
                IsActive = true,
                IsFeatured = true,
                CategoryId = laptopCategory.Id,
                Weight = 2.16m,
                WeightUnit = "kg",
                MetaTitle = "MacBook Pro 16\" M3 - Professional Laptop",
                MetaDescription = "High-performance laptop for professionals and creators"
            },
            new()
            {
                Name = "Dell XPS 13 Plus",
                Description = "Experience premium performance with the Dell XPS 13 Plus. Features a stunning 13.4\" OLED display, Intel 12th Gen processors, and an ultra-modern design that's perfect for business and creativity.",
                Sku = "DELLXPS13PLUS",
                Price = 1299.99m,
                StockQuantity = 18,
                IsActive = true,
                CategoryId = laptopCategory.Id,
                Weight = 1.26m,
                WeightUnit = "kg",
                MetaTitle = "Dell XPS 13 Plus - Premium Ultrabook",
                MetaDescription = "Premium ultrabook with OLED display and modern design"
            },
            new()
            {
                Name = "Gaming Laptop ASUS ROG",
                Description = "Dominate your games with the ASUS ROG gaming laptop. Equipped with NVIDIA RTX 4070, AMD Ryzen 9, and a 165Hz display for the ultimate gaming experience.",
                Sku = "ASUSROG4070",
                Price = 1899.99m,
                StockQuantity = 12,
                IsActive = true,
                CategoryId = laptopCategory.Id,
                Weight = 2.4m,
                WeightUnit = "kg",
                MetaTitle = "ASUS ROG Gaming Laptop - High Performance",
                MetaDescription = "High-performance gaming laptop with RTX 4070"
            },
            
            // Clothing - Men's
            new()
            {
                Name = "Premium Cotton T-Shirt",
                Description = "Elevate your casual wardrobe with our premium 100% organic cotton t-shirt. Soft, breathable, and sustainably made for the environmentally conscious gentleman.",
                Sku = "PREMIUMTEE-M",
                Price = 49.99m,
                CompareAtPrice = 69.99m,
                StockQuantity = 100,
                IsActive = true,
                CategoryId = mensClothingCategory.Id,
                Weight = 0.2m,
                WeightUnit = "kg",
                MetaTitle = "Premium Organic Cotton T-Shirt Men",
                MetaDescription = "Sustainable premium cotton t-shirt for men"
            },
            new()
            {
                Name = "Classic Denim Jacket",
                Description = "A timeless classic that never goes out of style. This premium denim jacket is crafted from high-quality cotton denim with authentic vintage wash and durable construction.",
                Sku = "DENIMJACKET-M",
                Price = 129.99m,
                StockQuantity = 45,
                IsActive = true,
                IsFeatured = true,
                CategoryId = mensClothingCategory.Id,
                Weight = 0.8m,
                WeightUnit = "kg",
                MetaTitle = "Classic Men's Denim Jacket",
                MetaDescription = "Timeless denim jacket with premium quality construction"
            },
            
            // Clothing - Women's
            new()
            {
                Name = "Elegant Silk Blouse",
                Description = "Sophisticated and versatile, this silk blouse is perfect for both office and evening wear. Made from 100% mulberry silk with a flattering cut that complements any figure.",
                Sku = "SILKBLOUSE-W",
                Price = 159.99m,
                CompareAtPrice = 199.99m,
                StockQuantity = 30,
                IsActive = true,
                IsFeatured = true,
                CategoryId = womensClothingCategory.Id,
                Weight = 0.15m,
                WeightUnit = "kg",
                MetaTitle = "Elegant Women's Silk Blouse",
                MetaDescription = "Premium silk blouse perfect for professional and evening wear"
            },
            
            // Books
            new()
            {
                Name = "The Art of Clean Code",
                Description = "Master the craft of writing clean, maintainable code with this comprehensive guide. Essential reading for developers who want to improve their coding skills and create software that stands the test of time.",
                Sku = "CLEANCODE-BOOK",
                Price = 39.99m,
                StockQuantity = 75,
                IsActive = true,
                CategoryId = booksCategory.Id,
                Weight = 0.5m,
                WeightUnit = "kg",
                MetaTitle = "The Art of Clean Code - Programming Book",
                MetaDescription = "Essential programming book for writing clean, maintainable code"
            },
            
            // Home & Garden
            new()
            {
                Name = "Smart Home Security Camera",
                Description = "Keep your home secure with this advanced smart security camera. Features 4K resolution, night vision, two-way audio, and AI-powered motion detection with smartphone alerts.",
                Sku = "SMARTCAM4K",
                Price = 199.99m,
                CompareAtPrice = 249.99m,
                StockQuantity = 40,
                IsActive = true,
                CategoryId = homeGardenCategory.Id,
                Weight = 0.4m,
                WeightUnit = "kg",
                MetaTitle = "4K Smart Security Camera",
                MetaDescription = "Advanced 4K smart security camera with AI motion detection"
            }
        };

        context.Products.AddRange(products);
        await context.SaveChangesAsync();

        // Add product variants for iPhone
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
            },
            new()
            {
                ProductId = iphone.Id,
                Name = "512GB - Blue Titanium",
                Sku = "IPHONE15PRO-512-BT",
                Price = 1299.99m,
                StockQuantity = 10,
                IsActive = true,
                SortOrder = 3
            }
        };

        context.ProductVariants.AddRange(variants);
        await context.SaveChangesAsync();
    }

    private static async Task SeedProductImagesAsync(ApplicationDbContext context)
    {
        if (await context.ProductImages.AnyAsync()) return;

        // Get all products to add images
        var iphone = await context.Products.FirstAsync(p => p.Sku == "IPHONE15PRO");
        var galaxy = await context.Products.FirstAsync(p => p.Sku == "GALAXYS24ULTRA");
        var pixel = await context.Products.FirstAsync(p => p.Sku == "PIXEL8PRO");
        var macbook = await context.Products.FirstAsync(p => p.Sku == "MBP16M3");
        var dell = await context.Products.FirstAsync(p => p.Sku == "DELLXPS13PLUS");
        var asus = await context.Products.FirstAsync(p => p.Sku == "ASUSROG4070");
        var tshirt = await context.Products.FirstAsync(p => p.Sku == "PREMIUMTEE-M");
        var jacket = await context.Products.FirstAsync(p => p.Sku == "DENIMJACKET-M");
        var blouse = await context.Products.FirstAsync(p => p.Sku == "SILKBLOUSE-W");
        var book = await context.Products.FirstAsync(p => p.Sku == "CLEANCODE-BOOK");
        var camera = await context.Products.FirstAsync(p => p.Sku == "SMARTCAM4K");

        var productImages = new List<ProductImage>
        {
            // iPhone 15 Pro Images
            new()
            {
                ProductId = iphone.Id,
                ImageUrl = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop&crop=center",
                AltText = "iPhone 15 Pro Natural Titanium Front View",
                IsPrimary = true,
                SortOrder = 1
            },
            new()
            {
                ProductId = iphone.Id,
                ImageUrl = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop&crop=left",
                AltText = "iPhone 15 Pro Side View",
                IsPrimary = false,
                SortOrder = 2
            },

            // Samsung Galaxy S24 Ultra Images
            new()
            {
                ProductId = galaxy.Id,
                ImageUrl = "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop&crop=center",
                AltText = "Samsung Galaxy S24 Ultra with S Pen",
                IsPrimary = true,
                SortOrder = 1
            },
            new()
            {
                ProductId = galaxy.Id,
                ImageUrl = "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop&crop=right",
                AltText = "Samsung Galaxy S24 Ultra Back View",
                IsPrimary = false,
                SortOrder = 2
            },

            // Google Pixel 8 Pro Images
            new()
            {
                ProductId = pixel.Id,
                ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center",
                AltText = "Google Pixel 8 Pro Camera Bar",
                IsPrimary = true,
                SortOrder = 1
            },

            // MacBook Pro M3 Images
            new()
            {
                ProductId = macbook.Id,
                ImageUrl = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop&crop=center",
                AltText = "MacBook Pro 16 inch M3 Chip Open",
                IsPrimary = true,
                SortOrder = 1
            },
            new()
            {
                ProductId = macbook.Id,
                ImageUrl = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop&crop=top",
                AltText = "MacBook Pro M3 Closed View",
                IsPrimary = false,
                SortOrder = 2
            },

            // Dell XPS 13 Plus Images
            new()
            {
                ProductId = dell.Id,
                ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop&crop=center",
                AltText = "Dell XPS 13 Plus OLED Display",
                IsPrimary = true,
                SortOrder = 1
            },

            // ASUS ROG Gaming Laptop Images
            new()
            {
                ProductId = asus.Id,
                ImageUrl = "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop&crop=center",
                AltText = "ASUS ROG Gaming Laptop RGB Keyboard",
                IsPrimary = true,
                SortOrder = 1
            },

            // Premium T-Shirt Images
            new()
            {
                ProductId = tshirt.Id,
                ImageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&crop=center",
                AltText = "Premium Organic Cotton T-Shirt",
                IsPrimary = true,
                SortOrder = 1
            },

            // Denim Jacket Images
            new()
            {
                ProductId = jacket.Id,
                ImageUrl = "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=500&fit=crop&crop=center",
                AltText = "Classic Men's Denim Jacket",
                IsPrimary = true,
                SortOrder = 1
            },

            // Silk Blouse Images
            new()
            {
                ProductId = blouse.Id,
                ImageUrl = "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop&crop=center",
                AltText = "Elegant Women's Silk Blouse",
                IsPrimary = true,
                SortOrder = 1
            },

            // Programming Book Images
            new()
            {
                ProductId = book.Id,
                ImageUrl = "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=500&fit=crop&crop=center",
                AltText = "The Art of Clean Code Programming Book",
                IsPrimary = true,
                SortOrder = 1
            },

            // Smart Security Camera Images
            new()
            {
                ProductId = camera.Id,
                ImageUrl = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&crop=center",
                AltText = "4K Smart Home Security Camera",
                IsPrimary = true,
                SortOrder = 1
            }
        };

        context.ProductImages.AddRange(productImages);
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

        var johnUser = await context.Users.FirstAsync(u => u.Username == "johndoe");
        var janeUser = await context.Users.FirstAsync(u => u.Username == "janesmith");
        var adminUser = await context.Users.FirstAsync(u => u.Username == "admin");

        var iphone = await context.Products.FirstAsync(p => p.Sku == "IPHONE15PRO");
        var galaxy = await context.Products.FirstAsync(p => p.Sku == "GALAXYS24ULTRA");
        var macbook = await context.Products.FirstAsync(p => p.Sku == "MBP16M3");
        var jacket = await context.Products.FirstAsync(p => p.Sku == "DENIMJACKET-M");
        var blouse = await context.Products.FirstAsync(p => p.Sku == "SILKBLOUSE-W");
        var book = await context.Products.FirstAsync(p => p.Sku == "CLEANCODE-BOOK");

        var reviews = new List<Review>
        {
            // iPhone Reviews
            new()
            {
                UserId = johnUser.Id,
                ProductId = iphone.Id,
                Rating = 5,
                Title = "Outstanding Performance and Camera Quality",
                Comment = "The iPhone 15 Pro exceeded all my expectations. The titanium build feels premium, the camera system is incredible especially in low light, and the A17 Pro chip handles everything I throw at it effortlessly. Worth every penny!",
                IsVerifiedPurchase = true,
                IsApproved = true,
                ApprovedAt = DateTime.UtcNow.AddDays(-5)
            },
            new()
            {
                UserId = janeUser.Id,
                ProductId = iphone.Id,
                Rating = 4,
                Title = "Great phone but expensive",
                Comment = "Really love the camera and the overall performance. The titanium design is beautiful and feels very premium. Battery life is excellent. My only complaint is the price point, but you do get what you pay for.",
                IsVerifiedPurchase = true,
                IsApproved = true,
                ApprovedAt = DateTime.UtcNow.AddDays(-3)
            },

            // Galaxy S24 Ultra Reviews
            new()
            {
                UserId = janeUser.Id,
                ProductId = galaxy.Id,
                Rating = 5,
                Title = "S Pen makes all the difference",
                Comment = "As someone who takes a lot of notes and sketches, the S Pen integration is phenomenal. The 200MP camera produces stunning photos, and the AI features are actually useful. Best Android phone I've ever owned.",
                IsVerifiedPurchase = true,
                IsApproved = true,
                ApprovedAt = DateTime.UtcNow.AddDays(-7)
            },
            new()
            {
                UserId = adminUser.Id,
                ProductId = galaxy.Id,
                Rating = 4,
                Title = "Powerful but takes getting used to",
                Comment = "The hardware is impressive and the camera quality is top-notch. OneUI has improved a lot. The S Pen is great for productivity. Only downside is the learning curve coming from other Android phones.",
                IsVerifiedPurchase = false,
                IsApproved = true,
                ApprovedAt = DateTime.UtcNow.AddDays(-2)
            },

            // MacBook Pro Reviews
            new()
            {
                UserId = johnUser.Id,
                ProductId = macbook.Id,
                Rating = 5,
                Title = "Developer's Dream Machine",
                Comment = "As a software developer, this MacBook Pro M3 is absolutely perfect. Compilation times are lightning fast, battery life lasts all day, and the display is gorgeous. The performance per watt is unmatched. Highly recommend for any professional work.",
                IsVerifiedPurchase = true,
                IsApproved = true,
                ApprovedAt = DateTime.UtcNow.AddDays(-10)
            },

            // Denim Jacket Reviews
            new()
            {
                UserId = adminUser.Id,
                ProductId = jacket.Id,
                Rating = 5,
                Title = "Classic style, excellent quality",
                Comment = "This denim jacket is exactly what I was looking for. The quality of the denim is excellent, the fit is perfect, and the vintage wash looks authentic. It's become my go-to jacket for casual outings.",
                IsVerifiedPurchase = true,
                IsApproved = true,
                ApprovedAt = DateTime.UtcNow.AddDays(-6)
            },

            // Silk Blouse Reviews
            new()
            {
                UserId = janeUser.Id,
                ProductId = blouse.Id,
                Rating = 5,
                Title = "Elegant and versatile",
                Comment = "This silk blouse is absolutely beautiful. The quality of the silk is exceptional, and it drapes perfectly. I can wear it to the office or dress it up for evening events. The color is exactly as pictured.",
                IsVerifiedPurchase = true,
                IsApproved = true,
                ApprovedAt = DateTime.UtcNow.AddDays(-4)
            },

            // Programming Book Reviews
            new()
            {
                UserId = johnUser.Id,
                ProductId = book.Id,
                Rating = 5,
                Title = "Essential reading for any developer",
                Comment = "This book completely changed how I approach coding. The principles are clearly explained with practical examples. My code is now much more maintainable and my team has noticed the improvement. Every developer should read this.",
                IsVerifiedPurchase = true,
                IsApproved = true,
                ApprovedAt = DateTime.UtcNow.AddDays(-8)
            },
            new()
            {
                UserId = adminUser.Id,
                ProductId = book.Id,
                Rating = 4,
                Title = "Good fundamentals but could be more concise",
                Comment = "Solid book with good examples and principles. Some sections could be more concise, but overall it covers the important aspects of writing clean code. Good for both beginners and experienced developers.",
                IsVerifiedPurchase = true,
                IsApproved = true,
                ApprovedAt = DateTime.UtcNow.AddDays(-1)
            }
        };

        context.Reviews.AddRange(reviews);
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