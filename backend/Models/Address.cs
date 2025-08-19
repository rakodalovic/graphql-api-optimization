using System.ComponentModel.DataAnnotations;

namespace GraphQLApi.Models;

public class Address : BaseEntity
{
    [Required]
    public int UserId { get; set; }

    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = string.Empty;

    [StringLength(100)]
    public string? Company { get; set; }

    [Required]
    [StringLength(200)]
    public string AddressLine1 { get; set; } = string.Empty;

    [StringLength(200)]
    public string? AddressLine2 { get; set; }

    [Required]
    [StringLength(100)]
    public string City { get; set; } = string.Empty;

    [StringLength(100)]
    public string? State { get; set; }

    [Required]
    [StringLength(20)]
    public string PostalCode { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Country { get; set; } = string.Empty;

    [Phone]
    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    public AddressType Type { get; set; } = AddressType.Both;

    public bool IsDefault { get; set; } = false;

    [StringLength(100)]
    public string? Label { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<Order> ShippingOrders { get; set; } = new List<Order>();
    public ICollection<Order> BillingOrders { get; set; } = new List<Order>();
}

public enum AddressType
{
    Shipping = 1,
    Billing = 2,
    Both = 3
}