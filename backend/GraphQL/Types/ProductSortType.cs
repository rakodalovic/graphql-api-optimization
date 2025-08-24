using GraphQLApi.Models;
using HotChocolate.Data.Sorting;

namespace GraphQLApi.GraphQL.Types;

public class ProductSortType : SortInputType<Product>
{
    protected override void Configure(ISortInputTypeDescriptor<Product> descriptor)
    {
        // Configure all fields except Price to avoid SQLite decimal sorting issues
        descriptor.Field(p => p.Id);
        descriptor.Field(p => p.Name);
        descriptor.Field(p => p.CreatedAt);
        descriptor.Field(p => p.UpdatedAt);
        descriptor.Field(p => p.StockQuantity);
        descriptor.Field(p => p.IsActive);
        descriptor.Field(p => p.IsFeatured);
        
        // Ignore the Price field to avoid SQLite decimal sorting issues
        descriptor.Field(p => p.Price).Ignore();
        descriptor.Field(p => p.CompareAtPrice).Ignore();
        descriptor.Field(p => p.CostPrice).Ignore();
    }
}