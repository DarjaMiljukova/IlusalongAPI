﻿namespace IlusalongAPI.Models
{
    public class Master
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public int ServiceId { get; set; }
        public required Service Service { get; set; }
    }
}
