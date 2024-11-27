import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [clients, setClients] = useState([]);
    const [masters, setMasters] = useState([]);
    const [categories, setCategories] = useState([]);
    const [penalties, setPenalties] = useState([]);
    const [message, setMessage] = useState('');

    // Fetch data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all data from backend using Axios
                const [clientsRes, mastersRes, categoriesRes, penaltiesRes] = await Promise.all([
                    axios.get('http://localhost:5259/api/User'),  // Correct API endpoint
                    axios.get('http://localhost:5259/api/Master'),
                    axios.get('http://localhost:5259/api/Category'),
                    axios.get('http://localhost:5259/api/Penalty')
                ]);
                // Set the fetched data into the state
                setClients(clientsRes.data);
                setMasters(mastersRes.data);
                setCategories(categoriesRes.data);
                setPenalties(penaltiesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setMessage('Failed to load data. Please check the backend.');
            }
        };

        fetchData();
    }, []);  // Empty dependency array to run once on component mount

    // Render the admin panel
    return (
        <div className="admin-panel">
            <h1>Admin Panel</h1>

            {/* Categories Button */}
            <button onClick={() => setMessage('Categories data will be shown here')}>
                Categories
            </button>

            {/* Masters Button */}
            <button onClick={() => setMessage('Masters data will be shown here')}>
                Masters
            </button>

            {/* Penalties Button */}
            <button onClick={() => setMessage('Penalties data will be shown here')}>
                Penalties
            </button>

            {/* Clients Button */}
            <button onClick={() => setMessage('Clients data will be shown here')}>
                Clients
            </button>

            {/* Show Clients Table */}
            {message === 'Clients data will be shown here' && (
                <div>
                    <h2>Clients Data</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                        </tr>
                        </thead>
                        <tbody>
                        {clients.length > 0 ? (
                            clients.map(client => (
                                <tr key={client.id}>
                                    <td>{client.id}</td>
                                    <td>{client.email}</td>
                                    <td>{client.phoneNumber}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No data available</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Display Masters Table */}
            {message === 'Masters data will be shown here' && (
                <div>
                    <h2>Masters Data</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Specialty</th>
                        </tr>
                        </thead>
                        <tbody>
                        {masters.length > 0 ? (
                            masters.map(master => (
                                <tr key={master.id}>
                                    <td>{master.id}</td>
                                    <td>{master.name}</td>
                                    <td>{master.specialty}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No data available</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Display Penalties Table */}
            {message === 'Penalties data will be shown here' && (
                <div>
                    <h2>Penalties Data</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Amount</th>
                            <th>Reason</th>
                        </tr>
                        </thead>
                        <tbody>
                        {penalties.length > 0 ? (
                            penalties.map(penalty => (
                                <tr key={penalty.id}>
                                    <td>{penalty.id}</td>
                                    <td>{penalty.amount}</td>
                                    <td>{penalty.reason}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No data available</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Display Categories Table */}
            {message === 'Categories data will be shown here' && (
                <div>
                    <h2>Categories Data</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.length > 0 ? (
                            categories.map(category => (
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">No data available</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {message && <p>{message}</p>}
        </div>
    );
};

export default AdminPanel;
