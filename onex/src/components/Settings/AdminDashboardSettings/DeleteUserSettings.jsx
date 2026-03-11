import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteUserSetting({ users }) {
  const [userId, setUserId] = useState("");

  const deleteUser = async () => {
    if (!userId) return alert("Select a user");

    if (!window.confirm("Are you sure?")) return;

    try {
      await fetch(
        `https://uninterested.onrender.com/api/admin/user/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("User deleted");
      setUserId("");
    } catch {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
      <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
        <Trash2 size={18} /> Delete User Account
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
          onClick={deleteUser}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}