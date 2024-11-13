using IlusalongAPI.Data;
using IlusalongAPI.Models;
using Microsoft.AspNetCore.Http;
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
                return BadRequest("User already exists.");

            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            var existingUser = _context.Users.SingleOrDefault(u => u.Email == user.Email && u.Password == user.Password);

            if (existingUser == null)
                return Unauthorized("Invalid credentials.");

            return Ok(new { existingUser.Id, existingUser.Email, existingUser.IsAdmin });
        }
    }
}
