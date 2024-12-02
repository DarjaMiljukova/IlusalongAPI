import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MasterPanel = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [editedService, setEditedService] = useState({});
    const [newService, setNewService] = useState({
        name: "",
        description: "",
        price: "",
        categoryId: "",
    });
    const [masterId, setMasterId] = useState(null);


    const logout = () => {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        window.location.href = "/login";
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const decodedToken = jwtDecode(token);
            setMasterId(decodedToken.id);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesResponse, servicesResponse] = await Promise.all([
                    axios.get("http://localhost:5259/api/Category"),
                    axios.get(`http://localhost:5259/api/Service/master/${masterId}`),
                ]);
                setCategories(categoriesResponse.data);
                setServices(
                    servicesResponse.data.map((service) => ({
                        ...service,
                        category: categoriesResponse.data.find(
                            (category) => category.id === service.categoryId
                        ),
                    }))
                );
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
                toast.error("Ошибка при загрузке данных.");
            }
        };

        if (masterId) {
            fetchData();
        }
    }, [masterId]);
    const fetchService = async () => {
        try {
            const response = await axios.get('http://localhost:5259/api/Service');
            setServices(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке мастеров:', error);
        }
    };

    const handleSaveEdit = async () => {
        const isConfirmed = window.confirm("Вы уверены, что хотите сохранить изменения услуги?");
        if (!isConfirmed) return;

        try {
            if (
                !editedService.name ||
                !editedService.description ||
                !editedService.price ||
                !editedService.categoryId
            ) {
                toast.error("Все поля должны быть заполнены!");
                return;
            }

            const updatedService = {
                id: editedService.id,
                name: editedService.name.trim(),
                description: editedService.description.trim(),
                price: parseFloat(editedService.price),
                masterId: masterId,
                categoryId: parseInt(editedService.categoryId, 10),
            };

            await axios.put(
                `http://localhost:5259/api/Service/${editedService.id}`,
                updatedService
            );

            setServices((prev) =>
                prev.map((service) =>
                    service.id === editedService.id ? { ...service, ...updatedService } : service
                )
            );

            setEditingServiceId(null);
            setEditedService({});
            fetchService();
            toast.success("Услуга успешно обновлена!");
        } catch (error) {
            console.error("Ошибка при обновлении услуги:", error.response?.data || error.message);
            toast.error("Ошибка при обновлении услуги.");
        }
    };

    const handleEditService = (service) => {
        setEditingServiceId(service.id);
        setEditedService(service);
    };

    const handleCancelEdit = () => {
        setEditingServiceId(null);
        setEditedService({});
    };

    const handleAddService = async () => {
        try {
            const selectedCategory = categories.find(
                (category) => category.id === parseInt(newService.categoryId, 10)
            );
            if (!selectedCategory) {
                toast.error("Выберите категорию.");
                return;
            }

            const serviceData = {
                ...newService,
                masterId,
                categoryId: selectedCategory.id,
            };

            const response = await axios.post(
                "http://localhost:5259/api/Service/createService",
                serviceData
            );

            setServices([...services, response.data.service]);
            setNewService({ name: "", description: "", price: "", categoryId: "" });
            toast.success("Услуга успешно добавлена!");
        } catch (error) {
            console.error("Ошибка при добавлении услуги:", error);
            toast.error("Ошибка при добавлении услуги.");
        }
    };

    return (
        <div className="master-panel">
            {/* Кнопка выхода */}
            <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <button
                    onClick={logout}
                    style={{
                        padding: "10px",
                        backgroundColor: "#f44336",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Выйти
                </button>
            </div>

            <h2>Панель мастера</h2>
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="services">
                <h3>Ваши услуги</h3>
                {services.length > 0 ? (
                    <table>
                        <thead>
                        <tr>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Цена (€)</th>
                            <th>Категория</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {services.map((service) => (
                            <tr key={service.id}>
                                <td>
                                    {editingServiceId === service.id ? (
                                        <input
                                            type="text"
                                            value={editedService.name}
                                            onChange={(e) =>
                                                setEditedService({
                                                    ...editedService,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        service.name
                                    )}
                                </td>
                                <td>
                                    {editingServiceId === service.id ? (
                                        <input
                                            type="text"
                                            value={editedService.description}
                                            onChange={(e) =>
                                                setEditedService({
                                                    ...editedService,
                                                    description: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        service.description
                                    )}
                                </td>
                                <td>
                                    {editingServiceId === service.id ? (
                                        <input
                                            type="number"
                                            value={editedService.price}
                                            onChange={(e) =>
                                                setEditedService({
                                                    ...editedService,
                                                    price: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        service.price
                                    )}
                                </td>
                                <td>
                                    {editingServiceId === service.id ? (
                                        <select
                                            value={editedService.categoryId}
                                            onChange={(e) =>
                                                setEditedService({
                                                    ...editedService,
                                                    categoryId: e.target.value,
                                                })
                                            }
                                        >
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        service.category?.name || "N/A"
                                    )}
                                </td>
                                <td>
                                    {editingServiceId === service.id ? (
                                        <>
                                            <button onClick={handleSaveEdit}>Сохранить</button>
                                            <button onClick={handleCancelEdit}>Отмена</button>
                                        </>
                                    ) : (
                                        <button onClick={() => handleEditService(service)}>
                                            Редактировать
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Нет доступных услуг.</p>
                )}
            </div>

            <div className="add-service">
                <h3>Добавить услугу</h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAddService();
                    }}
                >
                    <input
                        type="text"
                        placeholder="Название услуги"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Описание"
                        value={newService.description}
                        onChange={(e) =>
                            setNewService({ ...newService, description: e.target.value })
                        }
                        required
                    />
                    <input
                        type="number"
                        placeholder="Цена"
                        value={newService.price}
                        onChange={(e) =>
                            setNewService({ ...newService, price: e.target.value })
                        }
                        required
                    />
                    <select
                        value={newService.categoryId}
                        onChange={(e) =>
                            setNewService({ ...newService, categoryId: e.target.value })
                        }
                        required
                    >
                        <option value="">Выберите категорию</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Добавить услугу</button>
                </form>
            </div>
        </div>
    );
};

export default MasterPanel;
