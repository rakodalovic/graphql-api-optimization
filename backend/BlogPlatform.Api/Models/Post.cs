using System.ComponentModel.DataAnnotations;

namespace BlogPlatform.Api.Models;

public class Post
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    public string Content { get; set; } = string.Empty;
    
    [StringLength(300)]
    public string? Summary { get; set; }
    
    public int AuthorId { get; set; }
    
    public int CategoryId { get; set; }
    
    public bool IsPublished { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? PublishedAt { get; set; }
    
    // Navigation properties
    public virtual User Author { get; set; } = null!;
    public virtual Category Category { get; set; } = null!;
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
}