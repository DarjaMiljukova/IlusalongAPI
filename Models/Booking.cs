namespace IlusalongAPI.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int ServiceId { get; set; }
        public Service Service { get; set; }
        public int MasterId { get; set; }
        public Master Master { get; set; }
        public DateTime Date { get; set; }
    }
}
