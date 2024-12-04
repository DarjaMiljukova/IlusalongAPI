using IlusalongAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MailKit.Net.Smtp;
using MimeKit;
using System.Net.Mail;
using System.Net;

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

            // Отправка письма с подтверждением
            SendBookingConfirmationEmail(user.Email, service.Name, appointment.AppointmentDate);

            return Ok("Запись успешно создана. Подтверждение отправлено на вашу почту.");
        }

        private void SendBookingConfirmationEmail(string userEmail, string serviceName, DateTime appointmentDate)
        {
            SendEmail(userEmail, "Подтверждение бронирования", $"<p>Здравствуйте!</p><p>Вы успешно забронировали услугу: <b>{serviceName}</b> на дату: <b>{appointmentDate}</b>.</p>");

        }
        private static string SendEmail(string email, string subject, string body)
        {
            try
            {
                System.Net.Mail.SmtpClient smtpClient = new("smtp.mailersend.net")
                {
                    Port = 587,
                    Credentials = new NetworkCredential("MS_TyVFhe@trial-x2p0347d5p74zdrn.mlsender.net", "ivMXsuGSwInH3NJV"),
                    EnableSsl = true
                };
                MailMessage mailMessage = new()
                {
                    From = new MailAddress("MS_TyVFhe@trial-x2p0347d5p74zdrn.mlsender.net", "Ilusalong"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(email);
                smtpClient.Send(mailMessage);
                return "Email sent successfully!";
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
        }

        [HttpDelete("{id}")]
        public IActionResult CancelAppointment(int id)
        {

            var appointment = _context.Appointments
                .Include(a => a.User)      
                .Include(a => a.Service)   
                .FirstOrDefault(a => a.Id == id);


            if (appointment == null)
                return NotFound("Запись не найдена.");


            if ((appointment.AppointmentDate - DateTime.Now).TotalHours < 24)
                return BadRequest("Запись нельзя отменить менее чем за 24 часа до посещения.");

            _context.Appointments.Remove(appointment);
            _context.SaveChanges();

            return Ok("Запись успешно удалена.");
        }

    }
}
