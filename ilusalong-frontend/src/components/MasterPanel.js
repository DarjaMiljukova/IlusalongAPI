import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MasterPanel = () => {
    const [userId, setUserId] = useState(null);
    console.log("userId:", userId);
    const [services, setServices] = useState([]);
    const [appointments, setAppointments] = useState([]); // Для записей клиентов
    const [categories, setCategories] = useState([]);
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [editedService, setEditedService] = useState({});
    const [emailMessage, setEmailMessage] = useState("");
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [selectedUserEmail, setSelectedUserEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState("appointments");
    console.log("isEmailModalOpen:", isEmailModalOpen);

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
    const handleOpenModal = (email, userId) => {
        setSelectedUserEmail(email);
        setUserId(userId);
        setIsEmailModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedUserEmail("");
        setEmailMessage("");
        setIsEmailModalOpen(false);
    };

    const handleSendEmail = async () => {
        console.log("Saadetavad andmed:", {
            email: selectedUserEmail,
            message: emailMessage,
        });

        setLoading(true);
        try {
            const response = await axios.post(
                `http://localhost:5259/api/Appointment/sendEmail/${userId}`,
                {
                    email: selectedUserEmail,
                    message: emailMessage,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            toast.success("Сообщение успешно отправлено!");
            handleCloseModal();
        } catch (error) {
            console.error("Ошибка при отправке запроса:", error);

            if (error.response) {
                console.error("Vastus serverilt:", error.response);
                toast.error(`Viga: ${error.response.data.title || "Midagi on valesti läinud!"}`);
            } else {
                console.error("Viga taotluse loomisel:", error.message);
                toast.error(`Viga: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };
    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className="master-panel">
            {/* Кнопка выхода */}
            <div style={{ position: "absolute", top: "10px", right: "10px" }}>
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
                        className={`nav-link ${selectedTab === "appointments" ? "active" : ""}`}
                        onClick={() => handleTabChange("appointments")}
                    >
                        Broneeringud
                    </button>
                </li>
                <li>
                    <button
                        className={`nav-link ${selectedTab === "services" ? "active" : ""}`}
                        onClick={() => handleTabChange("services")}
                    >
                        Teenused
                    </button>
                </li>
            </ul>

            <div className="admin-panel">
                {/* Кнопка выхода */}
                <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                    <button onClick={logout}>Logi välja</button>
                </div>

                {/* Бургер-меню */}
                <button
                    className={`burger-menu ${menuOpen ? "open" : ""}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span className="bar"></span>
                    <span className="bar"></span>

                </button>

                {/* Меню */}
                <ul className={`nav-tabs ${menuOpen ? "open" : ""}`}>
                    <li>
                        <button
                            className={`nav-link ${selectedTab === "appointments" ? "active" : ""}`}
                            onClick={() => handleTabChange("appointments")}
                        >
                            Broneeringud
                        </button>
                    </li>

                    <li>
                        <button
                            className={`nav-link ${selectedTab === "services" ? "active" : ""}`}
                            onClick={() => handleTabChange("services")}
                        >
                            Teenused
                        </button>
                    </li>
                </ul>

                {/* Секция для услуг */}
                {selectedTab === "services" && (
                    <div className="services">
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
                                                    <button onClick={handleSaveEdit}>Salvesta</button>
                                                    <button onClick={handleCancelEdit}>Tühistamine</button>
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
                )}

                {/* Секция для записей клиентов */}
                {selectedTab === "appointments" && (
                    <div className="appointments">
                        <h3>Klientide broneeringud</h3>
                        {appointments.length > 0 ? (
                            <table>
                                <thead>
                                <tr>
                                    <th>Klient</th>
                                    <th>Teenus</th>
                                    <th>Kuupäev</th>
                                    <th>Tegevus</th>
                                </tr>
                                </thead>
                                <tbody>
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td>{appointment.user.email}</td>
                                        <td>{appointment.service.name}</td>
                                        <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                                        <td>
                                            <button onClick={() => handleOpenModal(appointment.user.email, appointment.user.id)}>
                                                Võtke kliendiga
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Mingeid andmeid ei ole.</p>
                        )}

                        {/* Модальное окно */}
                        {isEmailModalOpen && (
                            <div
                                style={{
                                    position: "fixed",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: "#fff",
                                        padding: "20px",
                                        borderRadius: "8px",
                                        width: "400px",
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                    }}
                                >
                                    <h3>Saatke kliendile e-kiri</h3>
                                    <p><strong>Klient:</strong> {selectedUserEmail}</p>
                                    <textarea
                                        placeholder="Sisestage sõnum"
                                        value={emailMessage}
                                        onChange={(e) => setEmailMessage(e.target.value)}
                                        rows={5}
                                        style={{
                                            width: "100%",
                                            marginTop: "10px",
                                            padding: "10px",
                                            fontSize: "14px",
                                            borderRadius: "4px",
                                            border: "1px solid #ddd",
                                        }}
                                    />
                                    <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
                                        <button
                                            onClick={handleSendEmail}
                                            style={{
                                                padding: "10px 15px",
                                                backgroundColor: "#4CAF50",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                            }}
                                            disabled={loading}
                                        >
                                            {loading ? "Lähetus..." : "Saada"}
                                        </button>
                                        <button
                                            onClick={handleCloseModal}
                                            style={{
                                                padding: "10px 15px",
                                                backgroundColor: "#f44336",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Tühistamine
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MasterPanel;
