import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [promotionDuration, setPromotionDuration] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ""}/api/users`);
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handlePromoteUser = async () => {
    // 🔗 Connect this to your backend promotion route
    console.log("Promoting user:", selectedUser, "for", promotionDuration);
    // await axios.post('/api/promote', { userId: selectedUser, duration: promotionDuration });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h6 className="text-xl font-bold text-pink-700 mb-4">User Management</h6>

      {/* ✅ Scrollable User Grid */}
      <div className="overflow-x-auto mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-w-[600px]">
          {loading ? (
            <p className="text-gray-500">Loading users...</p>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm"
              >
                <h3 className="text-black font-semibold text-md mb-1">{user.username}</h3>
                <p className="text-gray-600 text-sm">{user.email}</p>
                <p className="text-gray-500 text-xs mt-1">ID: {user._id}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No users found.</p>
          )}
        </div>
      </div>

      {/* ✅ Promotion Settings */}
      <div className="bg-white border border-pink-200 rounded-lg p-6 shadow-sm space-y-4">
        <h6 className="text-lg font-semibold text-pink-600 mb-2">Promotion Settings</h6>

        {/* Promote User Account */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select user to promote</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
          <button
            onClick={handlePromoteUser}
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
          >
            Save
          </button>
        </div>

        {/* Promotion Duration */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <select
            value={promotionDuration}
            onChange={(e) => setPromotionDuration(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select promotion duration</option>
            <option value="24hrs">24hrs</option>
            <option value="2days">2 days</option>
            <option value="4days">4 days</option>
            <option value="1week">1 week</option>
          </select>
          <button
            onClick={handlePromoteUser}
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
