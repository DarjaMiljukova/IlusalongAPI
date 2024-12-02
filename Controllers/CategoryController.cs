using IlusalongAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpPost("addCategory")]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            Console.WriteLine($"Received Category: Name={category?.Name}, Description={category?.Description}");

            if (category == null || string.IsNullOrEmpty(category.Name))
            {
                return BadRequest("Название категории не может быть пустым.");
            }

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Категория '{category.Name}' успешно добавлена.", category });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category updatedCategory)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound("Категория не найдена.");
            }

            category.Name = updatedCategory.Name ?? category.Name;
            category.Description = updatedCategory.Description ?? category.Description;

            _context.Categories.Update(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Категория '{category.Name}' успешно обновлена.", category });
        }
    }
}
