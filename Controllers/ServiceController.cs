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

        // Метод для получения всех услуг
        [HttpGet]
        public IActionResult GetAllServices()
        {
            var services = _context.Services.ToList();
            if (!services.Any())
                return NotFound("Услуги не найдены.");
            return Ok(services);
        }

        // Метод для получения всех услуг по категории
        [HttpGet("{categoryId}")]
        public IActionResult GetServicesByCategory(int categoryId)
        {
            var services = _context.Services
                .Where(s => s.CategoryId == categoryId)  // Ищем все услуги по категории
                .ToList();

            if (!services.Any())
                return NotFound("Услуги для этой категории не найдены.");

            return Ok(services);
        }

        // Метод для добавления новой услуги
        [HttpPost]
        public IActionResult AddService([FromBody] Service service)
        {
            // Проверяем, что данные корректны
            if (service == null || string.IsNullOrEmpty(service.Name) || service.CategoryId <= 0 || service.Price <= 0)
                return BadRequest("Некорректные данные для услуги.");

            // Проверяем, существует ли категория с таким ID
            var category = _context.Categories.FirstOrDefault(c => c.Id == service.CategoryId);
            if (category == null)
                return BadRequest("Категория с указанным ID не найдена.");

            // Связываем услугу с существующей категорией
            service.Category = category;

            // Добавляем услугу в базу данных
            _context.Services.Add(service);
            _context.SaveChanges();

            return Ok("Услуга успешно добавлена.");
        }


        // Метод для получения услуги по ID
        [HttpGet("{id}")]
        public IActionResult GetServiceById(int id)
        {
            var service = _context.Services
                .Include(s => s.Category)  // Загружаем информацию о категории услуги
                .FirstOrDefault(s => s.Id == id);

            if (service == null)
                return NotFound("Услуга не найдена.");

            return Ok(service);
        }
    }
}