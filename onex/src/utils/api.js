import axios from "axios";
import env from "../config/env"; // ✅ Centralized env

// ✅ Axios instance
const api = axios.create({
  baseURL: `${env.API_BASE}/api`, // backend API base
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* -------------------------------------------------------------------------- */
/* 🧠 Request & Response Interceptors                                         */
/* -------------------------------------------------------------------------- */

// Automatically attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;

    // Correct headers for FormData
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Global response handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("⚠️ Unauthorized! Clearing token & user...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    if (status === 403) console.warn("🚫 Forbidden — admin or permission issue");

    if (!status) console.error("❌ Network/server error:", error.message);

    return Promise.reject(error);
  }
);

/* -------------------------------------------------------------------------- */
/* 🧩 Helper Methods (used by UserContext)                                     */
/* -------------------------------------------------------------------------- */
export const setAuthToken = (token) => token ? localStorage.setItem("token", token) : localStorage.removeItem("token");
export const getAuthToken = () => localStorage.getItem("token");
export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default api;
