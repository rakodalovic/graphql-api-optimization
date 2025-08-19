using GraphQLApi.Models;
using HotChocolate.Types;

namespace GraphQLApi.GraphQL;

/// <summary>
/// Union type for search results that can return User, Product, or Category
/// </summary>
public class SearchResultUnion : UnionType
{
    protected override void Configure(IUnionTypeDescriptor descriptor)
    {
        descriptor.Name("SearchResult");
        descriptor.Type<ObjectType<User>>();
        descriptor.Type<ObjectType<Product>>();
        descriptor.Type<ObjectType<Category>>();
    }
}

/// <summary>
/// Union type for payment methods that can return CreditCardPayment or PaypalPayment
/// </summary>
public class PaymentMethodUnion : UnionType
{
    protected override void Configure(IUnionTypeDescriptor descriptor)
    {
        descriptor.Name("PaymentMethodResult");
        descriptor.Type<ObjectType<CreditCardPayment>>();
        descriptor.Type<ObjectType<PaypalPayment>>();
    }
}