using IlusalongAPI.Data;
using IlusalongAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IlusalongAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceController : ControllerBase
    {
        private readonly SalonContext _context;

        public ServiceController(SalonContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetServices()
        {
            return Ok(_context.Services.ToList());
        }
    }
}