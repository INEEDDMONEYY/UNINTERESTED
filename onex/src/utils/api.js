import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "https://uninterested.onrender.com/api", // replace with your backend base URL
  withCredentials: true, // include cookies for auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to automatically attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response interceptor to handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      // Optionally: clear localStorage or redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;

