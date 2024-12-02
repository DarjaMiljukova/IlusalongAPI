import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

const ClientPanel = () => {
    const [masters, setMasters] = useState([]);
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [penalties, setPenalties] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedMaster, setSelectedMaster] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [step, setStep] = useState(1); // 1 - мастера, 2 - категории, 3 - услуги
    const [userInfo, setUserInfo] = useState({ email: "", phoneNumber: "", newEmail: "", newPhone: "", newPassword: "" });
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.id);
            fetchUserInfo(decodedToken.id);
        }
    }, []);

    useEffect(() => {
        const fetchMasters = async () => {
            const token = localStorage.getItem("authToken");
            try {
                const response = await axios.get("http://localhost:5259/api/Master", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMasters(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке мастеров:", error);
                toast.error("Не удалось загрузить список мастеров.");
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5259/api/Category");
                setCategories(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке категорий:", error);
                toast.error("Не удалось загрузить категории.");
            }
        };

        const fetchPenalties = async () => {
            const token = localStorage.getItem("authToken");
            try {
                const response = await axios.get("http://localhost:5259/api/Penalty", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPenalties(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке штрафов:", error);
                toast.error("Не удалось загрузить штрафы.");
            }
        };

        fetchMasters();
        fetchCategories();
        fetchPenalties();
        fetchAppointments();
    }, []);

    // Функция для загрузки записей
    const fetchAppointments = async () => {
        const token = localStorage.getItem("authToken");
        try {
            const response = await axios.get(`http://localhost:5259/api/Appointment/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAppointments(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке записей:", error);
            toast.error("Не удалось загрузить записи.");
        }
    };

    const fetchUserInfo = async (id) => {
        const token = localStorage.getItem("authToken");
        try {
            const response = await axios.get(`http://localhost:5259/api/User/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserInfo({
                email: response.data.email,
                phoneNumber: response.data.phoneNumber,
                newEmail: response.data.email,
                newPhone: response.data.phoneNumber,
                newPassword: "",
            });
        } catch (error) {
            console.error("Ошибка при загрузке информации о пользователе:", error);
            toast.error("Не удалось загрузить информацию о пользователе.");
        }
    };

    const handleProfileUpdate = async () => {
        const token = localStorage.getItem("authToken");
        try {
            const updatedUser = {
                email: userInfo.newEmail,
                phoneNumber: userInfo.newPhone,
                password: userInfo.newPassword,
            };

            await axios.put(`http://localhost:5259/api/User/${userId}`, updatedUser, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Информация обновлена!");
        } catch (error) {
            console.error("Ошибка при обновлении данных пользователя:", error);
            toast.error("Не удалось обновить информацию.");
        }
    };

    const handleAppointment = async () => {
        if (!selectedMaster || !selectedCategory || !selectedService || !selectedDate || !selectedTime) {
            toast.error("Пожалуйста, выберите мастера, категорию, услугу, дату и время.");
            return;
        }

        const appointmentData = {
            masterId: selectedMaster,
            categoryId: selectedCategory,
            serviceId: selectedService,
            appointmentDate: `${selectedDate}T${selectedTime}:00`,
            status: "Забронировано",
        };

        const token = localStorage.getItem("authToken");
        try {
            await axios.post("http://localhost:5259/api/Appointment", appointmentData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Запись успешно сделана!");
            fetchAppointments(); // Обновляем список записей
        } catch (error) {
            console.error("Ошибка при записи на услугу:", error);
            toast.error("Ошибка при записи.");
        }
    };

    const cancelAppointment = async (appointmentId) => {
        const token = localStorage.getItem("authToken");
        try {
            await axios.delete(`http://localhost:5259/api/Appointment/${appointmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Запись отменена!");
            fetchAppointments(); // Обновляем список записей
        } catch (error) {
            console.error("Ошибка при отмене записи:", error);
            toast.error("Ошибка при отмене записи.");
        }
    };

    const nextStep = () => {
        setStep((prevStep) => prevStep + 1);
    };

    return (
        <div className="client-panel">
            <h2>Рабочий стол</h2>
            <ToastContainer position="top-right" autoClose={3000} />
            {/* Кнопка выхода */}
            <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <button
                    onClick={() => {
                        localStorage.removeItem("authToken");
                        sessionStorage.removeItem("authToken");
                        window.location.href = "/login";
                    }}
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

            <div>
                <h3>Информация об аккаунте</h3>
                <div>Email: {userInfo.email}</div>
                <div>Телефон: {userInfo.phoneNumber}</div>
                <div>
                    <h4>Обновить информацию</h4>
                    <input
                        type="text"
                        placeholder="Новый Email"
                        value={userInfo.newEmail}
                        onChange={(e) => setUserInfo({ ...userInfo, newEmail: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Новый телефон"
                        value={userInfo.newPhone}
                        onChange={(e) => setUserInfo({ ...userInfo, newPhone: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Новый пароль"
                        value={userInfo.newPassword}
                        onChange={(e) => setUserInfo({ ...userInfo, newPassword: e.target.value })}
                    />
                    <button onClick={handleProfileUpdate}>Обновить данные</button>
                </div>
            </div>

            {/* Шаг 1: Выбор мастера */}
            {step === 1 && (
                <div>
                    <h3>Шаг 1: Выберите мастера</h3>
                    <div className="buttons-container">
                        {masters.map((master) => (
                            <button
                                key={master.id}
                                onClick={() => {
                                    setSelectedMaster(master.id);
                                    nextStep();
                                }}
                            >
                                {master.email.split('@')[0]} {/* Отображаем имя пользователя без "@"*/}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Шаг 2: Выбор категории */}
            {step === 2 && selectedMaster && (
                <div>
                    <h3>Шаг 2: Выберите категорию</h3>
                    <div className="buttons-container">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setSelectedCategory(category.id);
                                    nextStep();
                                }}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Шаг 3: Выбор услуги */}
            {step === 3 && selectedCategory && (
                <div>
                    <h3>Шаг 3: Выберите услугу</h3>
                    <div className="buttons-container">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => {
                                    setSelectedService(service.id);
                                    nextStep();
                                }}
                            >
                                {service.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Шаг 4: Выбор даты и времени */}
            {step === 4 && selectedService && (
                <div>
                    <h3>Шаг 4: Выберите дату и время</h3>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                    />
                    <button onClick={handleAppointment}>Записаться</button>
                </div>
            )}

            <div>
                <h3>Мои записи</h3>
                {appointments.length === 0 ? (
                    <p>Нет записей.</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Услуга</th>
                            <th>Дата и время</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment.id}>
                                <td>{appointment.service.name}</td>
                                <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                                <td>{appointment.status}</td>
                                <td>
                                    {appointment.status !== "Отменено" && (
                                        <button onClick={() => cancelAppointment(appointment.id)}>
                                            Отменить
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div>
                <h3>Штрафы</h3>
                {penalties.length === 0 ? (
                    <p>Нет штрафов.</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Причина</th>
                            <th>Сумма</th>
                            <th>Дата</th>
                        </tr>
                        </thead>
                        <tbody>
                        {penalties.map((penalty) => (
                            <tr key={penalty.id}>
                                <td>{penalty.id}</td>
                                <td>{penalty.reason}</td>
                                <td>{penalty.amount}</td>
                                <td>{new Date(penalty.dateIssued).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ClientPanel;
