using GraphQLApi.Data;
using GraphQLApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace RestApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductsController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all products - Returns ALL fields (demonstrates over-fetching)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
        [FromQuery] int limit = 10,
        [FromQuery] int offset = 0)
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Where(p => p.IsActive)
            .Skip(offset)
            .Take(limit)
            .ToListAsync();

        return Ok(products);
    }

    /// <summary>
    /// Get single product - Returns ALL fields including related data (demonstrates over-fetching)
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    /// <summary>
    /// Get reviews for a product - Requires separate request (demonstrates under-fetching)
    /// </summary>
    [HttpGet("{id}/reviews")]
    public async Task<ActionResult<IEnumerable<Review>>> GetProductReviews(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        var reviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.ProductId == id && r.IsApproved)
            .ToListAsync();

        return Ok(reviews);
    }

    /// <summary>
    /// Get category for a product - Requires separate request (demonstrates under-fetching)
    /// </summary>
    [HttpGet("{id}/category")]
    public async Task<ActionResult<Category>> GetProductCategory(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

        if (product == null)
        {
            return NotFound();
        }

        return Ok(product.Category);
    }

    /// <summary>
    /// Get images for a product - Requires separate request (demonstrates under-fetching)
    /// </summary>
    [HttpGet("{id}/images")]
    public async Task<ActionResult<IEnumerable<ProductImage>>> GetProductImages(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        var images = await _context.ProductImages
            .Where(i => i.ProductId == id)
            .ToListAsync();

        return Ok(images);
    }
}
