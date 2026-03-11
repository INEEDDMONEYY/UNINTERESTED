import { useState } from "react";
import { User, Lock, Save } from "lucide-react";

export default function AdminCredentialsSetting() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const saveCredentials = async () => {
    try {
      const res = await fetch(
        "https://uninterested.onrender.com/api/admin/settings/credentials",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            username: username || undefined,
            password: newPassword || undefined,
          }),
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to update credentials");

      alert("Admin credentials updated!");
      setUsername("");
      setNewPassword("");
    } catch (err) {
      console.error("Error updating credentials:", err);
      alert("Failed to update credentials.");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {/* Username Update */}
      <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <User size={18} /> Update Admin Username
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter new username"
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />

          <button
            onClick={saveCredentials}
            className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      {/* Password Update */}
      <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Lock size={18} /> Reset Admin Password
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />

          <button
            onClick={saveCredentials}
            className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>

    </div>
  );
}