import { useState } from "react";
import { Ban } from "lucide-react";

export default function SuspendUserSetting({ users }) {
  const [userId, setUserId] = useState("");

  const suspendUser = async () => {
    if (!userId) return alert("Select a user");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ field: "suspendUserId", value: userId }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to suspend user");
      }

      alert("User suspended");
      setUserId("");
    } catch (err) {
      alert(err.message || "Failed to suspend user");
    }
  };

  return (
    <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <Ban size={18} /> Suspend User Account
      </label>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.username}
            </option>
          ))}
        </select>

        <button
          onClick={suspendUser}
          className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
        >
          <Ban size={16} /> Suspend
        </button>
      </div>
    </div>
  );
}