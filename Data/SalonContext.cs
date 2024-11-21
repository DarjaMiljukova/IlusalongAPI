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
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Отключение каскадного удаления для связи Appointments -> Services
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Service)
                .WithMany()
                .HasForeignKey(a => a.ServiceId)
                .OnDelete(DeleteBehavior.NoAction);

            base.OnModelCreating(modelBuilder);
        }

    }
}