using IlusalongAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        // Метод для получения всех пользователей
        [HttpGet]
        public IActionResult GetAllUsers()
        {
            var users = _context.Users.ToList();
            if (!users.Any())
                return NotFound("Пользователи не найдены.");
            return Ok(users);
        }

        // Метод для получения пользователя по ID
        [HttpGet("{id}")]
        public IActionResult GetUserById(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);

            if (user == null)
                return NotFound("Пользователь не найден.");

            return Ok(user);
        }

        // Регистрация нового пользователя
        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            // Проверка, существует ли пользователь с таким email
            if (_context.Users.Any(u => u.Email == user.Email))
                return BadRequest("Пользователь с таким email уже существует.");

            // Проверка, указан ли номер телефона
            if (string.IsNullOrEmpty(user.PhoneNumber))
                return BadRequest("Номер телефона обязателен.");

            // Автоматически назначаем роль клиента, если это не админ
            user.Role = "client";

            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok("Пользователь зарегистрирован с ролью клиента.");
        }

        // Логин пользователя
        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            // Проверка на администратора
            if (user.Email == "admin@gmail.com" && user.Password == "admin")
            {
                return Ok(new { userId = 0, userEmail = user.Email, role = "admin" });
            }

            // Проверяем в базе данных
            var existingUser = _context.Users.SingleOrDefault(u => u.Email == user.Email && u.Password == user.Password);
            if (existingUser == null)
                return Unauthorized("Неверные данные для входа.");

            return Ok(new { userId = existingUser.Id, userEmail = existingUser.Email, role = existingUser.Role });
        }
        // Метод для изменения данных пользователя
        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] User updatedUser)
        {
            // Находим пользователя по ID
            var existingUser = _context.Users.FirstOrDefault(u => u.Id == id);
            if (existingUser == null)
                return NotFound("Пользователь не найден.");

            // Обновляем поля, только если они переданы
            if (!string.IsNullOrEmpty(updatedUser.Email))
                existingUser.Email = updatedUser.Email;

            if (!string.IsNullOrEmpty(updatedUser.Password))
                existingUser.Password = updatedUser.Password;

            if (!string.IsNullOrEmpty(updatedUser.Role))
                existingUser.Role = updatedUser.Role;

            if (!string.IsNullOrEmpty(updatedUser.PhoneNumber))
                existingUser.PhoneNumber = updatedUser.PhoneNumber;

            // Сохраняем изменения
            _context.Users.Update(existingUser);
            _context.SaveChanges();

            return Ok("Данные пользователя обновлены.");
        }
    }
}
