using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GraphQLApi.Models;

public class Payment : BaseEntity
{
    [Required]
    public int UserId { get; set; }

    public int? OrderId { get; set; }

    [Required]
    [StringLength(50)]
    public string PaymentNumber { get; set; } = string.Empty;

    [Required]
    public PaymentMethod Method { get; set; }

    [Required]
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    [StringLength(10)]
    public string Currency { get; set; } = "USD";

    [StringLength(200)]
    public string? TransactionId { get; set; }

    [StringLength(200)]
    public string? PaymentIntentId { get; set; }

    [StringLength(100)]
    public string? PaymentGateway { get; set; }

    [StringLength(500)]
    public string? GatewayResponse { get; set; }

    [StringLength(1000)]
    public string? Notes { get; set; }

    public DateTime? ProcessedAt { get; set; }

    public DateTime? FailedAt { get; set; }

    [StringLength(500)]
    public string? FailureReason { get; set; }

    public DateTime? RefundedAt { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal RefundedAmount { get; set; } = 0;

    // Navigation properties
    public User User { get; set; } = null!;
    public Order? Order { get; set; }
    public ICollection<PaymentHistory> PaymentHistory { get; set; } = new List<PaymentHistory>();
}

public class PaymentHistory : BaseEntity
{
    [Required]
    public int PaymentId { get; set; }

    [Required]
    public PaymentStatus Status { get; set; }

    [StringLength(500)]
    public string? Notes { get; set; }

    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    [StringLength(100)]
    public string? ChangedBy { get; set; }

    // Navigation properties
    public Payment Payment { get; set; } = null!;
}

public enum PaymentMethod
{
    CreditCard = 1,
    DebitCard = 2,
    PayPal = 3,
    Stripe = 4,
    BankTransfer = 5,
    Cash = 6,
    Cryptocurrency = 7,
    ApplePay = 8,
    GooglePay = 9
}

public enum PaymentStatus
{
    Pending = 1,
    Processing = 2,
    Completed = 3,
    Failed = 4,
    Cancelled = 5,
    Refunded = 6,
    PartiallyRefunded = 7
}