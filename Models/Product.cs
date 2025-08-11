using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GraphQLApi.Models;

public class Product : BaseEntity
{
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [StringLength(100)]
    public string? Sku { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? CompareAtPrice { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? CostPrice { get; set; }

    [Required]
    public int StockQuantity { get; set; } = 0;

    public int? LowStockThreshold { get; set; }

    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; } = false;
    public bool IsDigital { get; set; } = false;

    [Column(TypeName = "decimal(5,2)")]
    public decimal? Weight { get; set; }

    [StringLength(50)]
    public string? WeightUnit { get; set; }

    [StringLength(500)]
    public string? MetaTitle { get; set; }

    [StringLength(1000)]
    public string? MetaDescription { get; set; }

    [Required]
    public int CategoryId { get; set; }

    // Navigation properties
    public Category Category { get; set; } = null!;
    public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<ProductTag> ProductTags { get; set; } = new List<ProductTag>();
}

public class ProductVariant : BaseEntity
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(100)]
    public string? Sku { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? CompareAtPrice { get; set; }

    [Required]
    public int StockQuantity { get; set; } = 0;

    [Column(TypeName = "decimal(5,2)")]
    public decimal? Weight { get; set; }

    public bool IsActive { get; set; } = true;

    [StringLength(255)]
    public string? ImageUrl { get; set; }

    public int SortOrder { get; set; } = 0;

    // Navigation properties
    public Product Product { get; set; } = null!;
    public ICollection<ProductVariantAttribute> Attributes { get; set; } = new List<ProductVariantAttribute>();
}

public class ProductVariantAttribute : BaseEntity
{
    [Required]
    public int ProductVariantId { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string Value { get; set; } = string.Empty;

    public int SortOrder { get; set; } = 0;

    // Navigation properties
    public ProductVariant ProductVariant { get; set; } = null!;
}

public class ProductImage : BaseEntity
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    [StringLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    [StringLength(200)]
    public string? AltText { get; set; }

    public bool IsPrimary { get; set; } = false;

    public int SortOrder { get; set; } = 0;

    // Navigation properties
    public Product Product { get; set; } = null!;
}

public class Category : BaseEntity
{
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [StringLength(200)]
    public string? Slug { get; set; }

    [StringLength(500)]
    public string? ImageUrl { get; set; }

    public bool IsActive { get; set; } = true;

    public int SortOrder { get; set; } = 0;

    [StringLength(500)]
    public string? MetaTitle { get; set; }

    [StringLength(1000)]
    public string? MetaDescription { get; set; }

    // Self-referencing for hierarchical structure
    public int? ParentCategoryId { get; set; }

    // Navigation properties
    public Category? ParentCategory { get; set; }
    public ICollection<Category> SubCategories { get; set; } = new List<Category>();
    public ICollection<Product> Products { get; set; } = new List<Product>();
}