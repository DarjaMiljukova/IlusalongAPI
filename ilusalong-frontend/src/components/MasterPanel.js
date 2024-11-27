import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MasterPanel = () => {
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({
        name: '',
        categoryId: '',
    });

    useEffect(() => {
        // Загрузка услуг мастера
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://localhost:5259/api/Service');
                setServices(response.data);
            } catch (error) {
                console.error('Failed to fetch services');
            }
        };

        fetchServices();
    }, []);

    const handleAddService = async () => {
        try {
            await axios.post('http://localhost:5259/api/Service', newService);
            setServices([...services, newService]);
        } catch (error) {
            console.error('Failed to add service');
        }
    };

    return (
        <div>
            <h2>Master Panel</h2>
            <div>
                <h3>My Services</h3>
                <ul>
                    {services.map((service) => (
                        <li key={service.id}>{service.name}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h3>Add New Service</h3>
                <input
                    type="text"
                    placeholder="Service Name"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                />
                <select
                    value={newService.categoryId}
                    onChange={(e) => setNewService({ ...newService, categoryId: e.target.value })}
                >
                    <option value="">Select Category</option>
                    {/* Populate categories here */}
                </select>
                <button onClick={handleAddService}>Add Service</button>
            </div>
        </div>
    );
};

export default MasterPanel;
