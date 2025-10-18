import axios from "axios";

// ---------------------- Environment ----------------------
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5020"; // fallback to local

// ---------------------- Axios Instance -------------------
const api = axios.create({
  baseURL: `${API_BASE}/api`, // backend API base
  withCredentials: true,      // send cookies for auth
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------- Request Interceptor -------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;

    // Ensure FormData uploads get correct headers
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------- Response Interceptor ------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("⚠️ Unauthorized! Clearing token & user...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optional: redirect to login if desired
      // window.location.href = "/signin";
    }

    if (status === 403) console.warn("🚫 Forbidden — admin or permission issue");

    if (!status) console.error("❌ Network/server error:", error.message);

    return Promise.reject(error);
  }
);

// ---------------------- Helper Methods ------------------
export const setAuthToken = (token) =>
  token ? localStorage.setItem("token", token) : localStorage.removeItem("token");

export const getAuthToken = () => localStorage.getItem("token");

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default api;
