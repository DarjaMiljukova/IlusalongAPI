import React from "react";

const BookingCard = ({ booking, onCancel }) => {
    return (
        <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
            <h3>{booking.serviceName}</h3>
            <p>Time: {new Date(booking.startTime).toLocaleString()}</p>
            <button onClick={() => onCancel(booking.id)}>Cancel</button>
        </div>
    );
};

export default BookingCard;
