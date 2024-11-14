namespace IlusalongAPI.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public required User User { get; set; }
        public int ServiceId { get; set; }
        public required Service Service { get; set; }
        public int MasterId { get; set; }
        public required Master Master { get; set; }
        public DateTime Date { get; set; }
    }
}
