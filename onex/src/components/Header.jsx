import { useEffect, useState } from 'react';

export default function Header() {
  const [devMessage, setDevMessage] = useState('Respect all members on the platform, Post often and get rewarded 🌟');
  const [currentDate, setCurrentDate] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Format current date
    const today = new Date();
    const formatted = today.toDateString(); // e.g. "Thu Oct 02 2025"
    setCurrentDate(formatted);

    // Optional: fetch devMessage from backend or localStorage
    const storedMessage = localStorage.getItem('devMessage');
    if (storedMessage) setDevMessage(storedMessage);
  }, []);

  return (
    <header className="bg-pink-100 text-black py-4 px-6 shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
      {/* Greeting */}
      <div className="text-lg font-semibold">
        Welcome, <span className="text-pink-700">{user.username || 'Guest'}</span>
      </div>

      {/* Date */}
      <div className="text-sm text-gray-700">{currentDate}</div>

      {/* Dev Message */}
      <div className="text-sm italic text-gray-800 text-center md:text-right">
        {devMessage}
      </div>
    </header>
  );
}
