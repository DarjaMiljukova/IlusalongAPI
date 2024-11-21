using IlusalongAPI.Models;

namespace IlusalongAPI.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        public int ServiceId { get; set; }
        public Service Service { get; set; }

        public int MasterId { get; set; }
        public Master Master { get; set; }

        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; } // Например: "scheduled", "canceled"
    }
}

