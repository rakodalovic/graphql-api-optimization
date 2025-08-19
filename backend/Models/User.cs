using System.ComponentModel.DataAnnotations;
using HotChocolate;

namespace GraphQLApi.Models;

public class User : BaseEntity
{
    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(255)]
    [GraphQLType(typeof(GraphQLApi.GraphQL.Scalars.EmailType))]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    public string PasswordHash { get; set; } = string.Empty;

    [Phone]
    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    public bool IsActive { get; set; } = true;

    public bool EmailConfirmed { get; set; } = false;

    public DateTime? LastLoginAt { get; set; }

    // Navigation properties
    public UserProfile? Profile { get; set; }
    public UserPreferences? Preferences { get; set; }
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<ReviewVote> ReviewVotes { get; set; } = new List<ReviewVote>();
    public ICollection<Cart> Carts { get; set; } = new List<Cart>();
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<UserTag> UserTags { get; set; } = new List<UserTag>();
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}

public class UserProfile : BaseEntity
{
    [Required]
    public int UserId { get; set; }

    [StringLength(500)]
    public string? Bio { get; set; }

    [StringLength(255)]
    [GraphQLType(typeof(GraphQLApi.GraphQL.Scalars.UrlType))]
    public string? AvatarUrl { get; set; }

    public DateTime? DateOfBirth { get; set; }

    [StringLength(10)]
    public string? Gender { get; set; }

    [StringLength(100)]
    public string? Country { get; set; }

    [StringLength(100)]
    public string? City { get; set; }

    [StringLength(20)]
    public string? TimeZone { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
}

public class UserPreferences : BaseEntity
{
    [Required]
    public int UserId { get; set; }

    public bool EmailNotifications { get; set; } = true;
    public bool SmsNotifications { get; set; } = false;
    public bool PushNotifications { get; set; } = true;
    public bool MarketingEmails { get; set; } = false;

    [StringLength(10)]
    public string Language { get; set; } = "en";

    [StringLength(10)]
    public string Currency { get; set; } = "USD";

    [StringLength(20)]
    public string Theme { get; set; } = "light";

    // Navigation properties
    public User User { get; set; } = null!;
}

public class Role : BaseEntity
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [StringLength(200)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}

public class UserRole : BaseEntity
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public int RoleId { get; set; }

    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ExpiresAt { get; set; }

    public bool IsActive { get; set; } = true;

    // Navigation properties
    public User User { get; set; } = null!;
    public Role Role { get; set; } = null!;
}