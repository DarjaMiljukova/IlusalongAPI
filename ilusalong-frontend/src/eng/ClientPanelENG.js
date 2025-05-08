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

                toast.success("Services have been successfully loaded!");

                const appointmentResponse = await axios.get(`http://localhost:5259/api/Appointment/user/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                toast.success("Data has been successfully updated!");

                // Log client and service data
                console.log("Client data:", clientResponse.data);
                console.log("Service data:", servicesResponse.data);

                // Update state
                setClientData(clientResponse.data);
                setServices(servicesResponse.data);
                setAppointments(appointmentResponse.data);
            } catch (error) {
                console.error("Error while fetching data:", error);
                toast.error("Error while loading data.");
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
        setMenuOpen(false);
    };

    const cancelAppointment = async (appointmentId) => {
        const appointment = appointments.find((app) => app.id === appointmentId);
        const appointmentDate = new Date(appointment.appointmentDate);
        const currentDate = new Date();
        const timeDifference = (appointmentDate - currentDate) / (1000 * 60 * 60); // hours

        if (timeDifference < 24) {
            const confirmCancel = window.confirm("Are you sure you want to cancel your appointment? Cancellations made less than 24 hours in advance will incur a cancellation fee.");
            if (confirmCancel) {
                try {
                    await axios.post(
                        "http://localhost:5259/api/Penalty",
                        {
                            userId: appointment.userId,
                            amount: 10,
                            reason: "Cancellation of an appointment less than 24 hours in advance",
                            dateIssued: new Date().toISOString(),
                        },
                        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
                    );
                    setAppointments(appointments.filter((app) => app.id !== appointmentId));
                    toast.success("The appointment has been successfully cancelled with a penalty being charged.");
                } catch (error) {
                    console.error("Error applying penalty:", error);
                    toast.error("Error in calculating the fine.");
                }
            }
        } else {
            try {
                await axios.delete(`http://localhost:5259/api/Appointment/${appointmentId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                setAppointments(appointments.filter((app) => app.id !== appointmentId));
                toast.success("Recording successfully canceled.");
            } catch (error) {
                console.error("Error cancelling appointment:", error);
                toast.error("Error canceling recording.");
            }
        }
    };

    const handleBookingTime = async (timeSlot) => {
        if (!newAppointment.serviceId) {
            toast.error("Please select a service.");
            return;
        }

        if (!selectedDate) {
            toast.error("Please select a date.");
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

            toast.success("Data has been successfully created..");
            setAppointments([...appointments, response.data]);
            setNewAppointment({
                serviceId: "",
                appointmentDate: "",
                selectedTime: "",
            });
        } catch (error) {
            console.error("Error booking appointment:", error);
            toast.error("Error creating record.");
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
            toast.success("Data has been successfully updated.");
        } catch (error) {
            console.error("Error updating client data:", error);
            toast.error("Error updating data.");
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

            <div style={{ position: "absolute", top: "80px", right: "15px" }}>
                <button onClick={logout}>Logi välja</button>
            </div>

            <button
                className={`burger-menu ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>


            <div className={`nav-tabs ${menuOpen ? "open" : ""}`}>
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                    <li>
                        <button
                        className={selectedTab === "appointments" ? "active" : ""}
                        onClick={() => handleTabChange("appointments")}
                    >
                            My bookings
                    </button>
                    </li>
                    <li>
                        <button
                        className={selectedTab === "fines" ? "active" : ""}
                        onClick={() => handleTabChange("fines")}
                    >
                            Fines
                    </button>
                    </li>
                    <li>
                        <button
                        className={selectedTab === "services" ? "active" : ""}
                        onClick={() => handleTabChange("services")}
                    >
                            Book a service
                        </button>
                    </li>
                    <li>
                        <button
                        className={selectedTab === "updateData" ? "active" : ""}
                        onClick={() => handleTabChange("updateData")}
                    >
                            Changing data
                    </button>
                    </li>
                </ul>
            </div>

            <div style={{ flex: 1, padding: "20px" }}>
                {selectedTab === "appointments" && (
                    <>
                        <h3>My bookings</h3>
                        {appointments.length > 0 ? (
                            <table>
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Service</th>
                                    <th>Activity</th>
                                </tr>
                                </thead>
                                <tbody>
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                                        <td>{appointment.service?.name || 'Unknown service'}</td>
                                        <td>
                                            <button onClick={() => cancelAppointment(appointment.id)}>
                                                Cancellation
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Missing data.</p>
                            )}
                    </>
                )}

                {selectedTab === "fines" && (
                    <>
                        <h3>My fines</h3>
                        {fines.length > 0 ? (
                            <table>
                                <thead>
                                <tr>
                                    <th>Reason</th>
                                    <th>Date</th>
                                    <th>Amount (€)</th>
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
                            <p>No fines.</p>
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
                                <option>Services are overloaded...</option>
                            ) : (
                                <>
                                    <option value="">Select a service</option>
                                    {services.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.name}, {service.description}, {service.price}€
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>

                        <h4>Choose a day</h4>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            min={new Date().toISOString().split("T")[0]}
                        />

                        <h4>Choose a time</h4>
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
                        <h3>Changing data</h3>
                        <form onSubmit={handleClientDataSubmit}>
                            <div>
                                <label htmlFor="phoneNumber">Phone number</label>
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
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={clientData.password}
                                    onChange={handleClientDataChange}
                                />
                            </div>
                            <button type="submit">Data update</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};


export default ClientPanel;
