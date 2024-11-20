using IlusalongAPI.Models;
using Microsoft.AspNetCore.Mvc;

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
            var masters = _context.Masters.ToList();
            if (!masters.Any())
                return NotFound("Мастера не найдены.");
            return Ok(masters);
        }
        [HttpPost]
        public IActionResult AddMaster([FromBody] Master master)
        {
            if (master == null || string.IsNullOrEmpty(master.Name))
                return BadRequest("Имя мастера обязательно.");

            _context.Masters.Add(master);
            _context.SaveChanges();
            return Ok("Мастер успешно добавлен.");
        }

    }
}
