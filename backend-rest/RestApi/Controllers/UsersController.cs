using GraphQLApi.Data;
using GraphQLApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace RestApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get user details - Returns ALL fields including sensitive data (demonstrates over-fetching)
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _context.Users
            .Include(u => u.Profile)
            .Include(u => u.Preferences)
            .FirstOrDefaultAsync(u => u.Id == id && u.IsActive);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    /// <summary>
    /// Get user's reviews - Requires separate request (demonstrates under-fetching)
    /// </summary>
    [HttpGet("{id}/reviews")]
    public async Task<ActionResult<IEnumerable<Review>>> GetUserReviews(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        var reviews = await _context.Reviews
            .Include(r => r.Product)
            .Where(r => r.UserId == id && r.IsApproved)
            .ToListAsync();

        return Ok(reviews);
    }
}
