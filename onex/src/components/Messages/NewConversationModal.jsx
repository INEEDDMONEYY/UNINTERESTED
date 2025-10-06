import { useEffect, useState } from "react";
import { X, Send } from "lucide-react";

export default function NewConversationModal({ onClose, onCreated }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all users (to select from)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error loading users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Create conversation
  const handleCreate = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ recipientId: selectedUser }),
      });
      if (!res.ok) throw new Error("Failed to create conversation");
      const newConv = await res.json();
      onCreated(newConv);
      onClose();
    } catch (err) {
      console.error("Create conversation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 border border-pink-600/40">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Start New Conversation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-pink-400 transition">
            <X size={20} />
          </button>
        </div>

        {/* Dropdown */}
        <label className="block text-sm text-gray-300 mb-2">Select a user:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full bg-gray-800 text-white p-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-pink-500 mb-4"
        >
          <option value="">-- Choose User --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!selectedUser || loading}
            className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Send size={16} />
            {loading ? "Creating..." : "Start Chat"}
          </button>
        </div>
      </div>
    </div>
  );
}
