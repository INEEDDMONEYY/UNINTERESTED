import { useState } from "react";
import { ShieldCheck, Save } from "lucide-react";

export default function RestrictUserSetting({ users }) {
  const [userId, setUserId] = useState("");
  const [restriction, setRestriction] = useState("");

  const handleRestrict = async () => {
    if (!userId || !restriction) {
      return alert("Please select a user and restriction.");
    }

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          field: "roleRestriction",
          value: { userId, restriction },
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to restrict user");
      }

      alert(`Restriction applied: ${restriction}`);
      setUserId("");
      setRestriction("");
    } catch (err) {
      alert(err.message || "Failed to restrict user");
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