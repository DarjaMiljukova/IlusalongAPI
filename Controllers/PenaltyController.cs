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

        [HttpGet]
        public IActionResult GetAllPenalties()
        {
            var penalties = _context.Penalties
                .Include(p => p.User) 
                .ToList();

            if (!penalties.Any())
                return NotFound("Штрафы не найдены.");

            return Ok(penalties);
        }

        [HttpPost("{userId}/addFine")]
        public IActionResult AddFine(int userId, [FromBody] Penalty penalty)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
                return NotFound("Пользователь не найден.");

            penalty.UserId = userId;

            if (penalty.DateIssued == default(DateTime))
            {
                return BadRequest(new { message = "Дата штрафа обязательна." });
            }

            penalty.User = null; 

            _context.Penalties.Add(penalty);
            _context.SaveChanges();

            return Ok(new { message = "Штраф успешно добавлен.", penalty });
        }

        [HttpPut("{id}")]
        public IActionResult UpdatePenalty(int id, [FromBody] Penalty updatedPenalty)
        {
            var penalty = _context.Penalties.FirstOrDefault(p => p.Id == id);
            if (penalty == null)
                return NotFound("Штраф не найден.");

            penalty.Reason = updatedPenalty.Reason ?? penalty.Reason;
            penalty.Amount = updatedPenalty.Amount != 0 ? updatedPenalty.Amount : penalty.Amount;
            penalty.DateIssued = updatedPenalty.DateIssued != default(DateTime) ? updatedPenalty.DateIssued : penalty.DateIssued;

            _context.Penalties.Update(penalty);
            _context.SaveChanges();

            return Ok(new { message = "Штраф успешно обновлён.", penalty });
        }

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
