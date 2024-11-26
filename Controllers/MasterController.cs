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

        // Получение всех мастеров
        [HttpGet]
        public IActionResult GetAllMasters()
        {
            var masters = _context.Users.Where(u => u.Role == "master").ToList();
            if (!masters.Any())
                return NotFound("Мастера не найдены.");

            return Ok(masters);
        }

        // Получение мастера по ID
        [HttpGet("{id}")]
        public IActionResult GetMasterById(int id)
        {
            var master = _context.Users.FirstOrDefault(u => u.Id == id && u.Role == "master");
            if (master == null)
                return NotFound("Мастер не найден.");

            return Ok(master);
        }

        // Добавление мастера
        [HttpPost]
        public IActionResult AddMaster([FromBody] User master)
        {
            if (string.IsNullOrEmpty(master.Email) || string.IsNullOrEmpty(master.Password))
                return BadRequest("Email и пароль обязательны для добавления мастера.");

            if (_context.Users.Any(u => u.Email == master.Email))
                return BadRequest("Мастер с таким email уже существует.");

            master.Role = "master"; // Устанавливаем роль "master"
            _context.Users.Add(master);
            _context.SaveChanges();

            return Ok(new { message = "Мастер успешно добавлен.", master });
        }

        // Изменение данных мастера
        [HttpPut("{id}")]
        public IActionResult UpdateMaster(int id, [FromBody] User updatedMaster)
        {
            var master = _context.Users.FirstOrDefault(u => u.Id == id && u.Role == "master");
            if (master == null)
                return NotFound("Мастер не найден.");

            master.Email = updatedMaster.Email ?? master.Email;
            master.PhoneNumber = updatedMaster.PhoneNumber ?? master.PhoneNumber;
            master.Password = updatedMaster.Password ?? master.Password;

            _context.Users.Update(master);
            _context.SaveChanges();

            return Ok(new { message = "Данные мастера успешно обновлены.", master });
        }

    }
}
