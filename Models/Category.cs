namespace IlusalongAPI.Models
{
    public class Category
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required ICollection<Service> Services { get; set; }  
    }
}
