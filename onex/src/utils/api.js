// API.js 
import axios from "axios";

/* ---------------------- Environment Setup ---------------------- */
let API_BASE = import.meta.env.VITE_API_BASE?.trim() || "http://localhost:5020";

// Strip trailing slash
API_BASE = API_BASE.replace(/\/+$/, "");

/* ---------------------- Axios Instance ------------------------- */
const api = axios.create({
  baseURL: `${API_BASE}/api`, // always append /api once
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/* ---------------------- Request Interceptor -------------------- */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------------------- Response Interceptor ------------------- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    if (status === 401) {
      // ✅ Skip clearing on signup/signin routes
      if (!requestUrl.includes("/signup") && !requestUrl.includes("/signin")) {
        console.warn("⚠️ Unauthorized — clearing token & user data...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    if (status === 403) console.warn("🚫 Forbidden — insufficient permissions");
    if (!status) console.error("❌ Network/server error:", error.message);

    return Promise.reject(error);
  }
);

/* ---------------------- Helper Methods ------------------------- */
export const setAuthToken = (token) => {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
};

export const getAuthToken = () => localStorage.getItem("token");

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default api;
