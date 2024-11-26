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
            base.OnModelCreating(modelBuilder);

            // Связь Appointment -> User (клиент)
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.User)
                .WithMany(u => u.Appointments)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Убираем каскадное удаление

            // Связь Appointment -> Service
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Service)
                .WithMany()
                .HasForeignKey(a => a.ServiceId)
                .OnDelete(DeleteBehavior.Restrict); // Убираем каскадное удаление

            // Связь Appointment -> Master
            modelBuilder.Entity<Service>() // Мастер из таблицы Users через Service
                .HasOne(s => s.Master)
                .WithMany()
                .HasForeignKey(s => s.MasterId)
                .OnDelete(DeleteBehavior.Restrict); // Убираем каскадное удаление

            // Связь Service -> Category
            modelBuilder.Entity<Service>()
                .HasOne(s => s.Category)
                .WithMany()
                .HasForeignKey(s => s.CategoryId)
                .OnDelete(DeleteBehavior.Cascade); // Каскадное удаление для категории
        }

    }
}