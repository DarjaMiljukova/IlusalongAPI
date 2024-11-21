import React, { useState, useEffect } from "react";
import axios from "axios";

const MasterPage = () => {
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [serviceName, setServiceName] = useState("");

    useEffect(() => {
        fetchCategories();
        fetchServices();
    }, []);

    const fetchCategories = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/Category`);
        setCategories(data);
    };

    const fetchServices = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/Service`);
        setServices(data);
    };

    const addService = async (categoryId) => {
        await axios.post(`${process.env.REACT_APP_API_URL}/Service`, {
            name: serviceName,
            categoryId,
        });
        alert("Service added!");
        setServiceName("");
        fetchServices();
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Master Dashboard</h1>
            <div>
                <h2>Add Service</h2>
                <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="Service Name"
                />
                {categories.map((category) => (
                    <div key={category.id}>
                        <button onClick={() => addService(category.id)}>
                            Add to {category.name}
                        </button>
                    </div>
                ))}
            </div>
            <div>
                <h2>Your Services</h2>
                <ul>
                    {services.map((service) => (
                        <li key={service.id}>{service.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MasterPage;
