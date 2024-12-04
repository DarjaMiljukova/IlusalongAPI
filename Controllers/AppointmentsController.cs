using IlusalongAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
                .Where(a => a.Service.MasterId == masterId)  
                .Include(a => a.User)
                .Include(a => a.Service)  
                .ThenInclude(s => s.Category)  
                .ToList();

            if (!appointments.Any())
                return NotFound("Записей не найдено.");

            return Ok(appointments);
        }
        [HttpGet("user/{userId}")]
        public IActionResult GetAppointmentsByUser(int userId)
        {
            var appointments = _context.Appointments
                .Where(a => a.UserId == userId)  
                .Include(a => a.User)
                .Include(a => a.Service)  
                .ThenInclude(s => s.Category)  
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
            SendEmail(userEmail, "Broneeringud Celestial Touch'is", $"<p>Tere! <b>{userEmail}</b></p><p>Olete edukalt broneerinud teenuse: <b>{serviceName}</b> kuupäeval: <b>{appointmentDate}</b>.</p>" +
                $"<p>Ootame teid huviga!</p><p>Ilusalon Celestial Touch</p><p>Administreerimine: +37258516751");


        }

       [HttpPost("sendEmail/{clientId}")]
        public async Task<IActionResult> SendEmail(int clientId, [FromBody] SendEmailRequest request)
        {
            var client = await _context.Users.FirstOrDefaultAsync(u => u.Id == clientId);  
            if (client == null)
            {
                return BadRequest("Клиент с указанным ID не найден.");
            }

            string email = client.Email;

            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email клиента не найден.");
            }

            bool isEmailSent = SendEmail(email, "Сообщение от Ilusalong", request.Message);

            if (!isEmailSent)
            {
                return StatusCode(500, "Ошибка при отправке email.");
            }

            return Ok("Email успешно отправлен.");
        }

        private static bool SendEmail(string email, string subject, string body)
        {
            try
            {
                using (var smtpClient = new SmtpClient("smtp.mailersend.net"))
                {
                    smtpClient.Port = 587;
                    smtpClient.Credentials = new NetworkCredential("MS_TyVFhe@trial-x2p0347d5p74zdrn.mlsender.net", "ivMXsuGSwInH3NJV");
                    smtpClient.EnableSsl = true;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("MS_TyVFhe@trial-x2p0347d5p74zdrn.mlsender.net", "Celestial Touch"),
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = true
                    };
                    mailMessage.To.Add(email);
                    smtpClient.Send(mailMessage);
                }
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка при отправке email: {ex.Message}");
                return false;
            }
        }
    

        public class SendEmailRequest
        {
            public int ClientId { get; set; }
            public string Message { get; set; }
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

            _context.Appointments.Remove(appointment);
            _context.SaveChanges();

            return Ok("Запись успешно удалена.");
        }

    }
}
