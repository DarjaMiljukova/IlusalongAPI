using Microsoft.EntityFrameworkCore;
using IlusalongAPI.Models;

namespace IlusalongAPI
{
    public class SalonContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Master> Masters { get; set; }
        public DbSet<Appointment> Appointments { get; set; }

        public SalonContext(DbContextOptions<SalonContext> options) : base(options) { }
    }
}
