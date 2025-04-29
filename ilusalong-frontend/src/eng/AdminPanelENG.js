import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/admin.css';

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
    const [menuOpen, setMenuOpen] = useState(false);
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
            console.error('Error loading users:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5259/api/Category');
            setCategories(response.data);
        } catch (error) {
            console.error('Error loading categories\n:', error);
        }
    };

    const fetchMasters = async () => {
        try {
            const response = await axios.get('http://localhost:5259/api/Master');
            setMasters(response.data);
        } catch (error) {
            console.error('Error loading masters::', error);
        }
    };
    const fetchPenalties = async () => {
        try {
            const response = await axios.get('http://localhost:5259/api/Penalty');
            setPenalties(response.data);
        } catch (error) {
            console.error('Error loading fines:', error);
        }
    };
    const handleCategoryChange = async (categoryId, newName, newDescription) => {
        const isConfirmed = window.confirm('Are you sure you want to change the category?');
        if (!isConfirmed) return;

        try {
            const updatedCategory = { id: categoryId, name: newName, description: newDescription };
            await axios.put(`http://localhost:5259/api/Category/${categoryId}`, updatedCategory);
            fetchCategories();
        } catch (error) {
            console.error('Error updating category:', error);
        }
        setEditingCategoryId(null);
    };

    const handleUserRoleChange = async (userId, newRole) => {
        const isConfirmed = window.confirm('Are you sure you want to change the user role?');
        if (!isConfirmed) return;

        try {
            const updatedUser = { ...users.find((user) => user.id === userId), role: newRole };
            await axios.put(`http://localhost:5259/api/User/${userId}`, updatedUser);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user role\n:', error);
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
            console.error('Error adding category\n:', error);
        }
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        setMenuOpen(false);
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

            console.log("Proper data was sent.:", penaltyData);

            await axios.post(`http://localhost:5259/api/Penalty/${userId}/addFine`, penaltyData);

            fetchPenalties();

            setNewPenalty({ userId: '', reason: '', amount: '', dateIssued: '' });

            console.log("Fine successfully added!");
        } catch (error) {
            console.error('Error when adding a penalty:', error.response?.data || error.message);
        }
    };

    const handleDeletePenalty = async (penaltyId) => {
        try {
            await axios.delete(`http://localhost:5259/api/Penalty/${penaltyId}`);

            setPenalties(prevPenalties => prevPenalties.filter(penalty => penalty.id !== penaltyId));

            console.log('The fine has been successfully removed');
        } catch (error) {
            console.error('Error while deleting a fine:', error);
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
            console.error('An error occurred while updating\n:', error);
        }
    };
    const logout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="admin-panel">
            {/* Кнопка выхода */}
            <div style={{ position: "absolute", top: "80px", right: "15px" }}>
                <button onClick={logout}>Logi välja</button>
            </div>

            {/* Бургер-меню */}
            <button
                className={`burger-menu ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>

            {/* Меню */}
            <ul className={`nav-tabs ${menuOpen ? "open" : ""}`}>
                <li>
                    <button
                        className={`nav-link ${selectedTab === "users" ? "active" : ""}`}
                        onClick={() => handleTabChange("users")}
                    >
                        Users
                    </button>
                </li>
                <li>
                    <button
                        className={`nav-link ${selectedTab === "categories" ? "active" : ""}`}
                        onClick={() => handleTabChange("categories")}
                    >
                        Categories
                    </button>
                </li>
                <li>
                    <button
                        className={`nav-link ${selectedTab === "masters" ? "active" : ""}`}
                        onClick={() => handleTabChange("masters")}
                    >
                        Masters
                    </button>
                </li>
                <li>
                    <button
                        className={`nav-link ${selectedTab === "penalties" ? "active" : ""}`}
                        onClick={() => handleTabChange("penalties")}
                    >
                        Fines
                    </button>
                </li>
            </ul>

            {selectedTab === 'users' && (
                <div>
                    <h3>User list</h3>
                    <input
                        type="text"
                        placeholder="Search by email"
                        value={searchEmail}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Phone number</th>
                            <th>Role</th>
                            <th>Activities</th>
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
                                            <option value="client">User</option>
                                            <option value="master">Master</option>
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
                    <h3>Categories</h3>
                    <div>
                        <input
                            type="text"
                            placeholder="Category name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Category description"
                            value={newCategoryDescription}
                            onChange={(e) => setNewCategoryDescription(e.target.value)}
                        />
                        <button onClick={handleAddCategory}>Add category</button>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Activities</th>
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
                                            Save
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
                    <h3>Masters</h3>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Phone number</th>
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
                    <h3>Fines</h3>
                    <div>
                        <h4>Add a fine</h4>
                        <input
                            type="text"
                            placeholder="User ID"
                            value={newPenalty.userId}
                            onChange={(e) => setNewPenalty({ ...newPenalty, userId: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Reason"
                            value={newPenalty.reason}
                            onChange={(e) => setNewPenalty({ ...newPenalty, reason: e.target.value })}
                        />
                            <input
                                type="number"
                                placeholder="Amount"
                                value={newPenalty.amount}
                                onChange={(e) => setNewPenalty({ ...newPenalty, amount: e.target.value })}
                                style={{ width: '80%' }}
                            />
                        <input
                            type="datetime-local"
                            value={newPenalty.dateIssued}
                            onChange={(e) => setNewPenalty({ ...newPenalty, dateIssued: e.target.value })}
                        />
                        <button onClick={handleAddPenalty}>Add</button>
                    </div>

                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>User (Email)</th>
                            <th>Reason</th>
                            <th>Amount (€)</th>
                            <th>Date of violation</th>
                            <th>Activities</th>
                        </tr>
                        </thead>
                        <tbody>
                        {penalties.map((penalty) => (
                            <tr key={penalty.id}>
                                <td>{penalty.id}</td>
                                <td>{penalty.user?.email || 'Undefined'}</td>
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
                                        <button onClick={handleUpdatePenalty}>SAve</button>
                                    ) : (
                                        <button onClick={() => handleEditPenalty(penalty)}>Change</button>
                                    )}
                                    <button onClick={() => handleDeletePenalty(penalty.id)}>Delete</button>
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
