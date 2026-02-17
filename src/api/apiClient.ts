import axios from "axios";
import { store } from "../features/store";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_PATH,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request interceptor — auto-attach JWT token
apiClient.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — unwrap data and handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // If 401, optionally handle logout
        if (error.response?.status === 401) {
            console.warn("Unauthorized — token may be expired.");
        }
        return Promise.reject(error);
    }
);

export default apiClient;
