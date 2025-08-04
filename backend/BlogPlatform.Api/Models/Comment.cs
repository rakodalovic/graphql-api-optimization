using System.ComponentModel.DataAnnotations;

namespace BlogPlatform.Api.Models;

public class Comment
{
    public int Id { get; set; }
    
    [Required]
    public string Content { get; set; } = string.Empty;
    
    public int PostId { get; set; }
    
    public int UserId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual Post Post { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}