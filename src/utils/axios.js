import axios from 'axios';
import { CONFIG } from '../config-global';

const axiosInstance = axios.create({
    baseURL: CONFIG.serverUrl,
    // timeout: 10000,
    // headers: {
    //     'Content-Type': 'application/json',
    // },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject((error.response?.data || error.message) || 'Request failed');
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject((error.response?.data || error.message) || 'Request failed');
    }
);

export default axiosInstance;

// -----------------------------------------------

export const endpoints = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
    },
    user: {
        me: '/user/me',
    },
};
