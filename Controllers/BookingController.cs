using IlusalongAPI.Data;
using IlusalongAPI.Models;
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

        [HttpGet("services")]
        public IActionResult GetServices()
        {
            var services = _context.Services.ToList();
            return Ok(services);
        }

        [HttpGet("masters/{serviceId}")]
        public IActionResult GetMastersByService(int serviceId)
        {
            var masters = _context.Masters.Where(m => m.ServiceId == serviceId).ToList();
            return Ok(masters);
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
