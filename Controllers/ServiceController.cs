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


        [HttpPost]
        public IActionResult AddService([FromBody] Service service)
        {

            if (service == null || string.IsNullOrEmpty(service.Name) || service.CategoryId <= 0 || service.Price <= 0)
                return BadRequest("Некорректные данные для услуги.");

            var category = _context.Categories.FirstOrDefault(c => c.Id == service.CategoryId);
            if (category == null)
                return BadRequest("Категория с указанным ID не найдена.");

            service.Category = category;


            _context.Services.Add(service);
            _context.SaveChanges();

            return Ok("Услуга успешно добавлена.");
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
    }
}
