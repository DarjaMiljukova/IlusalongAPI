import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientPanel = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5259/api/Category');
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories');
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5259/api/Service?categoryId=${selectedCategory}`
                );
                setServices(response.data);
            } catch (error) {
                console.error('Failed to fetch services');
            }
        };

        if (selectedCategory) fetchServices();
    }, [selectedCategory]);

    const handleAppointment = async () => {
        try {
            await axios.post('http://localhost:5259/api/Appointment', {
                serviceId: selectedService,
            });
            alert('Appointment booked successfully');
        } catch (error) {
            console.error('Failed to book appointment');
        }
    };

    return (
        <div>
            <h2>Client Panel</h2>
            <div>
                <h3>Select Category</h3>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <h3>Select Service</h3>
                <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                >
                    <option value="">Select Service</option>
                    {services.map((service) => (
                        <option key={service.id} value={service.id}>
                            {service.name}
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={handleAppointment}>Book Appointment</button>
        </div>
    );
};

export default ClientPanel;
