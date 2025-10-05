import { useEffect, useState } from "react";

export default function Header() {
  const [devMessage, setDevMessage] = useState("Loading message...");
  const [currentDate, setCurrentDate] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today.toDateString());

    const fetchDevMessage = async () => {
      try {
        const res = await fetch("https://uninterested.onrender.com/api/admin/settings", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        setDevMessage(data.devMessage || "Welcome to the platform 🌟");

        // Optionally store locally
        localStorage.setItem("devMessage", data.devMessage);
      } catch (err) {
        console.error("Error fetching dev message:", err);
        // fallback to last saved message
        const stored = localStorage.getItem("devMessage");
        if (stored) setDevMessage(stored);
        else setDevMessage("Welcome to the platform 🌟");
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
