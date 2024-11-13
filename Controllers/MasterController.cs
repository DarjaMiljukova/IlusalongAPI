using IlusalongAPI.Data;
using IlusalongAPI.Models;
using Microsoft.AspNetCore.Http;
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

        [HttpGet("byservice/{serviceId}")]
        public IActionResult GetMastersByService(int serviceId)
        {
            return Ok(_context.Masters.Where(m => m.ServiceId == serviceId).ToList());
        }
    }
}
