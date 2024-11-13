using IlusalongAPI.Data;
using IlusalongAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IlusalongAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly SalonContext _context;

        public BookingController(SalonContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult CreateBooking([FromBody] Booking booking)
        {
            _context.Bookings.Add(booking);
            _context.SaveChanges();
            return Ok("Booking created successfully.");
        }
    }
}
