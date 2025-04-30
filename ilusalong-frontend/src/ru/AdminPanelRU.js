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
            console.error('Ошибка загрузки пользователей:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5259/api/Category');
            setCategories(response.data);
        } catch (error) {
            console.error('Ошибка загрузки категорий\n:', error);
        }
    };

    const fetchMasters = async () => {
        try {
            const response = await axios.get('http://localhost:5259/api/Master');
            setMasters(response.data);
        } catch (error) {
            console.error('Ошибка загрузки мастеров:', error);
        }
    };
    const fetchPenalties = async () => {
        try {
            const response = await axios.get('http://localhost:5259/api/Penalty');
            setPenalties(response.data);
        } catch (error) {
            console.error('Ошибка загрузки штрафов:', error);
        }
    };
    const handleCategoryChange = async (categoryId, newName, newDescription) => {
        const isConfirmed = window.confirm('Вы уверены, что хотите изменить категорию?');
        if (!isConfirmed) return;

        try {
            const updatedCategory = { id: categoryId, name: newName, description: newDescription };
            await axios.put(`http://localhost:5259/api/Category/${categoryId}`, updatedCategory);
            fetchCategories();
        } catch (error) {
            console.error('Ошибка обновления категории:', error);
        }
        setEditingCategoryId(null);
    };

    const handleUserRoleChange = async (userId, newRole) => {
        const isConfirmed = window.confirm('Вы уверены, что хотите изменить роль пользователя?');
        if (!isConfirmed) return;

        try {
            const updatedUser = { ...users.find((user) => user.id === userId), role: newRole };
            await axios.put(`http://localhost:5259/api/User/${userId}`, updatedUser);
            fetchUsers();
        } catch (error) {
            console.error('Ошибка обновления роли пользователя\n:', error);
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
            console.error('Ошибка добавления категории\n:', error);
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

            console.log("Были отправлены правильные данные.:", penaltyData);

            await axios.post(`http://localhost:5259/api/Penalty/${userId}/addFine`, penaltyData);

            fetchPenalties();

            setNewPenalty({ userId: '', reason: '', amount: '', dateIssued: '' });

            console.log("Штраф успешно добавлен!");
        } catch (error) {
            console.error('Ошибка добавления штрафа:', error.response?.data || error.message);
        }
    };

    const handleDeletePenalty = async (penaltyId) => {
        try {
            await axios.delete(`http://localhost:5259/api/Penalty/${penaltyId}`);

            setPenalties(prevPenalties => prevPenalties.filter(penalty => penalty.id !== penaltyId));

            console.log('Штраф успешно снят.');
        } catch (error) {
            console.error('Ошибка при удалении штрафа:', error);
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
            console.error('Произошла ошибка при обновлении.\n:', error);
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
                <button onClick={logout}>Выход</button>
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
                        Пользователи
                    </button>
                </li>
                <li>
                    <button
                        className={`nav-link ${selectedTab === "categories" ? "active" : ""}`}
                        onClick={() => handleTabChange("categories")}
                    >
                        Категории
                    </button>
                </li>
                <li>
                    <button
                        className={`nav-link ${selectedTab === "masters" ? "active" : ""}`}
                        onClick={() => handleTabChange("masters")}
                    >
                        Мастеры
                    </button>
                </li>
                <li>
                    <button
                        className={`nav-link ${selectedTab === "penalties" ? "active" : ""}`}
                        onClick={() => handleTabChange("penalties")}
                    >
                        Штрафы
                    </button>
                </li>
            </ul>

            {selectedTab === 'users' && (
                <div>
                    <h3>Список пользователей</h3>
                    <input
                        type="text"
                        placeholder="Поиск по электронной почте"
                        value={searchEmail}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Почта</th>
                            <th>Номер телефона</th>
                            <th>Роль</th>
                            <th>Услуги</th>
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
                                            <option value="client">Пользователь</option>
                                            <option value="master">Мастер</option>
                                        </select>
                                    ) : (
                                        user.role
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <button onClick={() => setEditingUserId(null)}>Сохранить</button>
                                    ) : (
                                        <button onClick={() => setEditingUserId(user.id)}>Изменить</button>
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
                    <h3>Категории</h3>
                    <div>
                        <input
                            type="text"
                            placeholder="Название категории"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Описание категории"
                            value={newCategoryDescription}
                            onChange={(e) => setNewCategoryDescription(e.target.value)}
                        />
                        <button onClick={handleAddCategory}>Добавить категорию</button>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Заголовок</th>
                            <th>Описание</th>
                            <th>Услуги</th>
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
                                        <button onClick={() => setEditingCategoryId(category.id)}>Изменить</button>
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
                    <h3>Мастера</h3>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Почта</th>
                            <th>Номер телефона</th>
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
                    <h3>Штрафы</h3>
                    <div>
                        <h4>Добавление штрафа</h4>
                        <input
                            type="text"
                            placeholder="ID Пользователя"
                            value={newPenalty.userId}
                            onChange={(e) => setNewPenalty({ ...newPenalty, userId: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Причина"
                            value={newPenalty.reason}
                            onChange={(e) => setNewPenalty({ ...newPenalty, reason: e.target.value })}
                        />
                            <input
                                type="number"
                                placeholder="Сумма"
                                value={newPenalty.amount}
                                onChange={(e) => setNewPenalty({ ...newPenalty, amount: e.target.value })}
                                style={{ width: '80%' }}
                            />
                        <input
                            type="datetime-local"
                            value={newPenalty.dateIssued}
                            onChange={(e) => setNewPenalty({ ...newPenalty, dateIssued: e.target.value })}
                        />
                        <button onClick={handleAddPenalty}>Добавить</button>
                    </div>

                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Клиент (Почта)</th>
                            <th>Причина</th>
                            <th>Сумма (€)</th>
                            <th>Дата нарушения</th>
                            <th>Услуги</th>
                        </tr>
                        </thead>
                        <tbody>
                        {penalties.map((penalty) => (
                            <tr key={penalty.id}>
                                <td>{penalty.id}</td>
                                <td>{penalty.user?.email || 'Неопределенный'}</td>
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
                                        <button onClick={handleUpdatePenalty}>Сохранить</button>
                                    ) : (
                                        <button onClick={() => handleEditPenalty(penalty)}>Изменить</button>
                                    )}
                                    <button onClick={() => handleDeletePenalty(penalty.id)}>Удалить</button>
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
