import React, { useState, useEffect } from "react";
import axios from "axios";
import BookingCard from "./BookingCard";

const ClientPage = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/Appointment`);
        setBookings(data);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Client Dashboard</h1>
            <div>
                {bookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                ))}
            </div>
        </div>
    );
};

export default ClientPage;
