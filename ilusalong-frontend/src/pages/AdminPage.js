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
    const [newMasterName, setNewMasterName] = useState('');
    const [newMasterServiceId, setNewMasterServiceId] = useState('');
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
    const handleAddMaster = async (e) => {
        e.preventDefault();

        if (!newMasterName || isNaN(newMasterServiceId) || newMasterServiceId <= 0) {
            alert('Please provide a valid master name and service ID.');
            return;
        }

        const newMaster = {
            name: newMasterName.trim(),
            serviceId: parseInt(newMasterServiceId),
        };

        try {
            const response = await fetch('http://localhost:5259/api/Master', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMaster),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to add master');
            }

            const result = await response.json();
            setMasters((prevMasters) => [...prevMasters, result.master]);
            alert(result.message);
            setNewMasterName('');
            setNewMasterServiceId('');
        } catch (error) {
            console.error('Error adding master:', error);
            alert(`Failed to add master: ${error.message}`);
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

        if (!newCategoryName || !newCategoryDescription) {
            alert('Both name and description are required!');
            return;
        }

        const newCategory = {
            name: newCategoryName,
            description: newCategoryDescription,
        };

        const response = await fetch('http://localhost:5259/api/Category/addCategory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCategory),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const createdCategory = await response.json();
        console.log('Server Response:', createdCategory);
        setCategories((prevCategories) => [...prevCategories, createdCategory.category]);
        alert(createdCategory.message);
        setNewCategoryName('');
        setNewCategoryDescription('');
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
            case 'addMaster':
                return (
                    <div>
                        <h2>Add Master</h2>
                        <form onSubmit={handleAddMaster}>
                            <label>Master Name:</label>
                            <input
                                type="text"
                                value={newMasterName}
                                onChange={(e) => setNewMasterName(e.target.value)}
                                required
                            />
                            <label>Service ID:</label>
                            <input
                                type="number"
                                value={newMasterServiceId}
                                onChange={(e) => setNewMasterServiceId(e.target.value)}
                                required
                            />
                            <button type="submit">Add Master</button>
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
                <button
                    className={activeMenu === 'addMaster' ? 'active' : ''}
                    onClick={() => setActiveMenu('addMaster')}
                >
                    Add Master
                </button>

            </nav>

            <div className="content">{renderContent()}</div>
        </div>
    );
}

export default AdminPage;
