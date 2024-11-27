using IlusalongAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IlusalongAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PenaltyController : ControllerBase
    {
        private readonly SalonContext _context;

        public PenaltyController(SalonContext context)
        {
            _context = context;
        }

        // Получение всех штрафов
        [HttpGet]
        public IActionResult GetAllPenalties()
        {
            var penalties = _context.Penalties
                .Include(p => p.User) // Включаем связанные данные о пользователе
                .ToList();

            if (!penalties.Any())
                return NotFound("Штрафы не найдены.");

            return Ok(penalties);
        }



        // Создание нового штрафа
        [HttpPost("{userId}/addFine")]
        public IActionResult AddFine(int userId, [FromBody] Penalty penalty)
        {
            // Проверяем существование пользователя
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
                return NotFound("Пользователь не найден.");

            // Устанавливаем ID пользователя, но не создаём нового
            penalty.UserId = userId;
            penalty.DateIssued = DateTime.UtcNow; // Добавляем дату штрафа
            penalty.User = null; // Убираем связь, чтобы избежать создания нового пользователя

            _context.Penalties.Add(penalty);
            _context.SaveChanges();

            return Ok(new { message = "Штраф успешно добавлен.", penalty });
        }


        // Изменение штрафа
        [HttpPut("{id}")]
        public IActionResult UpdatePenalty(int id, [FromBody] Penalty updatedPenalty)
        {
            var penalty = _context.Penalties.FirstOrDefault(p => p.Id == id);
            if (penalty == null)
                return NotFound("Штраф не найден.");

            penalty.Reason = updatedPenalty.Reason ?? penalty.Reason;
            penalty.Amount = updatedPenalty.Amount != 0 ? updatedPenalty.Amount : penalty.Amount;

            _context.Penalties.Update(penalty);
            _context.SaveChanges();

            return Ok(new { message = "Штраф успешно обновлён.", penalty });
        }

        // Удаление штрафа
        [HttpDelete("{id}")]
        public IActionResult DeletePenalty(int id)
        {
            var penalty = _context.Penalties.FirstOrDefault(p => p.Id == id);
            if (penalty == null)
                return NotFound("Штраф не найден.");

            _context.Penalties.Remove(penalty);
            _context.SaveChanges();

            return Ok(new { message = "Штраф успешно удалён." });
        }
    }
}
