using GraphQLApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GraphQLApi.Data.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.PaymentNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(p => p.Amount)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(p => p.RefundedAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(p => p.Currency)
            .HasMaxLength(10)
            .HasDefaultValue("USD");

        builder.Property(p => p.TransactionId)
            .HasMaxLength(200);

        builder.Property(p => p.PaymentIntentId)
            .HasMaxLength(200);

        builder.Property(p => p.PaymentGateway)
            .HasMaxLength(100);

        builder.Property(p => p.GatewayResponse)
            .HasMaxLength(500);

        builder.Property(p => p.Notes)
            .HasMaxLength(1000);

        builder.Property(p => p.FailureReason)
            .HasMaxLength(500);

        // Indexes
        builder.HasIndex(p => p.PaymentNumber)
            .IsUnique();

        builder.HasIndex(p => p.TransactionId);
        builder.HasIndex(p => new { p.UserId, p.Status });
        builder.HasIndex(p => p.Status);
        builder.HasIndex(p => p.CreatedAt);

        // Relationships
        builder.HasMany(p => p.PaymentHistory)
            .WithOne(ph => ph.Payment)
            .HasForeignKey(ph => ph.PaymentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class PaymentHistoryConfiguration : IEntityTypeConfiguration<PaymentHistory>
{
    public void Configure(EntityTypeBuilder<PaymentHistory> builder)
    {
        builder.HasKey(ph => ph.Id);

        builder.Property(ph => ph.Notes)
            .HasMaxLength(500);

        builder.Property(ph => ph.ChangedBy)
            .HasMaxLength(100);

        // Indexes
        builder.HasIndex(ph => new { ph.PaymentId, ph.ChangedAt });
    }
}