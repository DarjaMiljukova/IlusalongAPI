namespace IlusalongAPI.Models
{
    public class User
    {
        public int Id { get; set; }
<<<<<<< Updated upstream
        public required string Email { get; set; }
        public required string Password { get; set; }
=======
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } // Например: "user", "admin"
        public string PhoneNumber { get; set; } 
>>>>>>> Stashed changes
    }
}
