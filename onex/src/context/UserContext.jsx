// Frontend UserContext file (updated to namespace localStorage by user ID)
import { createContext, useState, useEffect } from "react";
import api, { setAuthToken, clearAuthData, getAuthToken } from "../utils/api";

export const UserContext = createContext();

const keyFor = (base, userId) => (userId ? `${base}_${userId}` : base);

export const UserProvider = ({ children }) => {
  // Auth session user (signed-in user)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: persist session user (auth storage) and per-user profile storage
  const persistUser = (u) => {
    if (!u) return;
    try {
      localStorage.setItem(`user_${u._id}`, JSON.stringify(u)); // session/auth canonical store
      if (u._id) {
        localStorage.setItem(keyFor("userProfile", u._id), JSON.stringify(u)); // namespaced profile store
      }
    } catch (e) {
      console.error("Failed to persist user:", e);
    }
  };

  // On mount: try to hydrate session user from token -> profile endpoint
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/users/profile");
        // backend might return user at res.data or res.data.user; handle both
        const fetched = res.data?.user ?? res.data;
        setUser(fetched);
        persistUser(fetched);
      } catch (err) {
        clearAuthData();
        setUser(null);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Login: set token, set session user and namespaced profile store
  const login = async (username, password) => {
    try {
      const res = await api.post("/signin", { username, password });
      const { token, user: returnedUser } = res.data;
      setAuthToken(token);
      const authUser = returnedUser ?? res.data;
      setUser(authUser);
      persistUser(authUser);
      return authUser;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Login failed");
    }
  };

  // Logout: clear both auth session and any in-memory user
  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.warn("Logout error:", err.message || err);
    }
    clearAuthData();
    setUser(null);
  };

  // updateProfile: calls backend, updates session user, per-user profile store,
  // and returns the authoritative merged user object
  const updateProfile = async (data, field = null, isFormData = false) => {
    try {
      let res;

      if (isFormData) {
        // Send FormData; let axios set proper multipart boundary
        res = await api.put("/users/update-profile", data);
      } else {
        res = await api.put("/users/update-profile", data);
      }

      // Backend may return { message, user } or the user directly
      const returned = res.data?.user ?? res.data;
      if (!returned) throw new Error("No user returned from update");

      // Merge with current session user (prefer fields from returned)
      const mergedUser = { ...(user || {}), ...returned };

      // Update session and per-user storage
      setUser(mergedUser);
      persistUser(mergedUser);

      return mergedUser;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Profile update failed");
    }
  };

  // refreshUser: re-fetch authoritative profile from the server and persist
  const refreshUser = async () => {
    try {
      const res = await api.get("/users/profile");
      const fetched = res.data?.user ?? res.data;
      setUser(fetched);
      persistUser(fetched);
      return fetched;
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
