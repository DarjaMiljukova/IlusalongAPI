using IlusalongAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        // Метод для получения всех записей
        [HttpGet]
        public IActionResult GetAllAppointments()
        {
            var appointments = _context.Appointments
                .Include(a => a.Service)  // Загружаем данные об услугах
                .Include(a => a.User)    // Загружаем данные о пользователях
                .ToList();

            if (!appointments.Any())
                return NotFound("Записи не найдены.");

            return Ok(appointments);
        }

        // Метод для получения записи по ID
        [HttpGet("{id}")]
        public IActionResult GetAppointmentById(int id)
        {
            var appointment = _context.Appointments
                .Include(a => a.Service)  

                .Include(a => a.User)   
                .FirstOrDefault(a => a.Id == id);

            if (appointment == null)
                return NotFound("Запись не найдена.");

            return Ok(appointment);
        }


        [HttpPost]
        public IActionResult CreateAppointment([FromBody] Appointment appointment)
        {
            if (appointment.AppointmentDate < DateTime.Now)
                return BadRequest("Дата записи должна быть в будущем.");

            var user = _context.Users.FirstOrDefault(u => u.Id == appointment.UserId);
            if (user == null)
                return BadRequest("Пользователь с указанным ID не найден.");

            var service = _context.Services.FirstOrDefault(s => s.Id == appointment.ServiceId);
            if (service == null)
                return BadRequest("Услуга с указанным ID не найдена.");

            appointment.User = user;
            appointment.Service = service;
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
