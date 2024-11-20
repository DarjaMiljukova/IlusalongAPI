namespace IlusalongAPI.Models
{
    public class Service
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int CategoryId { get; set; }  // Только ID категории
        public Category Category { get; set; }  // Связь с категорией, но объект категории не обязателен для записи
    }


}
