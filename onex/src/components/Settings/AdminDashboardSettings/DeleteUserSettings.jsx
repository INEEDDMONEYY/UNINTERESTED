import { useState } from "react";
import { Trash2 } from "lucide-react";
import api from "../../../utils/api";


export default function DeleteUserSetting({ users }) {
  const [userId, setUserId] = useState("");
  const [reason, setReason] = useState("");

  const deleteUser = async () => {
    if (!userId) return alert("Select a user");
    if (!reason) return alert("Select a reason for deletion");

    if (!window.confirm("Are you sure?")) return;

    try {
      // Send reason as query param or in body (adjust backend as needed)
      const { data } = await api.delete(`/admin/users/${userId}`, { data: { reason } });

      alert(
        `User deleted.\nMessage to user: Your account has been deleted by our team due to ${reason}.`
      );
      setUserId("");
      setReason("");
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to delete user");
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

        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select reason</option>
          <option value="Intent to use fake or stolen content">Intent to use fake or stolen content</option>
          <option value="Fake account">Fake account</option>
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