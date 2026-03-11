import { useState } from "react";
import axios from "axios";

export default function PromoteAccountSettings({ users = [] }) {
  const [selectedUser, setSelectedUser] = useState("");
  const [promotionDuration, setPromotionDuration] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handlePromoteUser = async () => {
    if (!selectedUser || !promotionDuration) {
      alert("Please select a user and promotion duration");
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || ""}/api/admin/users/promote`,
        { userId: selectedUser, duration: promotionDuration },
        { withCredentials: true }
      );

      alert("User promotion updated successfully!");

      setSelectedUser("");
      setPromotionDuration("");
    } catch (err) {
      console.error("Failed to promote user:", err);
      alert(
        err.response?.data?.error ||
          "Failed to promote user. Make sure you are an admin."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-pink-200 rounded-lg p-6 shadow-sm w-full">

      {/* Title */}
      <h6 className="text-lg font-semibold text-pink-600 mb-4">
        Promote User Account
      </h6>

      {/* Responsive Form */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">

        {/* User Selector */}
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select user</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>

        {/* Duration Selector */}
        <select
          value={promotionDuration}
          onChange={(e) => setPromotionDuration(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Promotion duration</option>
          <option value="24hrs">24hrs</option>
          <option value="2days">2 days</option>
          <option value="4days">4 days</option>
          <option value="1week">1 week</option>
        </select>

        {/* Button */}
        <button
          onClick={handlePromoteUser}
          disabled={submitting}
          className="bg-pink-600 text-white px-5 py-2 rounded hover:bg-pink-700 transition whitespace-nowrap"
        >
          {submitting ? "Saving..." : "Save Promotion"}
        </button>

      </div>
    </div>
  );
}