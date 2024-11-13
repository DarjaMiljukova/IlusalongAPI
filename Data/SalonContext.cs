using IlusalongAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace IlusalongAPI.Data
{
    public class SalonContext : DbContext
    {
        public SalonContext(DbContextOptions<SalonContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Master> Masters { get; set; }
        public DbSet<Booking> Bookings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Настройка связи User -> Booking
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany()
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Отключение каскадного удаления

            // Настройка связи Service -> Booking
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Service)
                .WithMany()
                .HasForeignKey(b => b.ServiceId)
                .OnDelete(DeleteBehavior.Restrict); // Отключение каскадного удаления

            // Настройка связи Master -> Booking
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Master)
                .WithMany()
                .HasForeignKey(b => b.MasterId)
                .OnDelete(DeleteBehavior.Restrict); // Отключение каскадного удаления
        }
    }
}