using Microsoft.EntityFrameworkCore;
using IlusalongAPI.Models;
using IlusalongAPI.Controllers;

namespace IlusalongAPI
{
    public class SalonContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Master> Masters { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Penalty> Penalties { get; set; }

        public SalonContext(DbContextOptions<SalonContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.User)
                .WithMany(u => u.Appointments)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Service)
                .WithMany()
                .HasForeignKey(a => a.ServiceId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<Service>() 
                .HasOne(s => s.Master)
                .WithMany()
                .HasForeignKey(s => s.MasterId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<Service>()
                .HasOne(s => s.Category)
                .WithMany()
                .HasForeignKey(s => s.CategoryId)
                .OnDelete(DeleteBehavior.Cascade); 
        }

    }
}