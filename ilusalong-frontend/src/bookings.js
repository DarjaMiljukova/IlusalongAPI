import axios from "axios";

const API_URL = "https://localhost:7277";

// Функция для получения списка бронирований
export const fetchBookings = async () => {
    try {
        const { data } = await axios.get(`${API_URL}/bookings`);
        return data;
    } catch (error) {
        console.error("Error fetching bookings:", error.response?.data || error.message);
        throw error;
    }
};

// Функция для отмены бронирования
export const cancelBooking = async (bookingId) => {
    try {
        const response = await axios.post(`${API_URL}/bookings/cancel`, { id: bookingId });
        return response.data;
    } catch (error) {
        console.error("Error cancelling booking:", error.response?.data || error.message);
        throw error;
    }
};
