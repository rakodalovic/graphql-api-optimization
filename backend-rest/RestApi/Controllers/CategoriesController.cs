using GraphQLApi.Data;
using GraphQLApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace RestApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CategoriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all categories - Returns ALL fields (demonstrates over-fetching)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        var categories = await _context.Categories
            .Include(c => c.SubCategories)
            .Where(c => c.IsActive)
            .ToListAsync();

        return Ok(categories);
    }

    /// <summary>
    /// Get single category - Returns ALL fields (demonstrates over-fetching)
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetCategory(int id)
    {
        var category = await _context.Categories
            .Include(c => c.ParentCategory)
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

        if (category == null)
        {
            return NotFound();
        }

        return Ok(category);
    }

    /// <summary>
    /// Get products in a category - Requires separate request (demonstrates under-fetching)
    /// </summary>
    [HttpGet("{id}/products")]
    public async Task<ActionResult<IEnumerable<Product>>> GetCategoryProducts(
        int id,
        [FromQuery] int limit = 10)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
        {
            return NotFound();
        }

        var products = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Where(p => p.CategoryId == id && p.IsActive)
            .Take(limit)
            .ToListAsync();

        return Ok(products);
    }
}
