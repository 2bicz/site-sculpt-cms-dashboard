import axios from 'axios';
import Cookies from 'js-cookie';
import { env } from 'environment/environment';

const api = axios.create({
    baseURL: env.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('jwtToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
