import { createContext, useState, useEffect } from "react";
import api, { setAuthToken, clearAuthData, getAuthToken } from "../utils/api";
import env from "../config/env"; // ✅ Use centralized env

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* --------------------- Fetch current user on load --------------------- */
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get(`${env.API_BASE}/user/profile`, { withCredentials: true });
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        clearAuthData();
        setUser(null);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  /* --------------------------- Login --------------------------- */
  const login = async (username, password) => {
    try {
      const res = await api.post(`${env.API_BASE}/signin`, { username, password }, { withCredentials: true });
      const { token, user } = res.data;
      setAuthToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (err) {
      throw new Error(err.response?.data?.error || "Login failed");
    }
  };

  /* --------------------------- Logout -------------------------- */
  const logout = async () => {
    try {
      await api.post(`${env.API_BASE}/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.warn("Logout error:", err.message || err);
    }
    clearAuthData();
    setUser(null);
  };

  /* ------------------------ Update Profile --------------------- */
  const updateProfile = async (updatedData) => {
    try {
      const res = await api.put(`${env.API_BASE}/user/update-profile`, updatedData, { withCredentials: true });
      const updatedUser = res.data.updatedUser || res.data.user || res.data;

      // Merge previous user with updated fields
      setUser((prev) => ({ ...prev, ...updatedUser }));
      localStorage.setItem("user", JSON.stringify({ ...user, ...updatedUser }));

      return updatedUser;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Profile update failed");
    }
  };

  /* ------------------------ Refresh User ----------------------- */
  const refreshUser = async () => {
    try {
      const res = await api.get(`${env.API_BASE}/user/profile`, { withCredentials: true });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      console.error("Refresh user failed:", err.response?.data || err.message);
      throw err;
    }
  };

  /* -------------------------- Context -------------------------- */
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        updateProfile,
        refreshUser,
        loading,
        error,
      }}
    >
      {!loading ? children : <p className="text-center mt-10">Loading...</p>}
    </UserContext.Provider>
  );
};
