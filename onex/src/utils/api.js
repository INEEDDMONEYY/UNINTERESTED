// API.js 
import axios from "axios";

let API_BASE = import.meta.env.VITE_API_BASE?.trim() || "http://localhost:5020";
API_BASE = API_BASE.replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;

    // ✅ Axios will now automatically handle FormData Content-Type
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAuthToken = () => localStorage.getItem("token");
export const setAuthToken = (token) => token ? localStorage.setItem("token", token) : localStorage.removeItem("token");
export const clearAuthData = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); };

export default api;
