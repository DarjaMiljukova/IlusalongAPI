import React, { useState } from 'react';

function ClientPage() {
    const categories = ['Hair', 'Nails', 'Massage'];
    const masters = ['Master A', 'Master B'];
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedMaster, setSelectedMaster] = useState('');
    const [date, setDate] = useState('');

    const handleBooking = () => {
        alert(
            `Booking confirmed with ${selectedMaster} for ${selectedCategory} on ${date}.`
        );
    };

    return (
        <div>
            <h1>Client Dashboard</h1>
            <h2>Book a Service</h2>
            <label>Category:</label>
            <select onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Select Category</option>
                {categories.map((cat, index) => (
                    <option key={index} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>
            <label>Master:</label>
            <select onChange={(e) => setSelectedMaster(e.target.value)}>
                <option value="">Select Master</option>
                {masters.map((master, index) => (
                    <option key={index} value={master}>
                        {master}
                    </option>
                ))}
            </select>
            <label>Date:</label>
            <input
                type="date"
                onChange={(e) => setDate(e.target.value)}
                required
            />
            <button onClick={handleBooking}>Confirm Booking</button>
        </div>
    );
}

export default ClientPage;
