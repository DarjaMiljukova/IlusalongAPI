using Microsoft.AspNetCore.Mvc;
using IlusalongAPI.Models;

namespace IlusalongAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly SalonContext _context;

        public UserController(SalonContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
                return BadRequest("Email и пароль обязательны.");

            if (_context.Users.Any(u => u.Email == user.Email))
                return Conflict("Пользователь с таким Email уже существует.");

            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok("Пользователь успешно зарегистрирован.");
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            var existingUser = _context.Users
                .FirstOrDefault(u => u.Email == user.Email && u.Password == user.Password);

            if (existingUser == null)
                return Unauthorized("Неверные данные для входа.");

            return Ok(new { UserId = existingUser.Id, Role = existingUser.Role });
        }
    }
}
