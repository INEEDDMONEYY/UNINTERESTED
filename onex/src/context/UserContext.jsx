import { createContext, useState, useEffect } from "react";
import api, { setAuthToken, clearAuthData, getAuthToken } from "../utils/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/user/profile");
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

  const login = async (username, password) => {
    try {
      const res = await api.post("/signin", { username, password });
      const { token, user } = res.data;
      setAuthToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (err) {
      throw new Error(err.response?.data?.error || "Login failed");
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.warn("Logout error:", err.message || err);
    }
    clearAuthData();
    setUser(null);
  };

  const updateProfile = async (data, field = null) => {
    try {
      const isFormData = data instanceof FormData;
      const res = await api.put("/users/update-profile", isFormData ? data : { [field]: data });
      const updatedUser = res.data.updatedUser || res.data.user || res.data;

      const mergedUser = { ...user, ...updatedUser };
      setUser(mergedUser);
      localStorage.setItem("user", JSON.stringify(mergedUser));

      return updatedUser;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Profile update failed");
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get("/user/profile");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      console.error("Refresh user failed:", err.response?.data || err.message);
      throw err;
    }
  };

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
