using GraphQLApi.Models;
using HotChocolate.Types;

namespace GraphQLApi.GraphQL.Types;

public class PaymentStatusType : EnumType<PaymentStatus>
{
    protected override void Configure(IEnumTypeDescriptor<PaymentStatus> descriptor)
    {
        descriptor.Name("PaymentStatus");
        descriptor.Description("Represents the current status of a payment transaction");
        
        descriptor.Value(PaymentStatus.Pending)
            .Description("Payment has been initiated but not yet processed");
            
        descriptor.Value(PaymentStatus.Processing)
            .Description("Payment is currently being processed by the payment gateway");
            
        descriptor.Value(PaymentStatus.Completed)
            .Description("Payment has been successfully completed");
            
        descriptor.Value(PaymentStatus.Failed)
            .Description("Payment processing failed due to an error");
            
        descriptor.Value(PaymentStatus.Cancelled)
            .Description("Payment was cancelled before completion");
            
        descriptor.Value(PaymentStatus.Refunded)
            .Description("Payment has been fully refunded to the customer");
            
        descriptor.Value(PaymentStatus.PartiallyRefunded)
            .Description("Payment has been partially refunded to the customer");
    }
}