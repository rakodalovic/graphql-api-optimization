using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GraphQLApi.Data.Configurations;

public class TagConfiguration : IEntityTypeConfiguration<Models.Tag>
{
    public void Configure(EntityTypeBuilder<Models.Tag> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(t => t.Slug)
            .HasMaxLength(100);

        builder.Property(t => t.Description)
            .HasMaxLength(500);

        builder.Property(t => t.Color)
            .HasMaxLength(20);

        builder.Property(t => t.Icon)
            .HasMaxLength(50);

        // Indexes
        builder.HasIndex(t => t.Name)
            .IsUnique();

        builder.HasIndex(t => t.Slug)
            .IsUnique()
            .HasFilter("[Slug] IS NOT NULL");

        builder.HasIndex(t => t.Type);
        builder.HasIndex(t => t.IsActive);

        // Relationships
        builder.HasMany(t => t.ProductTags)
            .WithOne(pt => pt.Tag)
            .HasForeignKey(pt => pt.TagId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(t => t.UserTags)
            .WithOne(ut => ut.Tag)
            .HasForeignKey(ut => ut.TagId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(t => t.OrderTags)
            .WithOne(ot => ot.Tag)
            .HasForeignKey(ot => ot.TagId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class ProductTagConfiguration : IEntityTypeConfiguration<Models.ProductTag>
{
    public void Configure(EntityTypeBuilder<Models.ProductTag> builder)
    {
        builder.HasKey(pt => pt.Id);

        builder.Property(pt => pt.TaggedBy)
            .HasMaxLength(100);

        // Composite unique index
        builder.HasIndex(pt => new { pt.ProductId, pt.TagId })
            .IsUnique();

        // Index for queries
        builder.HasIndex(pt => pt.TaggedAt);
    }
}

public class UserTagConfiguration : IEntityTypeConfiguration<Models.UserTag>
{
    public void Configure(EntityTypeBuilder<Models.UserTag> builder)
    {
        builder.HasKey(ut => ut.Id);

        builder.Property(ut => ut.TaggedBy)
            .HasMaxLength(100);

        // Composite unique index
        builder.HasIndex(ut => new { ut.UserId, ut.TagId })
            .IsUnique();

        // Index for queries
        builder.HasIndex(ut => ut.TaggedAt);
    }
}

public class OrderTagConfiguration : IEntityTypeConfiguration<Models.OrderTag>
{
    public void Configure(EntityTypeBuilder<Models.OrderTag> builder)
    {
        builder.HasKey(ot => ot.Id);

        builder.Property(ot => ot.TaggedBy)
            .HasMaxLength(100);

        // Composite unique index
        builder.HasIndex(ot => new { ot.OrderId, ot.TagId })
            .IsUnique();

        // Index for queries
        builder.HasIndex(ot => ot.TaggedAt);
    }
}