using Microsoft.AspNetCore.Mvc;

namespace IlusalongAPI.Controllers
{
    public class BaseController : ControllerBase
    {
        protected readonly SalonContext _context;

        public BaseController(SalonContext context)
        {
            _context = context;
        }

        protected bool IsAdmin(int userId)
        {
            var user = _context.Users.Find(userId);
            return user != null && user.Role == "admin";
        }

        protected bool IsMaster(int userId)
        {
            var user = _context.Users.Find(userId);
            return user != null && user.Role == "master";
        }
    }
}
