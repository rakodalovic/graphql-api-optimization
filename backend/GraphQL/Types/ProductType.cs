using GraphQLApi.Models;
using HotChocolate.Types;

namespace GraphQLApi.GraphQL.Types;

public class ProductType : ObjectType<Product>
{
    protected override void Configure(IObjectTypeDescriptor<Product> descriptor)
    {
        // Make the Reviews field nullable to prevent GraphQL errors when there are no reviews
        descriptor.Field(p => p.Reviews)
            .Type<ListType<NonNullType<ObjectType<Review>>>>()
            .Description("The reviews for this product");
    }
}