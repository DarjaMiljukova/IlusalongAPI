import React, { useState } from 'react';

function AddMasterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleAddMaster = (e) => {
        e.preventDefault();
        alert(`Master ${name} added successfully!`);
        setName('');
    };

    return (
        <form onSubmit={handleAddMaster}>
            <label>Master Name:</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <br></br>
            <br></br>
            <label>Master Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button type="submit">Add Master</button>
        </form>
    );
}

export default AddMasterForm;
