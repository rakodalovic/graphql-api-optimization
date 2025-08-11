using GraphQLApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GraphQLApi.Data.Configurations;

public class AddressConfiguration : IEntityTypeConfiguration<Address>
{
    public void Configure(EntityTypeBuilder<Address> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(a => a.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(a => a.Company)
            .HasMaxLength(100);

        builder.Property(a => a.AddressLine1)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(a => a.AddressLine2)
            .HasMaxLength(200);

        builder.Property(a => a.City)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(a => a.State)
            .HasMaxLength(100);

        builder.Property(a => a.PostalCode)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(a => a.Country)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(a => a.PhoneNumber)
            .HasMaxLength(20);

        builder.Property(a => a.Label)
            .HasMaxLength(100);

        // Indexes
        builder.HasIndex(a => new { a.UserId, a.IsDefault });
        builder.HasIndex(a => a.PostalCode);
        builder.HasIndex(a => a.Country);
    }
}