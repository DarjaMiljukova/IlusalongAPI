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
            if (!categories.Any())
                return NotFound("Категории не найдены.");
            return Ok(categories);
        }
        [HttpPost]
        public IActionResult AddCategory([FromBody] Category category)
        {
            if (category == null || string.IsNullOrEmpty(category.Name))
                return BadRequest("Название категории обязательно.");

            _context.Categories.Add(category);
            _context.SaveChanges();
            return Ok("Категория успешно добавлена.");
        }

    }
}
