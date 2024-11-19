using IlusalongAPI.Data;
using IlusalongAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IlusalongAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceController : ControllerBase
    {
        private readonly SalonContext _context;

        public ServiceController(SalonContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllServices()
        {
            var services = await _context.Services.Include(s => s.Category).ToListAsync();
            return Ok(services);
        }
        [HttpPost]
        public async Task<IActionResult> AddService([FromBody] Service service)
        {
            if (string.IsNullOrWhiteSpace(service.Name) || service.Price <= 0)
            {
                return BadRequest("Название и цена услуги обязательны.");
            }

            var category = await _context.Categories.FindAsync(service.CategoryId);
            if (category == null)
            {
                return BadRequest("Категория с указанным ID не найдена.");
            }

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return Ok($"Услуга '{service.Name}' добавлена в категорию '{category.Name}'.");
        }
        [HttpDelete("deleteService/{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
            {
                return NotFound("Услуга с указанным ID не найдена.");
            }

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return Ok("Услуга успешно удалена.");
        }
    }
}
