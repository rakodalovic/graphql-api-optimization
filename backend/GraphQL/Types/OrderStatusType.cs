using GraphQLApi.Models;
using HotChocolate.Types;

namespace GraphQLApi.GraphQL.Types;

public class OrderStatusType : EnumType<OrderStatus>
{
    protected override void Configure(IEnumTypeDescriptor<OrderStatus> descriptor)
    {
        descriptor.Name("OrderStatus");
        descriptor.Description("Represents the current status of an order");
        
        descriptor.Value(OrderStatus.Pending)
            .Description("Order has been created but not yet confirmed");
            
        descriptor.Value(OrderStatus.Confirmed)
            .Description("Order has been confirmed and accepted");
            
        descriptor.Value(OrderStatus.Processing)
            .Description("Order is being processed and prepared for shipment");
            
        descriptor.Value(OrderStatus.Shipped)
            .Description("Order has been shipped to the customer");
            
        descriptor.Value(OrderStatus.Delivered)
            .Description("Order has been successfully delivered to the customer");
            
        descriptor.Value(OrderStatus.Cancelled)
            .Description("Order has been cancelled before fulfillment");
            
        descriptor.Value(OrderStatus.Refunded)
            .Description("Order has been refunded after payment");
            
        descriptor.Value(OrderStatus.Returned)
            .Description("Order has been returned by the customer");
    }
}