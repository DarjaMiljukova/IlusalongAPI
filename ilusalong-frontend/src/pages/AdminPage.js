import React, { useState, useEffect } from 'react';

function AdminPage() {
    const [activeMenu, setActiveMenu] = useState('information');
    const [activeTable, setActiveTable] = useState('clients');
    const [clients, setClients] = useState([]);
    const [masters, setMasters] = useState([]);
    const [categories, setCategories] = useState([]);
    const [penaltyReason, setPenaltyReason] = useState('');
    const [penaltyAmount, setPenaltyAmount] = useState('');
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const usersResponse = await fetch('http://localhost:5259/api/User');
                const usersData = await usersResponse.json();
                setClients(usersData.filter((user) => user.role === 'client'));
                setMasters(usersData.filter((user) => user.role === 'master'));

                const categoriesResponse = await fetch('http://localhost:5259/api/Category');
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Редактирование клиента
    const handleUpdateClient = async (id, updatedData) => {
        try {
            const response = await fetch(`http://localhost:5259/api/User/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error('Failed to update client');
            }

            alert('Client updated successfully!');
            setClients((prevClients) =>
                prevClients.map((client) =>
                    client.id === id ? { ...client, ...updatedData } : client
                )
            );
        } catch (error) {
            console.error('Error updating client:', error);
            alert('Failed to update client');
        }
    };

    // Выписывание штрафов
    const handleIssuePenalty = async (e) => {
        e.preventDefault();
        if (!selectedClientId) {
            alert('Please select a client to issue a penalty');
            return;
        }

        const penaltyData = {
            clientId: selectedClientId,
            reason: penaltyReason,
            amount: penaltyAmount,
        };

        try {
            const response = await fetch('http://localhost:5259/api/Penalty', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(penaltyData),
            });

            if (!response.ok) {
                throw new Error('Failed to issue penalty');
            }

            alert('Penalty issued successfully!');
            setPenaltyReason('');
            setPenaltyAmount('');
        } catch (error) {
            console.error('Error issuing penalty:', error);
            alert('Failed to issue penalty');
        }
    };

    // Добавление новой категории
    const handleAddCategory = async (e) => {
        e.preventDefault();
        const newCategory = {
            name: newCategoryName,
            description: newCategoryDescription,
        };

        try {
            const response = await fetch('http://localhost:5259/api/Category', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory),
            });

            if (!response.ok) {
                throw new Error('Failed to add category');
            }

            const createdCategory = await response.json();
            setCategories((prevCategories) => [...prevCategories, createdCategory]);
            alert('Category added successfully!');
            setNewCategoryName('');
            setNewCategoryDescription('');
        } catch (error) {
            console.error('Error adding category:', error);
            alert('Failed to add category');
        }
    };

    const renderInformationContent = () => {
        switch (activeTable) {
            case 'clients':
                return (
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td>{client.id}</td>
                                <td>
                                    <input
                                        type="text"
                                        defaultValue={client.email}
                                        onBlur={(e) =>
                                            handleUpdateClient(client.id, {
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        defaultValue={client.phoneNumber}
                                        onBlur={(e) =>
                                            handleUpdateClient(client.id, {
                                                phoneNumber: e.target.value,
                                            })
                                        }
                                    />
                                </td>
                                <td>
                                    <button
                                        onClick={() =>
                                            alert(`Client ID: ${client.id} saved successfully!`)
                                        }
                                    >
                                        Save
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>

                    </table>
                );
            case 'masters':
                return (
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                        </thead>
                        <tbody>
                        {masters.map((master) => (
                            <tr key={master.id}>
                                <td>{master.id}</td>
                                <td>{master.name}</td>
                                <td>{master.email}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                );
            case 'categories':
                return (
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>{category.description}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                );
            default:
                return null;
        }
    };

    const renderContent = () => {
        switch (activeMenu) {
            case 'information':
                return (
                    <div>
                        <h2>Information</h2>
                        <div className="sub-menu">
                            <button
                                className={activeTable === 'clients' ? 'active' : ''}
                                onClick={() => setActiveTable('clients')}
                            >
                                Clients
                            </button>
                            <button
                                className={activeTable === 'masters' ? 'active' : ''}
                                onClick={() => setActiveTable('masters')}
                            >
                                Masters
                            </button>
                            <button
                                className={activeTable === 'categories' ? 'active' : ''}
                                onClick={() => setActiveTable('categories')}
                            >
                                Categories
                            </button>
                        </div>
                        {renderInformationContent()}
                    </div>
                );
            case 'penalties':
                return (
                    <div>
                        <h2>Issue Penalties</h2>
                        <form onSubmit={handleIssuePenalty}>
                            <label>Client ID:</label>
                            <select
                                value={selectedClientId || ''}
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select a client</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.email}
                                    </option>
                                ))}
                            </select>
                            <label>Reason:</label>
                            <input
                                type="text"
                                value={penaltyReason}
                                onChange={(e) => setPenaltyReason(e.target.value)}
                                required
                            />
                            <label>Amount:</label>
                            <input
                                type="number"
                                value={penaltyAmount}
                                onChange={(e) => setPenaltyAmount(e.target.value)}
                                required
                            />
                            <button type="submit">Issue Penalty</button>
                        </form>
                    </div>
                );
            case 'addCategory':
                return (
                    <div>
                        <h2>Add Category</h2>
                        <form onSubmit={handleAddCategory}>
                            <label>Category Name:</label>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                required
                            />
                            <label>Category Description:</label>
                            <input
                                type="text"
                                value={newCategoryDescription}
                                onChange={(e) => setNewCategoryDescription(e.target.value)}
                                required
                            />
                            <button type="submit">Add Category</button>
                        </form>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
            </header>

            <nav className="menu">
                <button
                    className={activeMenu === 'information' ? 'active' : ''}
                    onClick={() => setActiveMenu('information')}
                >
                    Information
                </button>
                <button
                    className={activeMenu === 'penalties' ? 'active' : ''}
                    onClick={() => setActiveMenu('penalties')}
                >
                    Issue Penalties
                </button>
                <button
                    className={activeMenu === 'addCategory' ? 'active' : ''}
                    onClick={() => setActiveMenu('addCategory')}
                >
                    Add Category
                </button>
            </nav>

            <div className="content">{renderContent()}</div>
        </div>
    );
}

export default AdminPage;
