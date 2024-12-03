import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [masters, setMasters] = useState([]);
    const [penalties, setPenalties] = useState([]);
    const [searchEmail, setSearchEmail] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const [selectedTab, setSelectedTab] = useState('users');
    const [newPenalty, setNewPenalty] = useState({ userId: '', reason: '', amount: '', dateIssued: '' });
    const [editingPenaltyId, setEditingPenaltyId] = useState(null);
    const [editedPenalty, setEditedPenalty] = useState({});

    useEffect(() => {
        fetchUsers();
        fetchCategories();
        fetchMasters();
        fetchPenalties();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5259/api/User');
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            console.error('Viga kasutajate laadimisel:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5259/api/Category');
            setCategories(response.data);
        } catch (error) {
            console.error('Viga kategooriate laadimisel\n:', error);
        }
    };

    const fetchMasters = async () => {
        try {
            const response = await axios.get('http://localhost:5259/api/Master');
            setMasters(response.data);
        } catch (error) {
            console.error('Viga meistrite laadimisel:', error);
        }
    };
    const fetchPenalties = async () => {
        try {
            const response = await axios.get('http://localhost:5259/api/Penalty');
            setPenalties(response.data);
        } catch (error) {
            console.error('Viga trahvide laadimisel:', error);
        }
    };
    const handleCategoryChange = async (categoryId, newName, newDescription) => {
        const isConfirmed = window.confirm('Kas olete kindel, et soovite kategooriat muuta?');
        if (!isConfirmed) return;

        try {
            const updatedCategory = { id: categoryId, name: newName, description: newDescription };
            await axios.put(`http://localhost:5259/api/Category/${categoryId}`, updatedCategory);
            fetchCategories();
        } catch (error) {
            console.error('Viga kategooria värskendamisel:', error);
        }
        setEditingCategoryId(null);
    };

    const handleUserRoleChange = async (userId, newRole) => {
        const isConfirmed = window.confirm('Kas olete kindel, et soovite kasutaja rolli muuta?');
        if (!isConfirmed) return;

        try {
            const updatedUser = { ...users.find((user) => user.id === userId), role: newRole };
            await axios.put(`http://localhost:5259/api/User/${userId}`, updatedUser);
            fetchUsers();
        } catch (error) {
            console.error('Viga kasutaja rolli värskendamisel\n:', error);
        }
        setEditingUserId(null);
    };

    const handleSearch = (email) => {
        setSearchEmail(email);
        const filtered = users.filter((user) =>
            user.email.toLowerCase().includes(email.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleAddCategory = async () => {
        try {
            const newCategory = { name: newCategoryName, description: newCategoryDescription };
            await axios.post('http://localhost:5259/api/Category/addCategory', newCategory);
            fetchCategories();
            setNewCategoryName('');
            setNewCategoryDescription('');
        } catch (error) {
            console.error('Viga kategooria lisamisel\n:', error);
        }
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        if (tab === 'masters') fetchMasters();
    };

    const handleAddPenalty = async () => {
        try {
            const userId = parseInt(newPenalty.userId, 10);
            const penaltyData = {
                id: 0,
                userId: userId,
                reason: newPenalty.reason.trim(),
                amount: parseFloat(newPenalty.amount),
                dateIssued: newPenalty.dateIssued,
                user: {
                    id: 0,
                    email: "string",
                    password: "string",
                    role: "string",
                    phoneNumber: "string",
                },
            };

            console.log("Saadeti korralikud andmed:", penaltyData);

            await axios.post(`http://localhost:5259/api/Penalty/${userId}/addFine`, penaltyData);

            fetchPenalties();

            setNewPenalty({ userId: '', reason: '', amount: '', dateIssued: '' });

            console.log("Trahv on edukalt lisatud!");
        } catch (error) {
            console.error('Viga karistuse lisamisel:', error.response?.data || error.message);
        }
    };

    const handleDeletePenalty = async (penaltyId) => {
        try {
            await axios.delete(`http://localhost:5259/api/Penalty/${penaltyId}`);
            fetchPenalties();
        } catch (error) {
            console.error('Viga trahvi kustutamisel:', error);
        }
    };

    const handleEditPenalty = (penalty) => {
        setEditingPenaltyId(penalty.id);
        setEditedPenalty({ ...penalty });
    };

    const handleUpdatePenalty = async () => {
        try {
            await axios.put(`http://localhost:5259/api/Penalty/${editingPenaltyId}`, editedPenalty);
            setEditingPenaltyId(null);
            setEditedPenalty({});
            fetchPenalties();
        } catch (error) {
            console.error('Värskendamisel tekkis viga\n:', error);
        }
    };
    const logout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="admin-panel">
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <button
                    onClick={logout}
                    style={{
                        padding: '10px',
                        backgroundColor: '#f44336',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Logi välja
                </button>
            </div>
            <h2>Administraatori paneel</h2>
            <ul className="nav nav-tabs">
                <button
                    className={`nav-link ${selectedTab === 'users' ? 'active' : ''}`}
                    onClick={() => handleTabChange('users')}
                >
                    Kasutajad
                </button>
                <button
                    className={`nav-link ${selectedTab === 'categories' ? 'active' : ''}`}
                    onClick={() => handleTabChange('categories')}
                >
                    Kategooriad
                </button>
                <button
                    className={`nav-link ${selectedTab === 'masters' ? 'active' : ''}`}
                    onClick={() => handleTabChange('masters')}
                >
                    Meistrid
                </button>
                <button
                    className={`nav-link ${selectedTab === 'penalties' ? 'active' : ''}`}
                    onClick={() => handleTabChange('penalties')}
                >
                    Trahvid
                </button>
            </ul>

            {selectedTab === 'users' && (
                <div>
                    <h3>Kasutajate loend</h3>
                    <input
                        type="text"
                        placeholder="Otsi meili teel"
                        value={searchEmail}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Telefon</th>
                            <th>Rool</th>
                            <th>Tegevused</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber}</td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                                        >
                                            <option value="client">Kasutaja</option>
                                            <option value="master">Meister</option>
                                        </select>
                                    ) : (
                                        user.role
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <button onClick={() => setEditingUserId(null)}>Salvesta</button>
                                    ) : (
                                        <button onClick={() => setEditingUserId(user.id)}>Muuda</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedTab === 'categories' && (
                <div>
                    <h3>Kategooriad</h3>
                    <div>
                        <input
                            type="text"
                            placeholder="Kategooria nimi"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Kategooria kirjeldus"
                            value={newCategoryDescription}
                            onChange={(e) => setNewCategoryDescription(e.target.value)}
                        />
                        <button onClick={handleAddCategory}>Lisa kategooria</button>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Pealkiri</th>
                            <th>Kirjeldus</th>
                            <th>Tegevused</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>
                                    {editingCategoryId === category.id ? (
                                        <input
                                            type="text"
                                            defaultValue={category.name}
                                            onChange={(e) =>
                                                setCategories((prev) =>
                                                    prev.map((cat) =>
                                                        cat.id === category.id ? { ...cat, name: e.target.value } : cat
                                                    )
                                                )
                                            }
                                        />
                                    ) : (
                                        category.name
                                    )}
                                </td>
                                <td>
                                    {editingCategoryId === category.id ? (
                                        <input
                                            type="text"
                                            defaultValue={category.description}
                                            onChange={(e) =>
                                                setCategories((prev) =>
                                                    prev.map((cat) =>
                                                        cat.id === category.id
                                                            ? { ...cat, description: e.target.value }
                                                            : cat
                                                    )
                                                )
                                            }
                                        />
                                    ) : (
                                        category.description
                                    )}
                                </td>
                                <td>
                                    {editingCategoryId === category.id ? (
                                        <button
                                            onClick={() =>
                                                handleCategoryChange(
                                                    category.id,
                                                    category.name,
                                                    category.description
                                                )
                                            }
                                        >
                                            Сохранить
                                        </button>
                                    ) : (
                                        <button onClick={() => setEditingCategoryId(category.id)}>Muuda</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedTab === 'masters' && (
                <div>
                    <h3>Meistrid</h3>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Telefon</th>
                        </tr>
                        </thead>
                        <tbody>
                        {masters.map((master) => (
                            <tr key={master.id}>
                                <td>{master.id}</td>
                                <td>{master.email}</td>
                                <td>{master.phoneNumber}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
            {selectedTab === 'penalties' && (
                <div>
                    <h3>Trahvid</h3>
                    <div>
                        <h4>Lisage trahv</h4>
                        <input
                            type="text"
                            placeholder="Kasutaja ID"
                            value={newPenalty.userId}
                            onChange={(e) => setNewPenalty({ ...newPenalty, userId: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Põhjus"
                            value={newPenalty.reason}
                            onChange={(e) => setNewPenalty({ ...newPenalty, reason: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Summa"
                            value={newPenalty.amount}
                            onChange={(e) => setNewPenalty({ ...newPenalty, amount: e.target.value })}
                        />
                        <input
                            type="datetime-local"
                            value={newPenalty.dateIssued}
                            onChange={(e) => setNewPenalty({ ...newPenalty, dateIssued: e.target.value })}
                        />
                        <button onClick={handleAddPenalty}>Lisa</button>
                    </div>

                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Kliendi (Email)</th>
                            <th>Põhjus</th>
                            <th>Summa</th>
                            <th>Rikkumise kuupäev</th>
                            <th>Tegevused</th>
                        </tr>
                        </thead>
                        <tbody>
                        {penalties.map((penalty) => (
                            <tr key={penalty.id}>
                                <td>{penalty.id}</td>
                                <td>{penalty.user?.email || 'Määratlemata'}</td>
                                <td>
                                    {editingPenaltyId === penalty.id ? (
                                        <input
                                            type="text"
                                            value={editedPenalty.reason}
                                            onChange={(e) =>
                                                setEditedPenalty({ ...editedPenalty, reason: e.target.value })
                                            }
                                        />
                                    ) : (
                                        penalty.reason
                                    )}
                                </td>
                                <td>
                                    {editingPenaltyId === penalty.id ? (
                                        <input
                                            type="number"
                                            value={editedPenalty.amount}
                                            onChange={(e) =>
                                                setEditedPenalty({ ...editedPenalty, amount: e.target.value })
                                            }
                                        />
                                    ) : (
                                        penalty.amount
                                    )}
                                </td>
                                <td>
                                    {editingPenaltyId === penalty.id ? (
                                        <input
                                            type="datetime-local"
                                            value={editedPenalty.dateIssued}
                                            onChange={(e) =>
                                                setEditedPenalty({ ...editedPenalty, dateIssued: e.target.value })
                                            }
                                        />
                                    ) : (
                                        new Date(penalty.dateIssued).toLocaleString()
                                    )}
                                </td>
                                <td>
                                    {editingPenaltyId === penalty.id ? (
                                        <button onClick={handleUpdatePenalty}>Salvesta</button>
                                    ) : (
                                        <button onClick={() => handleEditPenalty(penalty)}>Muuda</button>
                                    )}
                                    <button onClick={() => handleDeletePenalty(penalty.id)}>Kustuta</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
