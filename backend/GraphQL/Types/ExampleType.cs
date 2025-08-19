using System.Text.Json;
using GraphQLApi.Models;
using HotChocolate;

namespace GraphQLApi.GraphQL.Types;

public class ExampleType
{
    public int Id { get; set; }
    
    [GraphQLType(typeof(GraphQLApi.GraphQL.Scalars.EmailType))]
    public string Email { get; set; } = string.Empty;
    
    [GraphQLType(typeof(GraphQLApi.GraphQL.Scalars.UrlType))]
    public string Website { get; set; } = string.Empty;
    
    [GraphQLType(typeof(GraphQLApi.GraphQL.Scalars.JsonType))]
    public JsonElement Metadata { get; set; }
    
    public OrderStatus OrderStatus { get; set; }
    
    public PaymentStatus PaymentStatus { get; set; }
}