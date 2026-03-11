import { useState } from "react";
import { ShieldCheck, Save } from "lucide-react";

export default function UnrestrictUserSetting({ users }) {
  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState("");

  const handleUnrestrictUser = async () => {
    if (!selectedUser || !role) {
      return alert("Please select a user and unrestricted role.");
    }

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          field: "roleUnrestriction",
          value: {
            userId: selectedUser,
          },
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to update role");
      }

      alert("User access updated successfully!");
      setSelectedUser("");
      setRole("");
    } catch (err) {
      console.error("Failed to unrestrict user:", err);
      alert("Failed to update role.");
    }
  };

  return (
    <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <ShieldCheck size={18} className="text-green-600" />
        Unrestricted Role Access
      </label>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Select User */}
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>

        {/* Role Selection */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select unrestricted role</option>
          <option value="remove">Remove restriction</option>
        </select>

        {/* Save */}
        <button
          onClick={handleUnrestrictUser}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          <Save size={16} /> Save
        </button>
      </div>
    </div>
  );
}