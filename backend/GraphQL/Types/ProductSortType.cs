using GraphQLApi.Models;
using HotChocolate.Data.Sorting;

namespace GraphQLApi.GraphQL.Types;

public class ProductSortType : SortInputType<Product>
{
    protected override void Configure(ISortInputTypeDescriptor<Product> descriptor)
    {
        // Configure sortable fields (excluding decimal fields due to SQLite limitation)
        descriptor.Field(p => p.Id);
        descriptor.Field(p => p.Name);
        descriptor.Field(p => p.CreatedAt);
        descriptor.Field(p => p.UpdatedAt);
        descriptor.Field(p => p.StockQuantity);
        descriptor.Field(p => p.IsActive);
        descriptor.Field(p => p.IsFeatured);

        // Decimal fields (Price, CompareAtPrice, CostPrice) are NOT included here
        // because SQLite doesn't support sorting by decimal type.
        // Use the productsByPrice query instead for price-based sorting.
    }
}