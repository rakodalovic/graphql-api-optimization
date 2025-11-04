using GraphQLApi.Data;
using GraphQLApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace RestApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReviewsController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get single review - Returns ALL fields (demonstrates over-fetching)
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Review>> GetReview(int id)
    {
        var review = await _context.Reviews
            .Include(r => r.Product)
            .FirstOrDefaultAsync(r => r.Id == id && r.IsApproved);

        if (review == null)
        {
            return NotFound();
        }

        return Ok(review);
    }

    /// <summary>
    /// Get user who wrote the review - Requires separate request (demonstrates N+1 problem)
    /// When fetching multiple reviews, this requires one API call per review
    /// </summary>
    [HttpGet("{id}/user")]
    public async Task<ActionResult<User>> GetReviewUser(int id)
    {
        var review = await _context.Reviews
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == id && r.IsApproved);

        if (review == null)
        {
            return NotFound();
        }

        return Ok(review.User);
    }
}
