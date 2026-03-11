import { useState } from "react";
import { ShieldCheck, Save } from "lucide-react";
import api from "../../../utils/api";

export default function RestrictUserSetting({ users }) {
  const [userId, setUserId] = useState("");
  const [restriction, setRestriction] = useState("");

  const handleRestrict = async () => {
    if (!userId || !restriction) {
      return alert("Please select a user and restriction.");
    }

    try {
      const { data } = await api.put("/admin/settings", {
        field: "roleRestriction",
        value: { userId, restriction },
      });

      if (!data?.success) {
        throw new Error(data?.error || "Failed to restrict user");
      }

      const successMsg =
        userId === "__ALL_USERS__"
          ? `Restriction applied to all non-admin users: ${restriction}`
          : `Restriction applied: ${restriction}`;

      alert(successMsg);
      setUserId("");
      setRestriction("");
    } catch (err) {
      alert(err?.response?.data?.error || err.message || "Failed to restrict user");
    }
  };

  return (
    <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <ShieldCheck size={18} /> Restrict Role Access
      </label>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select a user</option>
          <option value="__ALL_USERS__">All Users (non-admin)</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.username}
            </option>
          ))}
        </select>

        <select
          value={restriction}
          onChange={(e) => setRestriction(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select restriction</option>
          <option value="no-posting">Restrict posting</option>
          <option value="no-comments">Restrict commenting</option>
          <option value="read-only">Read-only access</option>
        </select>

        <button
          onClick={handleRestrict}
          className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
        >
          <Save size={16} /> Save
        </button>
      </div>
    </div>
  );
}