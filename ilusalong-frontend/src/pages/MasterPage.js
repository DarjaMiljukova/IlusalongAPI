import React, { useState } from 'react';

function MasterPage() {
    const [services, setServices] = useState([]);
    const [appointments, setAppointments] = useState([
        { client: 'John Doe', time: '10:00 AM', service: 'Haircut' },
    ]);

    const addService = (service) => {
        setServices([...services, service]);
        alert(`Service "${service}" added successfully!`);
    };

    return (
        <div>
            <h1>Master Dashboard</h1>
            <h2>Add Services</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const service = e.target.service.value;
                    addService(service);
                }}
            >
                <label>Service Name:</label>
                <input type="text" name="service" required />
                <button type="submit">Add Service</button>
            </form>
            <h2>Your Appointments</h2>
            <ul>
                {appointments.map((appt, index) => (
                    <li key={index}>
                        {appt.time} - {appt.client} ({appt.service})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MasterPage;
