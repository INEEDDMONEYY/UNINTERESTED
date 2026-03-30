// API.js 
import axios from "axios";


// Use Codespaces public backend URL in development
let API_BASE = import.meta.env.DEV
  ? "https://urban-rotary-phone-9vw7vw7prww26j4-5020.app.github.dev"
  : import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_API_BASE?.trim() ||
    import.meta.env.VITE_API_URL?.trim() ||
    "https://uninterested.onrender.com";

API_BASE = API_BASE.replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
});

const RESTRICTION_LABELS = {
  "no-posting": "Posting is disabled for your account.",
  "no-comments": "Messaging/commenting is disabled for your account.",
  "read-only": "Your account is in read-only mode.",
};

const emitRestrictionToast = (payload) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("restriction-toast", { detail: payload }));
};

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const restriction = data?.restriction;

    if (status === 403 && restriction) {
      emitRestrictionToast({
        type: "error",
        message:
          data?.error ||
          RESTRICTION_LABELS[restriction] ||
          "This action is restricted for your account.",
      });
    }

    return Promise.reject(error);
  }
);

export const getAuthToken = () => localStorage.getItem("token");
export const setAuthToken = (token) => token ? localStorage.setItem("token", token) : localStorage.removeItem("token");
export const clearAuthData = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); };

export default api;
