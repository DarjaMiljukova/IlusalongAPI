namespace IlusalongAPI.Models
{
    public class Service
    {
        public int Id { get; set; }  
        public required string Name { get; set; }
        public required string Description { get; set; }
        public decimal Price { get; set; }  
        public int CategoryId { get; set; }  
        public Category Category { get; set; }  
    }
}
