import { createContext, useState, useEffect } from "react";
import api, { setAuthToken, clearAuthData, getAuthToken } from "../utils/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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
      } catch (err) {
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (username, password) => {
    const res = await api.post("/signin", { username, password });
    const { token, user } = res.data;
    setAuthToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {}
    clearAuthData();
    setUser(null);
  };

  const updateProfile = async (updatedData) => {
    const res = await api.put("/user/update-profile", updatedData); // ✅ correct route
    const updatedUser = res.data.updatedUser || res.data.user || res.data;

    setUser((prev) => ({ ...prev, ...updatedUser }));
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  };

  // ✅ Step 4: Modular logic hook (can be renamed or expanded)
  const stepFour = async () => {
    try {
      const res = await api.get("/user/profile");
      const refreshedUser = res.data;
      setUser(refreshedUser);
      localStorage.setItem("user", JSON.stringify(refreshedUser));
      return refreshedUser;
    } catch (err) {
      console.error("Step 4 failed:", err.response?.data || err.message);
      throw err;
    }
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    updateProfile,
    stepFour, // ✅ exposed for use in other components
    loading,
    error,
  };

  return (
    <UserContext.Provider value={value}>
      {!loading ? children : <p className="text-center mt-10">Loading...</p>}
    </UserContext.Provider>
  );
};
