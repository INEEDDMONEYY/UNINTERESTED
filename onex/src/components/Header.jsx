import { useEffect, useState } from "react";
import { useDevMessage } from "../context/DevMessageContext";
import { motion } from "framer-motion";

export default function Header() {
  const { devMessage } = useDevMessage();
  const [currentDate, setCurrentDate] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today.toDateString());
  }, []);

  return (
    <header className="bg-pink-100 text-black py-4 px-6 shadow-md flex flex-col md:flex-row justify-between items-center gap-4 border border-black rounded-b-lg">
      <div className="text-lg font-semibold">
        Welcome, <span className="text-pink-700">{user.username || "Guest"}</span>
      </div>
      <div className="text-sm text-gray-700">{currentDate}</div>

      {/* Animated Dev Message */}
      <motion.div
        className="text-sm italic text-white text-center md:text-right border border-black rounded-sm bg-pink-600 px-2"
        animate={{
          boxShadow: [
            "0 0 5px rgba(255,192,203,0.4)",
            "0 0 15px rgba(255,192,203,0.8)",
            "0 0 5px rgba(255,192,203,0.4)"
          ],
          scale: [1, 1.03, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {devMessage}
      </motion.div>
    </header>
  );
}