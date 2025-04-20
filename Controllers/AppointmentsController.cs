using IlusalongAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;

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
                return Ok(new List<Appointment>());

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

            var service = _context.Services
                .Include(s => s.Master)
                .FirstOrDefault(s => s.Id == appointment.ServiceId);
            if (service == null || service.MasterId == 0)
                return BadRequest("Услуга с мастером не найдена.");

            // Проверка на занятость
            bool isSlotTaken = _context.Appointments
                .Include(a => a.Service)
                .Any(a =>
                    a.Service.MasterId == service.MasterId &&
                    a.AppointmentDate == appointment.AppointmentDate);

            if (isSlotTaken)
                return BadRequest("Это время уже занято другим клиентом.");

            appointment.User = user;
            appointment.Service = service;
            appointment.Status = "scheduled";

            _context.Appointments.Add(appointment);
            _context.SaveChanges();

            SendBookingConfirmationEmail(user.Email, service.Name, appointment.AppointmentDate);

            return Ok("Запись успешно создана. Подтверждение отправлено на вашу почту.");
        }

        private void SendBookingConfirmationEmail(string userEmail, string serviceName, DateTime appointmentDate)
        {
            string subject = "Broneering kinnitatud - Celestial Touch";
            string body = $"<p>Tere, {userEmail}!</p>" +
                          $"<p>Teie broneering teenusele <b>{serviceName}</b> on edukalt kinnitatud.</p>" +
                          $"<p>Kuupäev: <b>{appointmentDate}</b></p>" +
                          $"<p>Kohtume peagi!</p><p>Celestial Touch</p>";

            SendEmail(userEmail, subject, body);
        }

        private static bool SendEmail(string recipientEmail, string subject, string htmlContent)
        {
            string mailerSendApiToken = "mlsn.5db77166a85af16a563ff77c363c04c0ec173c89d76cf59f13b6d0fa5e5c4fa3"; // ВСТАВЬ СЮДА СВОЙ API-токен
            string fromEmail = "test-xkjn41mm5o64z781.mlsender.net"; // ТВОЙ подтверждённый email

            var emailData = new
            {
                from = new
                {
                    email = fromEmail,
                    name = "Celestial Touch"
                },
                to = new[]
                {
                    new { email = recipientEmail }
                },
                subject = subject,
                html = htmlContent
            };

            var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", mailerSendApiToken);

            var content = new StringContent(JsonSerializer.Serialize(emailData), System.Text.Encoding.UTF8, "application/json");

            var response = httpClient.PostAsync("https://api.mailersend.com/v1/email", content).Result;

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Ошибка при отправке email: {response.StatusCode} {response.Content.ReadAsStringAsync().Result}");
                return false;
            }

            return true;
        }

        public class SendEmailRequest
        {
            public int ClientId { get; set; }
            public string Message { get; set; }
        }

        [HttpPost("sendEmail/{clientId}")]
        public async Task<IActionResult> SendEmail(int clientId, [FromBody] SendEmailRequest request)
        {
            var client = await _context.Users.FirstOrDefaultAsync(u => u.Id == clientId);
            if (client == null)
                return BadRequest("Клиент с указанным ID не найден.");

            string email = client.Email;
            if (string.IsNullOrEmpty(email))
                return BadRequest("Email клиента не найден.");

            bool isEmailSent = SendEmail(email, "Сообщение от Ilusalong", request.Message);

            if (!isEmailSent)
                return StatusCode(500, "Ошибка при отправке email.");

            return Ok("Email успешно отправлен.");
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
