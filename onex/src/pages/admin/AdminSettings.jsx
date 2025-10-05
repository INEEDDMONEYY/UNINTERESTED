import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Ban,
  MessageSquare,
  Save,
  User,
  Trash2,
  Lock,
  Image,
} from "lucide-react";

export default function AdminSettings() {
  const [roleRestriction, setRoleRestriction] = useState("");
  const [suspendUserId, setSuspendUserId] = useState("");
  const [devMessage, setDevMessage] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  // ✅ Keep your existing update logic
  const updateSetting = async (field, value) => {
    try {
      const res = await fetch("https://uninterested.onrender.com/api/admin/settings", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update setting");
      const data = await res.json();
      alert(`${field} updated successfully!`);
      console.log("✅ Updated:", data);

      if (field === "devMessage") {
        localStorage.setItem("devMessage", value);
      }
    } catch (err) {
      console.error("❌ Error updating setting:", err);
      alert("Failed to update setting.");
    }
  };

  // ✅ Fetch all users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://uninterested.onrender.com/api/admin/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("❌ Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Delete user logic
  const deleteUser = async () => {
    if (!selectedUserId) return alert("Please select a user to delete.");
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(
        `https://uninterested.onrender.com/api/admin/user/${selectedUserId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete user");
      alert("User deleted successfully!");
      setUsers(users.filter((u) => u._id !== selectedUserId));
      setSelectedUserId("");
    } catch (err) {
      console.error("❌ Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  // ✅ Upload profile picture logic
  const uploadProfilePicture = async () => {
    if (!profilePic) return alert("Please select an image first.");
    const formData = new FormData();
    formData.append("profilePic", profilePic);

    try {
      const res = await fetch(
        "https://uninterested.onrender.com/api/admin/profile-picture",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Failed to upload image");
      const data = await res.json();
      alert("Profile picture updated successfully!");
      setPreview(data.url);
    } catch (err) {
      console.error("❌ Error uploading profile picture:", err);
      alert("Failed to upload profile picture.");
    }
  };

  // ✅ Preview selected image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-4 w-full max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-pink-700 mb-4">Admin Settings</h1>

      {/* Restrict Role Access */}
      <SettingCard
        icon={<ShieldCheck size={18} />}
        title="Restrict Role Access"
        placeholder="e.g. restrict 'user' from posting"
        value={roleRestriction}
        onChange={(e) => setRoleRestriction(e.target.value)}
        onSave={() => updateSetting("roleRestriction", roleRestriction)}
      />

      {/* Suspend User */}
      <SettingCard
        icon={<Ban size={18} />}
        title="Suspend User Account"
        placeholder="Enter user ID to suspend"
        value={suspendUserId}
        onChange={(e) => setSuspendUserId(e.target.value)}
        onSave={() => updateSetting("suspendUserId", suspendUserId)}
      />

      {/* Developer Message */}
      <SettingTextArea
        icon={<MessageSquare size={18} />}
        title="Homepage Developer Message"
        placeholder="Update the message shown on homepage"
        value={devMessage}
        onChange={(e) => setDevMessage(e.target.value)}
        onSave={() => updateSetting("devMessage", devMessage)}
      />

      {/* Update Username */}
      <SettingCard
        icon={<User size={18} />}
        title="Update Admin Username"
        placeholder="Enter new username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onSave={() => updateSetting("username", username)}
      />

      {/* Reset Password */}
      <SettingCard
        icon={<Lock size={18} />}
        title="Reset Admin Password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        onSave={() => updateSetting("password", newPassword)}
      />

      {/* Delete User Dropdown */}
      <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Trash2 size={18} /> Delete User Account
        </label>
        <div className="flex items-center gap-3">
          <select
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
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

      {/* Profile Picture Upload */}
      <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Image size={18} /> Update Profile Picture
        </label>
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          <button
            onClick={uploadProfilePicture}
            className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
          >
            <Save size={16} /> Save
          </button>
        </div>
        {preview && (
          <img
            src={preview}
            alt="Profile Preview"
            className="w-20 h-20 mt-3 rounded-full object-cover border-2 border-pink-300"
          />
        )}
      </div>
    </div>
  );
}

/* ✅ Small Reusable Components for Clean UI */
const SettingCard = ({ icon, title, value, onChange, onSave, placeholder }) => (
  <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
      {icon} {title}
    </label>
    <div className="flex items-center gap-3">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 border border-gray-300 rounded px-3 py-2"
      />
      <button
        onClick={onSave}
        className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
      >
        <Save size={16} /> Save
      </button>
    </div>
  </div>
);

const SettingTextArea = ({ icon, title, value, onChange, onSave, placeholder }) => (
  <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
      {icon} {title}
    </label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
      rows={4}
    />
    <button
      onClick={onSave}
      className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
    >
      <Save size={16} /> Save
    </button>
  </div>
);
