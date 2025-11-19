import { useEffect, useState } from "react";

export default function UserProfileHeader({ refreshKey }) {
  const [user, setUser] = useState({ username: "", bio: "" });

  useEffect(() => {
    // ✅ Always reload from localStorage when refreshKey changes
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        setUser(JSON.parse(savedProfile));
      } catch (err) {
        console.error("Failed to parse userProfile from localStorage:", err);
      }
    }
  }, [refreshKey]); // re-run whenever refreshKey changes

  return (
    <div className="w-full max-w-3xl mx-auto rounded-xl shadow-lg bg-white p-6 text-center">
      {/* Username with gradient */}
      <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent mb-4">
        {user.username || "Unnamed User"}
      </h1>

      {/* Bio Section */}
      <div className="text-sm md:text-base text-gray-700 max-w-xl mx-auto">
        {user.bio ? user.bio : "No bio available."}
      </div>
    </div>
  );
}

