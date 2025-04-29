import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ilusalong-api-production.up.railway.app/api',
});

export default api;
