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
            var user = Request.Headers["UserEmail"].ToString();
            var password = Request.Headers["UserPassword"].ToString();

            if (user == "admin@gmail.com" && password == "admin") 
            {
                var category = await _context.Categories.FindAsync(service.CategoryId);
                if (category == null)
                {
                    return BadRequest("Категория не найдена.");
                }

                _context.Services.Add(service);
                await _context.SaveChangesAsync();
                return Ok("Услуга добавлена.");
            }

            return Unauthorized("Только админ может добавлять услуги.");
        }

        [HttpDelete("deleteService/{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var user = Request.Headers["UserEmail"].ToString();
            var password = Request.Headers["UserPassword"].ToString();

            if (user == "admin@gmail.com" && password == "admin") 
            {
                var service = await _context.Services.FindAsync(id);
                if (service == null)
                {
                    return NotFound("Услуга не найдена.");
                }

                _context.Services.Remove(service);
                await _context.SaveChangesAsync();
                return Ok("Услуга удалена.");
            }

            return Unauthorized("Только админ может удалять услуги.");
        }
    }
}
