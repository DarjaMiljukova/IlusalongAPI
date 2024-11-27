using IlusalongAPI.Models;

namespace IlusalongAPI.Models
{
    public class Penalty
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Reason { get; set; }
        public decimal Amount { get; set; }
        public DateTime DateIssued { get; set; }

        // Связь с пользователем
        public User User { get; set; }
    }
}
