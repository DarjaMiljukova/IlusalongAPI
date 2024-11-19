using IlusalongAPI.Data;
using IlusalongAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace IlusalongAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MasterController : ControllerBase
    {
        private readonly SalonContext _context;

        public MasterController(SalonContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllMasters()
        {
            var masters = _context.Masters.ToList();
            return Ok(masters);
        }

        [HttpPost]
        public IActionResult AddMaster([FromBody] Master master)
        {


                _context.Masters.Add(master);
                _context.SaveChanges();
                return Ok("Мастер добавлен.");     

        }

        [HttpDelete("deleteMaster/{id}")]
        public IActionResult DeleteMaster(int id)
        {


            {
                var master = _context.Masters.Find(id);
                if (master == null)
                    return NotFound("Мастер не найден.");

                _context.Masters.Remove(master);
                _context.SaveChanges();
                return Ok("Мастер удален.");
            }

        }
    }
}
