namespace IlusalongAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? Role { get; set; } = "Client";
        public string? PhoneNumber { get; set; }
        public ICollection<Appointment> Appointments;
    }
}
