import axios from "axios";

/* ---------------------- Environment Setup ---------------------- */
// Ensure base URL has no trailing slash and defaults correctly
let API_BASE = import.meta.env.VITE_API_BASE?.trim() || "http://localhost:5020";

// Remove accidental trailing "/api" if user included it in .env
if (API_BASE.endsWith("/api")) {
  API_BASE = API_BASE.replace(/\/api$/, "");
}

/* ---------------------- Axios Instance ------------------------- */
const api = axios.create({
  baseURL: `${API_BASE}/api`, // unified endpoint
  withCredentials: true,      // include cookies (if backend supports)
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------------------- Request Interceptor -------------------- */
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

/* ---------------------- Response Interceptor ------------------- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("⚠️ Unauthorized — clearing token & user data...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optional redirect:
      // window.location.href = "/signin";
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
