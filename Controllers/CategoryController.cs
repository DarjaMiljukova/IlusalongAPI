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

        // Получение всех категорий
        [HttpGet]
        public IActionResult GetCategories()
        {
            var categories = _context.Categories.ToList();
            return Ok(categories);
        }

        // Метод для добавления новой категории (без услуг)
        [HttpPost("addCategory")]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            // Проверяем, что категория не пустая
            if (category == null || string.IsNullOrEmpty(category.Name))
            {
                return BadRequest("Название категории не может быть пустым.");
            }

            // Добавляем категорию в базу данных
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return Ok($"Категория '{category.Name}' успешно добавлена.");
        }
    }
}
