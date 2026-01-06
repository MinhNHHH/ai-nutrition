import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// In a real app, this would come from an environment variable
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000,
});

// Request interceptor to add the auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors like 401 Unauthorized
        if (error.response?.status === 401) {
            // Logout and redirect to login
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);
