using GraphQLApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GraphQLApi.Data.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Description)
            .HasMaxLength(500);

        builder.Property(p => p.Sku)
            .HasMaxLength(100);

        builder.Property(p => p.Price)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(p => p.CompareAtPrice)
            .HasColumnType("decimal(18,2)");

        builder.Property(p => p.CostPrice)
            .HasColumnType("decimal(18,2)");

        builder.Property(p => p.Weight)
            .HasColumnType("decimal(5,2)");

        builder.Property(p => p.WeightUnit)
            .HasMaxLength(50);

        builder.Property(p => p.MetaTitle)
            .HasMaxLength(500);

        builder.Property(p => p.MetaDescription)
            .HasMaxLength(1000);

        // Indexes
        builder.HasIndex(p => p.Sku)
            .IsUnique()
            .HasFilter("[Sku] IS NOT NULL");

        builder.HasIndex(p => p.Name);
        builder.HasIndex(p => p.IsActive);
        builder.HasIndex(p => p.IsFeatured);

        // Relationships
        builder.HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.Variants)
            .WithOne(pv => pv.Product)
            .HasForeignKey(pv => pv.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Images)
            .WithOne(pi => pi.Product)
            .HasForeignKey(pi => pi.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Reviews)
            .WithOne(r => r.Product)
            .HasForeignKey(r => r.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.CartItems)
            .WithOne(ci => ci.Product)
            .HasForeignKey(ci => ci.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.OrderItems)
            .WithOne(oi => oi.Product)
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.ProductTags)
            .WithOne(pt => pt.Product)
            .HasForeignKey(pt => pt.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class ProductVariantConfiguration : IEntityTypeConfiguration<ProductVariant>
{
    public void Configure(EntityTypeBuilder<ProductVariant> builder)
    {
        builder.HasKey(pv => pv.Id);

        builder.Property(pv => pv.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(pv => pv.Sku)
            .HasMaxLength(100);

        builder.Property(pv => pv.Price)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(pv => pv.CompareAtPrice)
            .HasColumnType("decimal(18,2)");

        builder.Property(pv => pv.Weight)
            .HasColumnType("decimal(5,2)");

        builder.Property(pv => pv.ImageUrl)
            .HasMaxLength(255);

        // Indexes
        builder.HasIndex(pv => pv.Sku)
            .IsUnique()
            .HasFilter("[Sku] IS NOT NULL");

        builder.HasIndex(pv => new { pv.ProductId, pv.IsActive });

        // Relationships
        builder.HasMany(pv => pv.Attributes)
            .WithOne(pva => pva.ProductVariant)
            .HasForeignKey(pva => pva.ProductVariantId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class ProductVariantAttributeConfiguration : IEntityTypeConfiguration<ProductVariantAttribute>
{
    public void Configure(EntityTypeBuilder<ProductVariantAttribute> builder)
    {
        builder.HasKey(pva => pva.Id);

        builder.Property(pva => pva.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(pva => pva.Value)
            .IsRequired()
            .HasMaxLength(200);

        // Composite index
        builder.HasIndex(pva => new { pva.ProductVariantId, pva.Name });
    }
}

public class ProductImageConfiguration : IEntityTypeConfiguration<ProductImage>
{
    public void Configure(EntityTypeBuilder<ProductImage> builder)
    {
        builder.HasKey(pi => pi.Id);

        builder.Property(pi => pi.ImageUrl)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(pi => pi.AltText)
            .HasMaxLength(200);

        // Indexes
        builder.HasIndex(pi => new { pi.ProductId, pi.IsPrimary });
        builder.HasIndex(pi => new { pi.ProductId, pi.SortOrder });
    }
}

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.Description)
            .HasMaxLength(500);

        builder.Property(c => c.Slug)
            .HasMaxLength(200);

        builder.Property(c => c.ImageUrl)
            .HasMaxLength(500);

        builder.Property(c => c.MetaTitle)
            .HasMaxLength(500);

        builder.Property(c => c.MetaDescription)
            .HasMaxLength(1000);

        // Indexes
        builder.HasIndex(c => c.Slug)
            .IsUnique()
            .HasFilter("[Slug] IS NOT NULL");

        builder.HasIndex(c => c.ParentCategoryId);
        builder.HasIndex(c => c.IsActive);

        // Self-referencing relationship
        builder.HasOne(c => c.ParentCategory)
            .WithMany(c => c.SubCategories)
            .HasForeignKey(c => c.ParentCategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}