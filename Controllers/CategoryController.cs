using IlusalongAPI.Data;
using IlusalongAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace IlusalongAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly SalonContext _context;

        public CategoryController(SalonContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IActionResult GetCategories()
        {
            var categories = _context.Categories.ToList();
            return Ok(categories);
        }

        [HttpPost]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            if (category == null || string.IsNullOrWhiteSpace(category.Name))
            {
                return BadRequest("Название категории обязательно.");
            }

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(new { Message = $"Категория '{category.Name}' добавлена.", CategoryId = category.Id });
        }
    }
}
