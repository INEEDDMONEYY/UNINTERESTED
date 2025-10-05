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
  Upload,
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
  const [uploading, setUploading] = useState(false);

  // ✅ PUT handler for admin settings
  const updateSetting = async (field, value) => {
    try {
      const res = await fetch("https://uninterested.onrender.com/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ field, value }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update setting");
      const data = await res.json();
      alert(`${field} updated successfully!`);
      console.log("✅ Updated:", data);

      if (field === "devMessage") {
        localStorage.setItem("devMessage", value);
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) {
      console.error("❌ Error updating setting:", err);
      alert("Failed to update setting.");
    }
  };

  // ✅ Handle admin credentials update
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

      if (!res.ok) throw new Error("Failed to update admin credentials");
      const data = await res.json();
      alert("✅ Admin credentials updated!");
      console.log("Updated credentials:", data);
    } catch (err) {
      console.error("❌ Error updating credentials:", err);
      alert("Failed to update credentials.");
    }
  };

  // ✅ NEW: Handle profile picture upload
  const handleProfileUpload = async () => {
    if (!profilePic) return alert("Please select a file first!");

    const formData = new FormData();
    formData.append("profilePic", profilePic);

    setUploading(true);
    try {
      const res = await fetch(
        "https://uninterested.onrender.com/api/admin/profile-picture",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to upload profile picture");
      const data = await res.json();
      setPreview(data.url);
      alert("✅ Profile picture updated!");
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://uninterested.onrender.com/api/admin/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.users || data);
      } catch (err) {
        console.error("❌ Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Delete user
  const deleteUser = async () => {
    if (!selectedUserId) return alert("Please select a user to delete.");
    if (!window.confirm("Are you sure?")) return;

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
    } catch (err) {
      console.error("❌ Error deleting user:", err);
    }
  };

  return (
    <div className="p-4 w-full max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-pink-700 mb-4">Admin Settings</h1>

      <SettingCard
        icon={<ShieldCheck size={18} />}
        title="Restrict Role Access"
        value={roleRestriction}
        onChange={(e) => setRoleRestriction(e.target.value)}
        onSave={() => updateSetting("roleRestriction", roleRestriction)}
        placeholder="e.g. restrict 'user' from posting"
      />

      <SettingCard
        icon={<Ban size={18} />}
        title="Suspend User Account"
        value={suspendUserId}
        onChange={(e) => setSuspendUserId(e.target.value)}
        onSave={() => updateSetting("suspendUserId", suspendUserId)}
        placeholder="Enter user ID to suspend"
      />

      <SettingTextArea
        icon={<MessageSquare size={18} />}
        title="Homepage Developer Message"
        value={devMessage}
        onChange={(e) => setDevMessage(e.target.value)}
        onSave={() => updateSetting("devMessage", devMessage)}
        placeholder="Update the homepage message"
      />

      {/* ✅ Admin Credentials */}
      <SettingCard
        icon={<User size={18} />}
        title="Update Admin Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onSave={saveCredentials}
        placeholder="Enter new username"
      />

      <SettingCard
        icon={<Lock size={18} />}
        title="Reset Admin Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        onSave={saveCredentials}
        placeholder="Enter new password"
      />

      {/* ✅ Profile Picture Upload with Button */}
      <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Image size={18} /> Update Profile Picture
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setProfilePic(file);
            if (file) setPreview(URL.createObjectURL(file));
          }}
          className="block w-full text-sm text-gray-700 mb-3"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-2 w-24 h-24 rounded-full object-cover border"
          />
        )}
        <button
          onClick={handleProfileUpload}
          disabled={uploading}
          className={`mt-3 flex items-center gap-2 ${
            uploading ? "bg-gray-400" : "bg-pink-600 hover:bg-pink-700"
          } text-white px-4 py-2 rounded transition`}
        >
          <Upload size={16} /> {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* ✅ Delete User */}
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
    </div>
  );
}

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
