﻿using IlusalongAPI.Models;

public class Appointment
{
    public int Id { get; set; }
    public DateTime AppointmentDate { get; set; } 
    public string Status { get; set; } 

    public int UserId { get; set; }
    public User User { get; set; }

    public int ServiceId { get; set; } 
    public Service Service { get; set; }
}
