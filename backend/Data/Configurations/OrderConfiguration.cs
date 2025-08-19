using GraphQLApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GraphQLApi.Data.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);

        builder.Property(o => o.OrderNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(o => o.SubtotalAmount)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(o => o.TaxAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(o => o.ShippingAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(o => o.DiscountAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(o => o.TotalAmount)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(o => o.Currency)
            .HasMaxLength(10)
            .HasDefaultValue("USD");

        builder.Property(o => o.Notes)
            .HasMaxLength(1000);

        builder.Property(o => o.CancellationReason)
            .HasMaxLength(500);

        // Indexes
        builder.HasIndex(o => o.OrderNumber)
            .IsUnique();

        builder.HasIndex(o => new { o.UserId, o.Status });
        builder.HasIndex(o => o.Status);
        builder.HasIndex(o => o.CreatedAt);

        // Relationships
        builder.HasOne(o => o.ShippingAddress)
            .WithMany(a => a.ShippingOrders)
            .HasForeignKey(o => o.ShippingAddressId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(o => o.BillingAddress)
            .WithMany(a => a.BillingOrders)
            .HasForeignKey(o => o.BillingAddressId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(o => o.OrderItems)
            .WithOne(oi => oi.Order)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(o => o.Payments)
            .WithOne(p => p.Order)
            .HasForeignKey(p => p.OrderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(o => o.StatusHistory)
            .WithOne(osh => osh.Order)
            .HasForeignKey(osh => osh.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(o => o.OrderTags)
            .WithOne(ot => ot.Order)
            .HasForeignKey(ot => ot.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.HasKey(oi => oi.Id);

        builder.Property(oi => oi.ProductName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(oi => oi.ProductSku)
            .HasMaxLength(100);

        builder.Property(oi => oi.VariantName)
            .HasMaxLength(200);

        builder.Property(oi => oi.UnitPrice)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(oi => oi.TotalPrice)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        // Indexes
        builder.HasIndex(oi => oi.OrderId);
        builder.HasIndex(oi => oi.ProductId);

        // Relationships
        builder.HasOne(oi => oi.ProductVariant)
            .WithMany()
            .HasForeignKey(oi => oi.ProductVariantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class OrderStatusHistoryConfiguration : IEntityTypeConfiguration<OrderStatusHistory>
{
    public void Configure(EntityTypeBuilder<OrderStatusHistory> builder)
    {
        builder.HasKey(osh => osh.Id);

        builder.Property(osh => osh.Notes)
            .HasMaxLength(500);

        builder.Property(osh => osh.ChangedBy)
            .HasMaxLength(100);

        // Indexes
        builder.HasIndex(osh => new { osh.OrderId, osh.ChangedAt });
    }
}