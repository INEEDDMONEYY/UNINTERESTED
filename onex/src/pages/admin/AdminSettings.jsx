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

export default function AdminSettings({ onProfileUpdate }) {
  const [users, setUsers] = useState([]);
  const [selectedUserForRestriction, setSelectedUserForRestriction] = useState("");
  const [restrictionType, setRestrictionType] = useState("");
  const [selectedUserForUnrestriction, setSelectedUserForUnrestriction] = useState("");
  const [unrestrictionType, setUnrestrictionType] = useState("");
  const [selectedUserForSuspend, setSelectedUserForSuspend] = useState("");
  const [selectedUserForDelete, setSelectedUserForDelete] = useState("");
  const [devMessage, setDevMessage] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch all users
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
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // PUT handler for admin settings
  const updateSetting = async (field, value, clearField) => {
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
      alert(`${field} updated successfully!`);
      if (clearField) clearField("");
      if (field === "devMessage") {
        localStorage.setItem("devMessage", value);
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) {
      console.error("Error updating setting:", err);
      alert("Failed to update setting.");
    }
  };

  // Restrict Role Access
  const handleRestrictUser = async () => {
    if (!selectedUserForRestriction || !restrictionType)
      return alert("Please select a user and restriction type.");

    await updateSetting("roleRestriction", {
      userId: selectedUserForRestriction,
      restriction: restrictionType,
    });
    setSelectedUserForRestriction("");
    setRestrictionType("");
  };

  // Unrestricted Role Access
  const handleUnrestrictUser = async () => {
    if (!selectedUserForUnrestriction || !unrestrictionType)
      return alert("Please select a user and unrestricted role.");

    await updateSetting("roleUnrestriction", {
      userId: selectedUserForUnrestriction,
      restriction: unrestrictionType,
    });
    setSelectedUserForUnrestriction("");
    setUnrestrictionType("");
  };

  // Suspend User
  const handleSuspendUser = async () => {
    if (!selectedUserForSuspend) return alert("Please select a user to suspend.");
    await updateSetting("suspendUserId", selectedUserForSuspend);
    setSelectedUserForSuspend("");
  };

  // Delete User
  const deleteUser = async () => {
    if (!selectedUserForDelete) return alert("Please select a user to delete.");
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    try {
      const res = await fetch(
        `https://uninterested.onrender.com/api/admin/user/${selectedUserForDelete}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete user");
      alert("User deleted successfully!");
      setUsers(users.filter((u) => u._id !== selectedUserForDelete));
      setSelectedUserForDelete("");
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Admin credentials update
  const saveCredentials = async (clearUsername, clearPassword) => {
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
      alert("Admin credentials updated!");
      if (clearUsername) clearUsername("");
      if (clearPassword) clearPassword("");
    } catch (err) {
      console.error("Error updating credentials:", err);
      alert("Failed to update credentials.");
    }
  };

  // Profile picture upload
  const handleProfileUpload = async () => {
    if (!profilePic) return alert("Please select a file first!");
    const formData = new FormData();
    formData.append("profilePic", profilePic);
    setUploading(true);
    try {
      const res = await fetch(
        "https://uninterested.onrender.com/api/admin/profile/picture",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: formData,
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to upload profile picture");
      const data = await res.json();
      setPreview(data.url);
      localStorage.setItem("profilePicture", data.url);

      if (typeof onProfileUpdate === "function") {
        onProfileUpdate(data.url);
      }

      alert("Profile picture updated!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 w-full max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-pink-700 mb-4">Admin Settings</h1>

      {/* Restrict Role Access */}
      <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <ShieldCheck size={18} /> Restrict Role Access
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            value={selectedUserForRestriction}
            onChange={(e) => setSelectedUserForRestriction(e.target.value)}
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
          <select
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            value={restrictionType}
            onChange={(e) => setRestrictionType(e.target.value)}
          >
            <option value="">Select restriction</option>
            <option value="no-posting">Restrict posting</option>
            <option value="no-comments">Restrict commenting</option>
            <option value="read-only">Read-only access</option>
          </select>
          <button
            onClick={handleRestrictUser}
            className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      {/* Unrestricted Role Access */}
      <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <ShieldCheck size={18} className="text-green-600" /> Unrestricted Role Access
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            value={selectedUserForUnrestriction}
            onChange={(e) => setSelectedUserForUnrestriction(e.target.value)}
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
          <select
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            value={unrestrictionType}
            onChange={(e) => setUnrestrictionType(e.target.value)}
          >
            <option value="">Select unrestricted role</option>
            <option value="full-access">Full Access</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Administrator</option>
          </select>
          <button
            onClick={handleUnrestrictUser}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      {/* Suspend User */}
      <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Ban size={18} /> Suspend User Account
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            value={selectedUserForSuspend}
            onChange={(e) => setSelectedUserForSuspend(e.target.value)}
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
          <button
            onClick={handleSuspendUser}
            className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
          >
            <Ban size={16} /> Suspend
          </button>
        </div>
      </div>

      {/* Homepage Developer Message */}
      <SettingTextArea
        icon={<MessageSquare size={18} />}
        title="Homepage Developer Message"
        value={devMessage}
        onChange={(e) => setDevMessage(e.target.value)}
        onSave={() => updateSetting("devMessage", devMessage, setDevMessage)}
        placeholder="Update the homepage message"
      />

      {/* Admin Credentials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SettingCard
          icon={<User size={18} />}
          title="Update Admin Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onSave={() => saveCredentials(setUsername, null)}
          placeholder="Enter new username"
        />
        <SettingCard
          icon={<Lock size={18} />}
          title="Reset Admin Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onSave={() => saveCredentials(null, setNewPassword)}
          placeholder="Enter new password"
        />
      </div>

      {/* Profile Picture Upload */}
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
          className={`mt-3 flex items-center gap-2 w-full sm:w-auto justify-center ${
            uploading ? "bg-gray-400" : "bg-pink-600 hover:bg-pink-700"
          } text-white px-4 py-2 rounded transition`}
        >
          <Upload size={16} /> {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Delete User */}
      <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Trash2 size={18} /> Delete User Account
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            value={selectedUserForDelete}
            onChange={(e) => setSelectedUserForDelete(e.target.value)}
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

/* Shared Components */
const SettingCard = ({ icon, title, value, onChange, onSave, placeholder }) => (
  <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
      {icon} {title}
    </label>
    <div className="flex flex-col sm:flex-row gap-3">
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
