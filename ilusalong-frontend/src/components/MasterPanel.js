import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MasterPanel = () => {
    const [services, setServices] = useState([]);
    const [appointments, setAppointments] = useState([]); // Для записей клиентов
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

    // Получаем masterId из токена
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const decodedToken = jwtDecode(token);
            setMasterId(decodedToken.id);
        }
    }, []);

    // Запрос данных для услуг и записей клиентов
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
                fetchAppointments(); // Загружаем записи клиентов
            } catch (error) {
                console.error("Viga andmete laadimisel:", error);
                toast.error("Viga andmete laadimisel.");
            }
        };

        if (masterId) {
            fetchData();
        }
    }, [masterId]);

    // Запрос записей клиентов
    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`http://localhost:5259/api/Appointment/master/${masterId}`);
            setAppointments(response.data);
        } catch (error) {
            console.error("Viga andmete laadimisel:", error);
            toast.error("Viga andmete laadimisel.");
        }
    };

    const handleSaveEdit = async () => {
        const isConfirmed = window.confirm("Kas olete kindel, et soovite oma teenusemuudatused salvestada?");
        if (!isConfirmed) return;

        try {
            if (
                !editedService.name ||
                !editedService.description ||
                !editedService.price ||
                !editedService.categoryId
            ) {
                toast.error("Kõik tekstiväljad tuleb täita!\n");
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
            toast.success("Teenus on edukalt värskendatud!\n");
        } catch (error) {
            console.error("Viga teenuse värskendamisel:", error.response?.data || error.message);
            toast.error("Viga teenuse värskendamisel\n.");
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
                toast.error("Valige kategooria.\n");
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
            toast.success("Teenus on edukalt lisatud!");
        } catch (error) {
            console.error("Teenuse lisamisel tekkis viga:", error);
            toast.error("Teenuse lisamisel tekkis viga.");
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
                    Logi välja
                </button>
            </div>

            <h2>Meister panel</h2>
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Секция для услуг */}
            <div className="services">
                <h3>Teie teenused</h3>
                {services.length > 0 ? (
                    <table>
                        <thead>
                        <tr>
                            <th>Pealkiri</th>
                            <th>Kirjeldus</th>
                            <th>Summa (€)</th>
                            <th>Kategooria</th>
                            <th>Tegevused</th>
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
                                        <textarea
                                            value={editedService.description}
                                            onChange={(e) =>
                                                setEditedService({
                                                    ...editedService,
                                                    description: e.target.value,
                                                })
                                            }
                                            rows="4"
                                            cols="50"
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
                                            Muuda
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Teenused puuduvad.</p>
                )}
            </div>

            {/* Секция для записей клиентов */}
            <div className="appointments">
                <h3>Записи клиентов</h3>
                {appointments.length > 0 ? (
                    <table>
                        <thead>
                        <tr>
                            <th>Клиент</th>
                            <th>Услуга</th>
                            <th>Дата</th>
                        </tr>
                        </thead>
                        <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment.id}>
                                <td>{appointment.user.email}</td>
                                <td>{appointment.service.name}</td>
                                <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Нет записей.</p>
                )}
            </div>

            {/* Форма добавления новой услуги */}
            <div className="add-service">
                <h3>Lisa teenus</h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAddService();
                    }}
                >
                    <input
                        type="text"
                        placeholder="Teenuse nimi"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Kirjeldus"
                        value={newService.description}
                        onChange={(e) =>
                            setNewService({ ...newService, description: e.target.value })
                        }
                        required
                    />
                    <input
                        type="number"
                        placeholder="Hind"
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
                        <option value="">Valige kategooria</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Lisa teenus</button>
                </form>
            </div>
        </div>
    );
};

export default MasterPanel;
