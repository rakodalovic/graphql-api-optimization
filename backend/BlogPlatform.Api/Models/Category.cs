using System.ComponentModel.DataAnnotations;

namespace BlogPlatform.Api.Models;

public class Category
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(200)]
    public string? Description { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
}