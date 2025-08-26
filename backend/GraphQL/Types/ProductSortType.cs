using GraphQLApi.Models;
using HotChocolate.Data.Sorting;

namespace GraphQLApi.GraphQL.Types;

public class ProductSortType : SortInputType<Product>
{
    protected override void Configure(ISortInputTypeDescriptor<Product> descriptor)
    {
        // Configure all fields including Price with proper decimal handling
        descriptor.Field(p => p.Id);
        descriptor.Field(p => p.Name);
        descriptor.Field(p => p.CreatedAt);
        descriptor.Field(p => p.UpdatedAt);
        descriptor.Field(p => p.StockQuantity);
        descriptor.Field(p => p.IsActive);
        descriptor.Field(p => p.IsFeatured);
        
        // Enable Price fields for sorting - SQLite handles decimal sorting correctly
        descriptor.Field(p => p.Price);
        descriptor.Field(p => p.CompareAtPrice);
        descriptor.Field(p => p.CostPrice);
    }
}