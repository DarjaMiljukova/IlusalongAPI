﻿using IlusalongAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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
            return Ok("Register success with user role.");
        }

        // Логин пользователя с генерацией JWT
        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            // Проверка на администратора
            if (user.Email == "admin@gmail.com" && user.Password == "admin")
            {
                var token = GenerateJwtToken(0, "admin");
                return Ok(new { token });
            }

            // Проверяем в базе данных
            var existingUser = _context.Users.SingleOrDefault(u => u.Email == user.Email && u.Password == user.Password);
            if (existingUser == null)
                return Unauthorized("Неверные данные для входа.");

            var generatedToken = GenerateJwtToken(existingUser.Id, existingUser.Role);
            return Ok(new { token = generatedToken });
        }

        // Генерация JWT токена
        private string GenerateJwtToken(int userId, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("YourSecretKey12345"); // Замените на ваш секретный ключ
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim("id", userId.ToString()),
            new Claim("role", role)
        }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
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
