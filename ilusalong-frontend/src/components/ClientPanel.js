import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../styles/client.css';

const ClientPanel = () => {
    const [fines, setFines] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [clientData, setClientData] = useState({
        phoneNumber: "",
        email: "",
        password: "",
    });
    const [newAppointment, setNewAppointment] = useState({
        serviceId: "",
        appointmentDate: "",
        selectedTime: "",
    });
    const [services, setServices] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTab, setSelectedTab] = useState('appointments');

    const [userId, setUserId] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Получаем ID пользователя из токена
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.id);
        } else {
            console.error("Token is missing or invalid.");
        }
    }, []);


    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            try {
                const clientResponse = await axios.get(`http://localhost:5259/api/User/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });

                const servicesResponse = await axios.get(`http://localhost:5259/api/Service`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });

                console.log("Services response:", servicesResponse.data);

                setServices(servicesResponse.data);

                toast.success("Teenused on edukalt üles laaditud!");

                const appoimentResponse = await axios.get(`http://localhost:5259/api/Appointment/user/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                toast.success("Andmed on edukalt uuendatud!");

                // Логируем данные клиента и услуги
                console.log("Данные клиента:", clientResponse.data);
                console.log("Данные об услугах:", servicesResponse.data);

                // Обновляем состояние
                setClientData(clientResponse.data);
                setServices(servicesResponse.data);
                setAppointments(appoimentResponse.data);
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
                toast.error("Ошибка при загрузке данных.");
            }
        };

        fetchData();
    }, [userId]);

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            try {
                const finesResponse = await axios.get(`http://localhost:5259/api/Penalty/user/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                setFines(finesResponse.data);

                const appointmentsResponse = await axios.get(`http://localhost:5259/api/Appointment/user/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                setAppointments(appointmentsResponse.data);

                const clientResponse = await axios.get(`http://localhost:5259/api/User/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                setClientData(clientResponse.data);

                const servicesResponse = await axios.get(`http://localhost:5259/api/Service`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                setServices(servicesResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Ошибка при загрузке данных.");
            }
        };

        fetchData();
    }, [userId]);

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setSelectedDate(selectedDate);

        const unavailableTimes = appointments
            .filter((appointment) => appointment.appointmentDate.startsWith(selectedDate))
            .map((appointment) => appointment.appointmentDate.slice(11, 16));  // Извлекаем только время

        const times = [];
        for (let hour = 8; hour < 20; hour += 2) {
            const time = `${String(hour).padStart(2, "0")}:00`;
            if (!unavailableTimes.includes(time)) {
                times.push(time);
            }
        }

        setAvailableTimes(times);
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        setMenuOpen(false); // Закрываем меню при выборе вкладки
    };

    const cancelAppointment = async (appointmentId) => {
        const appointment = appointments.find((app) => app.id === appointmentId);
        const appointmentDate = new Date(appointment.appointmentDate);
        const currentDate = new Date();
        const timeDifference = (appointmentDate - currentDate) / (1000 * 60 * 60); // hours

        if (timeDifference < 24) {
            const confirmCancel = window.confirm("Вы уверены, что хотите отменить запись? При отмене менее чем за 24 часа будет начислен штраф.");
            if (confirmCancel) {
                try {
                    await axios.post(
                        "http://localhost:5259/api/Penalty",
                        {
                            userId: appointment.userId,
                            amount: 10,
                            reason: "Отмена записи менее чем за 24 часа",
                            dateIssued: new Date().toISOString(),
                        },
                        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
                    );
                    setAppointments(appointments.filter((app) => app.id !== appointmentId));
                    toast.success("Запись успешно отменена с начислением штрафа.");
                } catch (error) {
                    console.error("Error applying penalty:", error);
                    toast.error("Ошибка при начислении штрафа.");
                }
            }
        } else {
            try {
                await axios.delete(`http://localhost:5259/api/Appointment/${appointmentId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                setAppointments(appointments.filter((app) => app.id !== appointmentId));
                toast.success("Salvestus on edukalt tühistatud.");
            } catch (error) {
                console.error("Error cancelling appointment:", error);
                toast.error("Ошибка при отмене записи.");
            }
        }
    };

    const handleBookingTime = async (timeSlot) => {
        if (!newAppointment.serviceId) {
            toast.error("Palun valige teenus.");
            return;
        }

        if (!selectedDate) {
            toast.error("Palun valige kuupäev.");
            return;
        }

        const appointmentDate = `${selectedDate}T${timeSlot}:00`;

        try {
            const response = await axios.post(
                `http://localhost:5259/api/Appointment/addAppointment`,
                {
                    userId: userId,
                    serviceId: newAppointment.serviceId,
                    appointmentDate: appointmentDate,
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
            );

            toast.success("Andmed on edukalt loodud.");
            setAppointments([...appointments, response.data]);
            setNewAppointment({
                serviceId: "",
                appointmentDate: "",
                selectedTime: "",
            });
        } catch (error) {
            console.error("Error booking appointment:", error);
            toast.error("Viga kirje loomisel.");
        }
    };

    const handleNewAppointmentChange = (e) => {
        const { name, value } = e.target;
        setNewAppointment({
            ...newAppointment,
            [name]: value,
        });
    };

    const handleClientDataChange = (e) => {
        const { name, value } = e.target;
        setClientData({
            ...clientData,
            [name]: value,
        });
    };

    const handleClientDataSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5259/api/User/${clientData.id}`, clientData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
            });
            toast.success("Andmed on edukalt ajakohastatud.");
        } catch (error) {
            console.error("Error updating client data:", error);
            toast.error("Viga andmete uuendamisel.");
        }
    };
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    // Выход из аккаунта
    const logout = () => {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        window.location.href = "/login";
    };

    return (
        <div className="client-panel">
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

            {/* Панель с навигацией */}
            <div className={`nav-tabs ${menuOpen ? "open" : ""}`}>
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                    <li>
                        <button
                        className={selectedTab === "appointments" ? "active" : ""}
                        onClick={() => handleTabChange("appointments")}
                    >
                        Minu broneeringud
                    </button>
                    </li>
                    <li>
                        <button
                        className={selectedTab === "fines" ? "active" : ""}
                        onClick={() => handleTabChange("fines")}
                    >
                        Trahvid
                    </button>
                    </li>
                    <li>
                        <button
                        className={selectedTab === "services" ? "active" : ""}
                        onClick={() => handleTabChange("services")}
                    >
                        Broneeri teenus
                        </button>
                    </li>
                    <li>
                        <button
                        className={selectedTab === "updateData" ? "active" : ""}
                        onClick={() => handleTabChange("updateData")}
                    >
                        Andmete muutmine
                    </button>
                    </li>
                </ul>
            </div>

            <div style={{ flex: 1, padding: "20px" }}>
                {selectedTab === "appointments" && (
                    <>
                        <h3>Minu broneeringud</h3>
                        {appointments.length > 0 ? (
                            <table>
                                <thead>
                                <tr>
                                    <th>Kuupäev</th>
                                    <th>Teenus</th>
                                    <th>Tegevus</th>
                                </tr>
                                </thead>
                                <tbody>
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                                        <td>{appointment.service?.name || 'Tundmatu teenus'}</td>
                                        <td>
                                            <button onClick={() => cancelAppointment(appointment.id)}>
                                                Tühistamine
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Puuduvad andmed.</p>
                            )}
                    </>
                )}

                {selectedTab === "fines" && (
                    <>
                        <h3>Minu trahvid</h3>
                        {fines.length > 0 ? (
                            <table>
                                <thead>
                                <tr>
                                    <th>Põhjus</th>
                                    <th>Kuupäev</th>
                                    <th>Summa (€)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {fines.map((fine) => (
                                    <tr key={fine.id}>
                                        <td>{fine.reason}</td>
                                        <td>{new Date(fine.dateIssued).toLocaleDateString()}</td>
                                        <td>{fine.amount} EUR</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Trahvid puuduvad.</p>
                        )}
                    </>
                )}


                {selectedTab === "services" && (
                    <>
                        <h3>Broneeri teenus</h3>
                        <select
                            name="serviceId"
                            value={newAppointment.serviceId}
                            onChange={handleNewAppointmentChange}
                        >
                            {services.length === 0 ? (
                                <option>Teenused on koormatud...</option>
                            ) : (
                                <>
                                    <option value="">Valige teenus</option>
                                    {services.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.name}, {service.description}, {service.price}€
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>

                        <h4>Valige kuupäev</h4>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            min={new Date().toISOString().split("T")[0]}
                        />

                        <h4>Valige aeg</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px" }}>
                            {availableTimes.map((timeSlot) => (
                                <button className={`aeg`}
                                    key={timeSlot}
                                    onClick={async () => {
                                        await handleBookingTime(timeSlot);

                                        window.location.reload();
                                    }}
                                    style={{
                                        padding: "10px",
                                        backgroundColor: "#f0f0f0",
                                        border: "1px solid #ddd",
                                        cursor: "pointer",
                                        color: "black",
                                    }}
                                >
                                    {timeSlot}
                                </button>
                            ))}
                        </div>
                    </>
                )}



                {selectedTab === "updateData" && (
                    <>
                        <h3>Andmete muutmine</h3>
                        <form onSubmit={handleClientDataSubmit}>
                            <div>
                                <label htmlFor="phoneNumber">Telefon</label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={clientData.phoneNumber}
                                    onChange={handleClientDataChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={clientData.email}
                                    onChange={handleClientDataChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="password">Salasõna</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={clientData.password}
                                    onChange={handleClientDataChange}
                                />
                            </div>
                            <button type="submit">Andmete uuendamine</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};


export default ClientPanel;
