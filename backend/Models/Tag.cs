using System.ComponentModel.DataAnnotations;

namespace GraphQLApi.Models;

public class Tag : BaseEntity
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(100)]
    public string? Slug { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }

    [StringLength(20)]
    public string? Color { get; set; }

    [StringLength(50)]
    public string? Icon { get; set; }

    public bool IsActive { get; set; } = true;

    public int UsageCount { get; set; } = 0;

    public TagType Type { get; set; } = TagType.General;

    // Navigation properties
    public ICollection<ProductTag> ProductTags { get; set; } = new List<ProductTag>();
    public ICollection<UserTag> UserTags { get; set; } = new List<UserTag>();
    public ICollection<OrderTag> OrderTags { get; set; } = new List<OrderTag>();
}

public class ProductTag : BaseEntity
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    public int TagId { get; set; }

    public DateTime TaggedAt { get; set; } = DateTime.UtcNow;

    [StringLength(100)]
    public string? TaggedBy { get; set; }

    // Navigation properties
    public Product Product { get; set; } = null!;
    public Tag Tag { get; set; } = null!;
}

public class UserTag : BaseEntity
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public int TagId { get; set; }

    public DateTime TaggedAt { get; set; } = DateTime.UtcNow;

    [StringLength(100)]
    public string? TaggedBy { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Tag Tag { get; set; } = null!;
}

public class OrderTag : BaseEntity
{
    [Required]
    public int OrderId { get; set; }

    [Required]
    public int TagId { get; set; }

    public DateTime TaggedAt { get; set; } = DateTime.UtcNow;

    [StringLength(100)]
    public string? TaggedBy { get; set; }

    // Navigation properties
    public Order Order { get; set; } = null!;
    public Tag Tag { get; set; } = null!;
}

public enum TagType
{
    General = 1,
    Category = 2,
    Brand = 3,
    Feature = 4,
    Promotion = 5,
    Season = 6,
    Color = 7,
    Size = 8,
    Material = 9,
    Style = 10
}