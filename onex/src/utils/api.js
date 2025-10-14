import axios from "axios";

// ✅ Create an Axios instance
const api = axios.create({
  baseURL: "https://uninterested.onrender.com/api", // replace with your backend base URL
  withCredentials: true, // include cookies for auth
  headers: {
    "Content-Type": "application/json",
  },
});

/* -------------------------------------------------------------------------- */
/* 🧠 STEP 3: Enhanced Token + User Context Handling                           */
/* -------------------------------------------------------------------------- */

// 🔹 Automatically attach Authorization header for authenticated users
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

// 🔹 Optional: Global response handling (401, 403, network errors, etc.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("⚠️ Unauthorized! Clearing token and redirecting to login...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optionally redirect to login:
      // window.location.href = "/signin";
    }

    if (status === 403) {
      console.warn("🚫 Forbidden access — admin or permission issue");
    }

    if (!status) {
      console.error("❌ Network or server error:", error.message);
    }

    return Promise.reject(error);
  }
);

/* -------------------------------------------------------------------------- */
/* 🧩 Helper Methods (Optional - can be used with your UserContext)            */
/* -------------------------------------------------------------------------- */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const getAuthToken = () => localStorage.getItem("token");

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/* -------------------------------------------------------------------------- */

export default api;
