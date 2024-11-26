using IlusalongAPI.Models;

public class Appointment
{
    public int Id { get; set; }
    public DateTime AppointmentDate { get; set; } // Дата записи
    public string Status { get; set; } // Статус записи

    public int UserId { get; set; } // ID клиента
    public User User { get; set; } // Связь с клиентом

    public int ServiceId { get; set; } // ID услуги
    public Service Service { get; set; } // Связь с услугой
}
