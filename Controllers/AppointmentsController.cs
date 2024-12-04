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

        [HttpGet]
        public IActionResult GetAllAppointments()
        {
            var appointments = _context.Appointments
                .Include(a => a.Service)  
                .Include(a => a.User)    
                .ToList();

            if (!appointments.Any())
                return NotFound("Записи не найдены.");

            return Ok(appointments);
        }

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

        [HttpGet("master/{masterId}")]
        public IActionResult GetAppointmentsByMaster(int masterId)
        {
            var appointments = _context.Appointments
                .Where(a => a.Service.MasterId == masterId)  // Фильтрация по мастеру
                .Include(a => a.User)
                .Include(a => a.Service)  // Получаем услугу вместе с записью
                .ThenInclude(s => s.Category)  // Получаем категорию услуги (если нужно)
                .ToList();

            if (!appointments.Any())
                return NotFound("Записей не найдено.");

            return Ok(appointments);
        }
        [HttpGet("user/{userId}")]
        public IActionResult GetAppointmentsByUser(int userId)
        {
            var appointments = _context.Appointments
                .Where(a => a.UserId == userId)  // Фильтрация по клиенту
                .Include(a => a.User)
                .Include(a => a.Service)  // Получаем услугу вместе с записью
                .ThenInclude(s => s.Category)  // Получаем категорию услуги (если нужно)
                .ToList();

            if (!appointments.Any())
                return NotFound("Записей не найдено.");

            return Ok(appointments);
        }


        [HttpPost("addAppointment")]
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
            // Ищем запись по ID
            var appointment = _context.Appointments
                .Include(a => a.User)      // Подключаем данные пользователя
                .Include(a => a.Service)   // Подключаем данные услуги
                .FirstOrDefault(a => a.Id == id);

            // Если запись не найдена
            if (appointment == null)
                return NotFound("Запись не найдена.");


            // Если разница меньше 24 часов, возвращаем ошибку
            if ((appointment.AppointmentDate - DateTime.Now).TotalHours < 24)
                return BadRequest("Запись нельзя отменить менее чем за 24 часа до посещения.");

            // Удаляем запись
            _context.Appointments.Remove(appointment);
            _context.SaveChanges();

            return Ok("Запись успешно удалена.");
        }

    }
}
