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

        // Получение услуг, связанных с мастером
        [HttpGet("{masterId}/services")]
        public IActionResult GetServicesByMaster(int masterId)
        {
            var masterServices = _context.Appointments
                .Where(a => a.MasterId == masterId) // Ищем записи с указанным мастером
                .Include(a => a.Service) // Подгружаем данные об услуге
                .Select(a => new
                {
                    ServiceId = a.Service.Id,
                    ServiceName = a.Service.Name,
                    Description = a.Service.Description,
                    Price = a.Service.Price
                })
                .Distinct() // Убираем дубликаты
                .ToList();

            if (!masterServices.Any())
                return NotFound("У мастера нет привязанных услуг.");

            return Ok(masterServices);
        }

        // Получение всех записей
        [HttpGet("all")]
        public IActionResult GetBookings()
        {
            var bookings = _context.Appointments
                .Include(a => a.Service) // Подгружаем данные об услугах
                .Include(a => a.Master) // Подгружаем данные о мастерах
                .Include(a => a.User)   // Подгружаем данные о пользователях
                .Select(a => new
                {
                    BookingId = a.Id,
                    UserName = a.User.Email,
                    ServiceName = a.Service.Name,
                    MasterName = a.Master.Name,
                    AppointmentDate = a.AppointmentDate,
                    Status = a.Status
                })
                .ToList();

            if (!bookings.Any())
                return NotFound("Записи не найдены.");

            return Ok(bookings);
        }

        // Создание записи
        [HttpPost]
        public IActionResult CreateBooking([FromBody] Appointment appointment)
        {
            if (appointment == null)
                return BadRequest("Некорректные данные для записи.");

            appointment.Status = "scheduled"; // Устанавливаем статус по умолчанию
            _context.Appointments.Add(appointment);
            _context.SaveChanges();

            return Ok("Запись успешно создана.");
        }

        // Обновление записи
        [HttpPut("{id}")]
        public IActionResult UpdateBooking(int id, [FromBody] Appointment updatedAppointment)
        {
            var appointment = _context.Appointments.Find(id);
            if (appointment == null)
                return NotFound("Запись не найдена.");

            appointment.MasterId = updatedAppointment.MasterId;
            appointment.ServiceId = updatedAppointment.ServiceId;
            appointment.AppointmentDate = updatedAppointment.AppointmentDate;
            appointment.Status = updatedAppointment.Status;

            _context.SaveChanges();
            return Ok("Запись успешно обновлена.");
        }

        // Удаление записи
        [HttpDelete("{id}")]
        public IActionResult DeleteBooking(int id)
        {
            var appointment = _context.Appointments.Find(id);
            if (appointment == null)
                return NotFound("Запись не найдена.");

            _context.Appointments.Remove(appointment);
            _context.SaveChanges();
            return Ok("Запись успешно удалена.");
        }
    }
}
