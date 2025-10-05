import { useEffect, useState } from "react";

export default function Header() {
  const [devMessage, setDevMessage] = useState(
    localStorage.getItem("devMessage") || "Welcome to the platform 🌟"
  );
  const [currentDate, setCurrentDate] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today.toDateString());

    const fetchDevMessage = async () => {
      try {
        const res = await fetch(
          "https://uninterested.onrender.com/api/admin/settings",
          { method: "GET", credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();

        // Expecting { settings: { devMessage: "..."} } or { devMessage: "..." }
        const message = data.devMessage || data.settings?.devMessage;
        if (message) {
          setDevMessage(message);
          localStorage.setItem("devMessage", message);
        }
      } catch (err) {
        console.error("Error fetching dev message:", err);
      }
    };

    fetchDevMessage();
  }, []);

  return (
    <header className="bg-pink-100 text-black py-4 px-6 shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="text-lg font-semibold">
        Welcome, <span className="text-pink-700">{user.username || "Guest"}</span>
      </div>
      <div className="text-sm text-gray-700">{currentDate}</div>
      <div className="text-sm italic text-gray-800 text-center md:text-right">
        {devMessage}
      </div>
    </header>
  );
}
