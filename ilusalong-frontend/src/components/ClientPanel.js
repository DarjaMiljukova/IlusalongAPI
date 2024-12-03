import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClientPanel = () => {
    const [fines, setFines] = useState([]); // Штрафы
    const [appointments, setAppointments] = useState([]); // Записи
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
    const [services, setServices] = useState([]); // Услуги
    const [availableTimes, setAvailableTimes] = useState([]); // Доступные интервалы времени
    const [selectedDate, setSelectedDate] = useState(""); // Выбранная дата
    const [activeTab, setActiveTab] = useState("appointments"); // Активная вкладка
    const [userId, setUserId] = useState(null);

    // Получаем ID пользователя из токена
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.id);  // Сохраняем userId из токена
        } else {
            console.error("Token is missing or invalid.");
        }
    }, []);


    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            try {
                const servicesResponse = await axios.get(`http://localhost:5259/api/Service`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });

                if (Array.isArray(servicesResponse.data)) {
                    setServices(servicesResponse.data);
                } else {
                    console.error("Ожидался массив услуг, но получены данные:", servicesResponse.data);
                    toast.error("Ошибка при загрузке услуг.");
                }
            } catch (error) {
                console.error("Ошибка при получении данных об услугах:", error);
                toast.error("Ошибка при загрузке услуг.");
            }
        };

        fetchData();
    }, [userId]);

    // Получаем данные клиента, штрафы, записи и услуги
    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            try {
                // Получаем штрафы
                const finesResponse = await axios.get(`http://localhost:5259/api/Penalty/user/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                setFines(finesResponse.data);

                // Получаем записи клиента
                const appointmentsResponse = await axios.get(`http://localhost:5259/api/Appointment/user/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                setAppointments(appointmentsResponse.data);

                // Получаем данные клиента
                const clientResponse = await axios.get(`http://localhost:5259/api/User/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                setClientData(clientResponse.data);

                // Получаем список услуг
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

    // Получаем доступные интервалы времени для выбранной даты
    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setSelectedDate(selectedDate);

        // Получаем все записи для выбранной даты
        const unavailableTimes = appointments
            .filter((appointment) => appointment.appointmentDate.startsWith(selectedDate))
            .map((appointment) => appointment.appointmentDate.slice(11, 16)); // Извлекаем только время

        // Генерируем доступные интервалы времени с 8:00 до 20:00
        const times = [];
        for (let hour = 8; hour < 18; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const time = `${String(hour).padStart(1, "0")}:${String(minute).padStart(2, "0")}`;
                if (!unavailableTimes.includes(time)) {
                    times.push(time);
                }
            }
        }

        setAvailableTimes(times);
    };

    const handleTabChange = (tab) => setActiveTab(tab);

    // Функция отмены записи

    const cancelAppointment = async (appointmentId) => {
        try {
            const appointment = appointments.find((app) => app.id === appointmentId);
            const appointmentDate = new Date(appointment.appointmentDate);
            const currentDate = new Date();

            const timeDifference = (appointmentDate - currentDate) / (1000 * 60 * 60); // Разница в часах

            if (timeDifference < 24) {
                // Если меньше 24 часов, показываем подтверждение и начисляем штраф
                const confirmCancel = window.confirm("Вы уверены, что хотите отменить запись? При отмене менее чем за 24 часа будет начислен штраф.");
                if (confirmCancel) {
                    // Логика для начисления штрафа
                    await axios.post(
                        `http://localhost:5259/api/Penalty`,
                        {
                            userId: appointment.userId,
                            amount: 50, // Установите свой штраф
                            reason: "Отмена записи менее чем за 24 часа",
                            dateIssued: new Date().toISOString(),
                        },
                        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
                    );
                    toast.success("Запись успешно отменена с начислением штрафа.");
                    setAppointments(appointments.filter((app) => app.id !== appointmentId)); // Обновляем список записей на фронте
                }
            } else {
                // Если больше 24 часов, показываем подтверждение и отменяем запись
                const confirmCancel = window.confirm("Вы уверены, что хотите отменить запись?");
                if (confirmCancel) {
                    await axios.delete(`http://localhost:5259/api/Appointment/${appointmentId}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                    });
                    setAppointments(appointments.filter((app) => app.id !== appointmentId)); // Обновляем список записей на фронте
                    toast.success("Запись успешно отменена.");
                }
            }
        } catch (error) {
            console.error("Error canceling appointment:", error);
            toast.error("Ошибка при отмене записи.");
        }
    };


    // Выбор времени для бронирования
    const handleBookingTime = async (timeSlot) => {
        if (!newAppointment.serviceId) {
            toast.error("Пожалуйста, выберите услугу.");
            return;
        }

        if (!selectedDate) {
            toast.error("Пожалуйста, выберите дату.");
            return;
        }

        console.log(`Выбранное время: ${timeSlot}, Дата: ${selectedDate}`);
        const appointmentDate = `${selectedDate}T${timeSlot}:00`;  // Форматируем дату

        const confirmBooking = window.confirm(`Вы уверены, что хотите забронировать услугу на ${timeSlot}?`);
        if (confirmBooking) {
            try {
                const appointmentData = {
                    serviceId: newAppointment.serviceId,
                    appointmentDate: appointmentDate, // Используем отформатированную дату
                    userId: userId,  // Используем userId из токена
                };
                console.log("Данные для бронирования:", appointmentData); // Логируем данные для отладки

                // Отправляем запрос на сервер для добавления записи
                const response = await axios.post("http://localhost:5259/api/Appointment/addAppointment", appointmentData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });

                // Обновление состояния после успешной записи
                setAppointments([...appointments, response.data]);

                toast.success("Запись успешно забронирована.");
            } catch (error) {
                console.error("Ошибка бронирования:", error.response ? error.response.data : error.message);
                toast.error("Ошибка при бронировании.");
            }
        }
    };

    // Обработка изменений данных клиента
    const handleNewAppointmentChange = (e) => {
        const { name, value } = e.target;
        setNewAppointment({
            ...newAppointment,
            [name]: value,
        });
    };

    // Обработка изменений данных клиента
    const handleClientDataChange = (e) => {
        const { name, value } = e.target;
        setClientData({
            ...clientData,
            [name]: value,
        });
    };

    // Отправка обновленных данных клиента
    const handleClientDataSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5259/api/User/${clientData.id}`, clientData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
            });
            toast.success("Данные успешно обновлены.");
        } catch (error) {
            console.error("Error updating client data:", error);
            toast.error("Ошибка при обновлении данных.");
        }
    };

    // Выход из аккаунта
    const logout = () => {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        window.location.href = "/login";
    };

    return (
        <div style={{ display: "flex" }}>
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

            <div style={{ width: "250px", padding: "20px", borderRight: "1px solid #ccc" }}>
                <h3>Панель клиента</h3>
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                    <li
                        style={{
                            padding: "10px",
                            cursor: "pointer",
                            backgroundColor: activeTab === "appointments" ? "#f0f0f0" : "",
                        }}
                        onClick={() => handleTabChange("appointments")}
                    >
                        Записи
                    </li>
                    <li
                        style={{
                            padding: "10px",
                            cursor: "pointer",
                            backgroundColor: activeTab === "fines" ? "#f0f0f0" : "",
                        }}
                        onClick={() => handleTabChange("fines")}
                    >
                        Штрафы
                    </li>
                    <li
                        style={{
                            padding: "10px",
                            cursor: "pointer",
                            backgroundColor: activeTab === "services" ? "#f0f0f0" : "",
                        }}
                        onClick={() => handleTabChange("services")}
                    >
                        Забронировать услугу
                    </li>
                    <li
                        style={{
                            padding: "10px",
                            cursor: "pointer",
                            backgroundColor: activeTab === "updateData" ? "#f0f0f0" : "",
                        }}
                        onClick={() => handleTabChange("updateData")}
                    >
                        Изменить данные
                    </li>
                </ul>
            </div>

            <div style={{ flex: 1, padding: "20px" }}>
                {activeTab === "appointments" && (
                    <>
                        <h3>Ваши записи</h3>
                        {appointments.length > 0 ? (
                            <table>
                                <thead>
                                <tr>
                                    <th>Дата</th>
                                    <th>Услуга</th>
                                    <th>Действие</th>
                                </tr>
                                </thead>
                                <tbody>
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                                        <td>{appointment.service.name}</td>
                                        <td>
                                            <button onClick={() => cancelAppointment(appointment.id)}>
                                                Отменить
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Записей нет.</p>
                        )}
                    </>
                )}

                {activeTab === "fines" && (
                    <>
                        <h3>Ваши штрафы</h3>
                        {fines.length > 0 ? (
                            <ul>
                                {fines.map((fine) => (
                                    <li key={fine.id}>
                                        {fine.reason} - {fine.amount} EUR
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Штрафов нет.</p>
                        )}
                    </>
                )}

                {activeTab === "services" && (
                    <>
                        <h3>Забронировать услугу</h3>
                        <select
                            name="serviceId"
                            value={newAppointment.serviceId}
                            onChange={handleNewAppointmentChange}
                        >
                            <option value="">Выберите услугу</option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                        <h4>Выберите дату</h4>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            min={new Date().toISOString().split("T")[0]} // Ограничение на текущую дату
                        />
                        <h4>Выберите время</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px" }}>
                            {availableTimes.map((timeSlot) => (
                                <button
                                    key={timeSlot}
                                    onClick={() => handleBookingTime(timeSlot)}
                                    style={{
                                        padding: "10px",
                                        backgroundColor: "#f0f0f0",
                                        border: "1px solid #ddd",
                                        cursor: "pointer",
                                    }}
                                >
                                    {timeSlot}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === "updateData" && (
                    <>
                        <h3>Изменить данные</h3>
                        <form onSubmit={handleClientDataSubmit}>
                            <div>
                                <label htmlFor="phoneNumber">Телефон</label>
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
                                <label htmlFor="password">Пароль</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={clientData.password}
                                    onChange={handleClientDataChange}
                                />
                            </div>
                            <button type="submit">Обновить данные</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ClientPanel;
