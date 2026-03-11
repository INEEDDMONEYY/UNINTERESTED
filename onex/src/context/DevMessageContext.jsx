import { createContext, useContext, useEffect, useState } from "react";

// 1️⃣ Create Context
const DevMessageContext = createContext();

// 2️⃣ Context Provider
export const DevMessageProvider = ({ children }) => {
  const [devMessage, setDevMessage] = useState(
    "Welcome to Mystery Mansion where all your naughty fantasies can be explored 🌟"
  );
  const [loading, setLoading] = useState(true);

  // Fetch dev message from backend on mount
  useEffect(() => {
    const fetchDevMessage = async () => {
      try {
        const res = await fetch(
          "https://uninterested.onrender.com/api/admin/settings",
          { method: "GET", credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch dev message");
        const data = await res.json();
        const message = data.data?.devMessage;
        if (message) setDevMessage(message);
      } catch (err) {
        console.error("Error fetching dev message:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevMessage();
  }, []);

  // Function to update message
  const updateDevMessage = async (newMessage) => {
    try {
      const res = await fetch(
        "https://uninterested.onrender.com/api/admin/settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ field: "devMessage", value: newMessage }),
        }
      );

      if (!res.ok) throw new Error("Failed to update dev message");
      setDevMessage(newMessage); // Update context state
      return true;
    } catch (err) {
      console.error("Error updating dev message:", err);
      return false;
    }
  };

  return (
    <DevMessageContext.Provider
      value={{ devMessage, updateDevMessage, loading }}
    >
      {children}
    </DevMessageContext.Provider>
  );
};

// 3️⃣ Custom hook for convenience
export const useDevMessage = () => {
  const context = useContext(DevMessageContext);
  if (!context) {
    console.warn("useDevMessage must be used within a DevMessageProvider");
    return {
      devMessage: "Welcome to Mystery Mansion where all your naughty fantasies can be explored 🌟",
      updateDevMessage: async () => false,
      loading: true,
    };
  }
  return context;
};