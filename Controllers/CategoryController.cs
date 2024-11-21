
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
            var categories = _context.Categories.Include(c => c.Services).ToList();  
            return Ok(categories);
        }

        [HttpPost]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            if (category == null || category.Services == null || !category.Services.Any())
            {
                return BadRequest("Категория должна содержать хотя бы одну услугу.");
            }

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            foreach (var service in category.Services)
            {
                service.CategoryId = category.Id;  
                _context.Services.Add(service);
            }
            await _context.SaveChangesAsync();

            return Ok("Категория с услугами добавлена.");
        }
    }
}
