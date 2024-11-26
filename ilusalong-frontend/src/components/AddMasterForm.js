import React, { useState } from 'react';

function AddMasterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddMaster = async (e) => {
        e.preventDefault();
        setLoading(true);

        const newMaster = {
            email,
            password,
            name,
            role: 'master' // Роль мастера задается явно
        };

        try {
            const response = await fetch('http://localhost:5259/api/User/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMaster),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Failed to add master');
            }

            alert(`Master "${name}" created successfully!`);
            setEmail('');
            setPassword('');
            setName('');
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Add Master</h2>
            <form onSubmit={handleAddMaster}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label>Master Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Master'}
                </button>
            </form>
        </div>
    );
}

export default AddMasterForm;
