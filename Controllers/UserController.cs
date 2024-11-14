﻿using IlusalongAPI.Data;
using IlusalongAPI.Models;
using Microsoft.AspNetCore.Mvc;

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
            if (_context.Users.Any(u => u.Email == user.Email))
                return BadRequest("Пользователь с таким email уже существует.");

            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok("Пользователь зарегистрирован.");
        }

 
        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            if (user.Email == "admin@gmail.com" && user.Password == "admin")
            {
                return Ok(new { userId = 0, userEmail = user.Email}); 
            }

            var existingUser = _context.Users.SingleOrDefault(u => u.Email == user.Email && u.Password == user.Password);
            if (existingUser == null)
                return Unauthorized("Неверные данные для входа.");

            return Ok(new { userId = existingUser.Id, userEmail = existingUser.Email});
        }

        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            var users = _context.Users.ToList();
            if (!users.Any())
            {
                return NotFound("Пользователи не найдены.");
            }

            return Ok(users);  
        }
    }
}
