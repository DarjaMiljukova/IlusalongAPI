import axios from "axios";

const API_URL = `https://localhost:7277/api/`;

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/User/register`, userData);
    return response.data;
};

export const login = async (userData) => {
    const response = await axios.post(`${API_URL}/User/login`, userData);
    return response.data;
};
