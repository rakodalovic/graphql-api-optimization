using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GraphQLApi.GraphQL;

namespace GraphQLApi.Models;

/// <summary>
/// Base class for specific payment method implementations
/// </summary>
public abstract class PaymentMethodBase : BaseEntity, IEntityNode, IAuditable
{
    [Required]
    public int PaymentId { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    [StringLength(10)]
    public string Currency { get; set; } = "USD";

    [StringLength(200)]
    public string? TransactionId { get; set; }

    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    // Navigation properties
    public Payment Payment { get; set; } = null!;
}

/// <summary>
/// Credit card payment method
/// </summary>
public class CreditCardPayment : PaymentMethodBase
{
    [Required]
    [StringLength(4)]
    public string LastFourDigits { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string CardBrand { get; set; } = string.Empty;

    [StringLength(100)]
    public string? CardHolderName { get; set; }

    public int ExpiryMonth { get; set; }

    public int ExpiryYear { get; set; }

    [StringLength(200)]
    public string? AuthorizationCode { get; set; }

    [StringLength(100)]
    public string? ProcessorName { get; set; }
}

/// <summary>
/// PayPal payment method
/// </summary>
public class PaypalPayment : PaymentMethodBase
{
    [Required]
    [StringLength(200)]
    public string PaypalTransactionId { get; set; } = string.Empty;

    [StringLength(200)]
    public string? PayerId { get; set; }

    [StringLength(255)]
    public string? PayerEmail { get; set; }

    [StringLength(100)]
    public string? PayerName { get; set; }

    [StringLength(50)]
    public string? PaymentMethod { get; set; }

    [StringLength(500)]
    public string? PaypalResponse { get; set; }
}