using System.ComponentModel.DataAnnotations;

namespace GraphQLApi.Models;

public class Review : BaseEntity
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }

    [StringLength(200)]
    public string? Title { get; set; }

    [StringLength(2000)]
    public string? Comment { get; set; }

    public bool IsVerifiedPurchase { get; set; } = false;

    public bool IsApproved { get; set; } = false;

    public bool IsFeatured { get; set; } = false;

    public int HelpfulVotes { get; set; } = 0;

    public int UnhelpfulVotes { get; set; } = 0;

    public DateTime? ApprovedAt { get; set; }

    [StringLength(100)]
    public string? ApprovedBy { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Product Product { get; set; } = null!;
    public ICollection<ReviewVote> ReviewVotes { get; set; } = new List<ReviewVote>();
    public ICollection<ReviewImage> ReviewImages { get; set; } = new List<ReviewImage>();
}

public class ReviewVote : BaseEntity
{
    [Required]
    public int ReviewId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public bool IsHelpful { get; set; }

    // Navigation properties
    public Review Review { get; set; } = null!;
    public User User { get; set; } = null!;
}

public class ReviewImage : BaseEntity
{
    [Required]
    public int ReviewId { get; set; }

    [Required]
    [StringLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    [StringLength(200)]
    public string? AltText { get; set; }

    public int SortOrder { get; set; } = 0;

    // Navigation properties
    public Review Review { get; set; } = null!;
}