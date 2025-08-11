using GraphQLApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GraphQLApi.Data.Configurations;

public class CartConfiguration : IEntityTypeConfiguration<Cart>
{
    public void Configure(EntityTypeBuilder<Cart> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.SessionId)
            .HasMaxLength(100);

        builder.Property(c => c.SubtotalAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(c => c.TaxAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(c => c.ShippingAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(c => c.DiscountAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(c => c.TotalAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(c => c.Currency)
            .HasMaxLength(10)
            .HasDefaultValue("USD");

        // Indexes
        builder.HasIndex(c => new { c.UserId, c.IsActive });
        builder.HasIndex(c => c.SessionId);

        // Relationships
        builder.HasMany(c => c.CartItems)
            .WithOne(ci => ci.Cart)
            .HasForeignKey(ci => ci.CartId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
{
    public void Configure(EntityTypeBuilder<CartItem> builder)
    {
        builder.HasKey(ci => ci.Id);

        builder.Property(ci => ci.UnitPrice)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(ci => ci.TotalPrice)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        // Indexes
        builder.HasIndex(ci => ci.CartId);
        builder.HasIndex(ci => new { ci.CartId, ci.ProductId, ci.ProductVariantId })
            .IsUnique();

        // Relationships
        builder.HasOne(ci => ci.ProductVariant)
            .WithMany()
            .HasForeignKey(ci => ci.ProductVariantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}