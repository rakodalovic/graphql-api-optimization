using System.ComponentModel.DataAnnotations;

namespace GraphQLApi.Models;

public class Notification : BaseEntity
{
    [Required]
    public int UserId { get; set; }

    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(1000)]
    public string Message { get; set; } = string.Empty;

    [Required]
    public NotificationType Type { get; set; }

    [Required]
    public NotificationPriority Priority { get; set; } = NotificationPriority.Normal;

    public bool IsRead { get; set; } = false;

    public bool IsArchived { get; set; } = false;

    [StringLength(500)]
    public string? ActionUrl { get; set; }

    [StringLength(100)]
    public string? ActionText { get; set; }

    [StringLength(500)]
    public string? ImageUrl { get; set; }

    [StringLength(1000)]
    public string? Metadata { get; set; }

    public DateTime? ReadAt { get; set; }

    public DateTime? ArchivedAt { get; set; }

    public DateTime? ExpiresAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
}

public enum NotificationType
{
    System = 1,
    Order = 2,
    Payment = 3,
    Shipping = 4,
    Product = 5,
    Review = 6,
    Promotion = 7,
    Security = 8,
    Social = 9,
    Marketing = 10
}

public enum NotificationPriority
{
    Low = 1,
    Normal = 2,
    High = 3,
    Critical = 4
}