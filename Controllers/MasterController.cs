using IlusalongAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IlusalongAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MasterController : ControllerBase
    {
        private readonly SalonContext _context;

        public MasterController(SalonContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllMasters()
        {
            var masters = _context.Masters
                .Include(m => m.Service)  
                .ThenInclude(s => s.Category)  
                .ToList();

            if (!masters.Any())
                return NotFound("Мастера не найдены.");

            return Ok(masters);
        }

        [HttpPost]
        public IActionResult AddMaster([FromBody] Master master)
        {
            Console.WriteLine($"Received Master: Name={master?.Name}, ServiceId={master?.ServiceId}");

            if (master == null || string.IsNullOrEmpty(master.Name) || master.ServiceId <= 0)
                return BadRequest("Некорректные данные для мастера.");

            var service = _context.Services.FirstOrDefault(s => s.Id == master.ServiceId);
            if (service == null)
                return BadRequest("Услуга с указанным ID не найдена.");

            master.Service = service;

            _context.Masters.Add(master);
            _context.SaveChanges();

            return Ok(new { message = "Мастер успешно добавлен.", master });
        }



        [HttpDelete("deleteMaster/{id}")]
        public IActionResult DeleteMaster(int id)
        {
            var master = _context.Masters.Find(id);
            if (master == null)
                return NotFound("Мастер не найден.");

            _context.Masters.Remove(master);
            _context.SaveChanges();
            return Ok("Мастер удален.");
        }
    }
}
