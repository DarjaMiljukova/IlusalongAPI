using IlusalongAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace IlusalongAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly SalonContext _context;

        public AppointmentController(SalonContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult CreateAppointment([FromBody] Appointment appointment)
        {
            if (appointment.AppointmentDate < DateTime.Now)
                return BadRequest("Дата записи должна быть в будущем.");

            appointment.Status = "scheduled";
            _context.Appointments.Add(appointment);
            _context.SaveChanges();
            return Ok("Запись успешно создана.");
        }

        [HttpDelete("{id}")]
        public IActionResult CancelAppointment(int id)
        {
            var appointment = _context.Appointments.Find(id);
            if (appointment == null)
                return NotFound("Запись не найдена.");

            if ((appointment.AppointmentDate - DateTime.Now).TotalHours < 24)
                return BadRequest("Запись нельзя отменить менее чем за 24 часа до посещения.");

            appointment.Status = "canceled";
            _context.SaveChanges();
            return Ok("Запись успешно отменена.");
        }
    }
}
