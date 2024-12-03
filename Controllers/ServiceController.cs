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
        public IActionResult GetAllServices()
        {
            var services = _context.Services
                .Include(s => s.Category)
                .ToList();

            if (!services.Any())
                return NotFound("Услуги не найдены.");

            return Ok(services);
        }

        [HttpGet("{id}")]
        public IActionResult GetServiceById(int id)
        {
            var service = _context.Services
                .Include(s => s.Category)
                .FirstOrDefault(s => s.Id == id);

            if (service == null)
                return NotFound("Услуга не найдена.");

            return Ok(service);
        }

        [HttpPost("createService")]
        public IActionResult CreateService([FromBody] Service service)
        {
            var master = _context.Users.FirstOrDefault(u => u.Id == service.MasterId && u.Role == "master");
            if (master == null)
                return BadRequest("Мастер с указанным ID не найден или не имеет соответствующей роли.");

            var category = _context.Categories.FirstOrDefault(c => c.Id == service.CategoryId);
            if (category == null)
                return BadRequest("Категория с указанным ID не найдена.");

            service.Category = category;
            service.Master = master;

            _context.Services.Add(service);
            _context.SaveChanges();

            var createdService = _context.Services
                .Include(s => s.Master)
                .Include(s => s.Category)
                .FirstOrDefault(s => s.Id == service.Id);

            return Ok(new { message = "Услуга успешно создана.", service = createdService });
        }


        [HttpPut("{id}")]
        public IActionResult UpdateService(int id, [FromBody] Service updatedService)
        {
            var service = _context.Services.FirstOrDefault(s => s.Id == id);
            if (service == null)
                return NotFound("Услуга не найдена.");

            if (updatedService.CategoryId != 0)
            {
                var category = _context.Categories.FirstOrDefault(c => c.Id == updatedService.CategoryId);
                if (category == null)
                    return BadRequest("Категория с указанным ID не найдена.");
                service.CategoryId = updatedService.CategoryId;
            }

            service.Name = updatedService.Name ?? service.Name;
            service.Description = updatedService.Description ?? service.Description;
            service.Price = updatedService.Price != 0 ? updatedService.Price : service.Price;

            _context.Services.Update(service);
            _context.SaveChanges();

            return Ok(new { message = "Услуга успешно обновлена.", service });
        }


        [HttpGet("master/{masterId}")]
        public IActionResult GetServicesByMaster(int masterId)
        {
            var services = _context.Services.Where(s => s.MasterId == masterId).ToList();

            return Ok(services);
        }
        [HttpGet("category/{categoryId}")]
        public IActionResult GetServicesByCategory(int categoryId)
        {
            var services = _context.Services.Where(s => s.CategoryId == categoryId).ToList();
            if (!services.Any())
            {
                return NotFound("Услуги для указанной категории не найдены.");
            }
            return Ok(services);
        }


    }
}
