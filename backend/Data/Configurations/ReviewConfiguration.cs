using GraphQLApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GraphQLApi.Data.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Title)
            .HasMaxLength(200);

        builder.Property(r => r.Comment)
            .HasMaxLength(2000);

        builder.Property(r => r.ApprovedBy)
            .HasMaxLength(100);

        // Indexes
        builder.HasIndex(r => new { r.ProductId, r.IsApproved });
        builder.HasIndex(r => new { r.UserId, r.ProductId })
            .IsUnique();
        builder.HasIndex(r => r.Rating);
        builder.HasIndex(r => r.CreatedAt);

        // Relationships
        builder.HasMany(r => r.ReviewVotes)
            .WithOne(rv => rv.Review)
            .HasForeignKey(rv => rv.ReviewId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(r => r.ReviewImages)
            .WithOne(ri => ri.Review)
            .HasForeignKey(ri => ri.ReviewId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class ReviewVoteConfiguration : IEntityTypeConfiguration<ReviewVote>
{
    public void Configure(EntityTypeBuilder<ReviewVote> builder)
    {
        builder.HasKey(rv => rv.Id);

        // Composite unique index - one vote per user per review
        builder.HasIndex(rv => new { rv.ReviewId, rv.UserId })
            .IsUnique();
    }
}

public class ReviewImageConfiguration : IEntityTypeConfiguration<ReviewImage>
{
    public void Configure(EntityTypeBuilder<ReviewImage> builder)
    {
        builder.HasKey(ri => ri.Id);

        builder.Property(ri => ri.ImageUrl)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(ri => ri.AltText)
            .HasMaxLength(200);

        // Indexes
        builder.HasIndex(ri => new { ri.ReviewId, ri.SortOrder });
    }
}