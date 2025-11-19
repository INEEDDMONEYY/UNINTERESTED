import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import {
  Loader2,
  CheckCircle,
  XCircle,
  User,
  Key,
  Image,
  FileText,
} from "lucide-react";

export default function UpdateProfile() {
  const { user, updateProfile } = useContext(UserContext);

  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePic, setProfilePic] = useState(null);
  const [loadingField, setLoadingField] = useState(null);
  const [toast, setToast] = useState(null);

  const handleUpdate = async (field) => {
    if (!field) return;

    let data;
    let isFormData = false;

    if (field === "profilePic") {
      // ProfilePic requires FormData
      data = new FormData();
      if (profilePic) {
        data.append("profilePic", profilePic);
        isFormData = true;
      }
    } else {
      // Username, password, bio → plain JSON
      data = {};
      if (field === "username") data.username = username;
      if (field === "password") data.password = password;
      if (field === "bio") data.bio = bio;
    }

    try {
      setLoadingField(field);
      await updateProfile(data, field, isFormData);

      setToast({
        type: "success",
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`,
      });

      if (field === "password") setPassword("");
      if (field === "profilePic") setProfilePic(null);
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        message: err.message || "Failed to update profile",
      });
    } finally {
      setLoadingField(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="relative bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-6 w-full max-w-2xl mx-auto space-y-8 border border-white">
      {toast && (
        <div
          className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-white text-sm ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <XCircle size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Profile Picture */}
      <section className="flex flex-col sm:flex-row items-center gap-4 border-b border-pink-100 pb-6">
        <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden border-2 border-pink-400 shadow">
          <img
            src={
              profilePic
                ? URL.createObjectURL(profilePic)
                : user?.profilePic || "https://via.placeholder.com/96"
            }
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 space-y-3 w-full">
          <label className="flex items-center gap-2 font-medium text-gray-700">
            <Image size={18} className="text-pink-600" />
            Update Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])}
            className="w-full border border-pink-200 rounded px-3 py-2 bg-white"
          />
          <button
            type="button"
            disabled={loadingField === "profilePic"}
            onClick={() => handleUpdate("profilePic")}
            className={`flex items-center justify-center gap-2 bg-pink-600 text-white px-4 py-2 rounded transition ${
              loadingField === "profilePic"
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-pink-700"
            }`}
          >
            {loadingField === "profilePic" ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "Save Picture"
            )}
          </button>
        </div>
      </section>

      {/* Username */}
      <section className="space-y-3 border-b border-pink-100 pb-6">
        <label className="flex items-center gap-2 font-medium text-gray-700">
          <User size={18} className="text-pink-600" />
          Update Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-pink-200 rounded px-3 py-2 bg-white"
        />
        <button
          type="button"
          disabled={loadingField === "username"}
          onClick={() => handleUpdate("username")}
          className={`flex items-center justify-center gap-2 bg-pink-600 text-white px-4 py-2 rounded transition ${
            loadingField === "username"
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-pink-700"
          }`}
        >
          {loadingField === "username" ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            "Save Username"
          )}
        </button>
      </section>

      {/* Password */}
      <section className="space-y-3 border-b border-pink-100 pb-6">
        <label className="flex items-center gap-2 font-medium text-gray-700">
          <Key size={18} className="text-pink-600" />
          Update Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-pink-200 rounded px-3 py-2 bg-white"
          placeholder="Enter new password"
        />
        <button
          type="button"
          disabled={loadingField === "password"}
          onClick={() => handleUpdate("password")}
          className={`flex items-center justify-center gap-2 bg-pink-600 text-white px-4 py-2 rounded transition ${
            loadingField === "password"
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-pink-700"
          }`}
        >
          {loadingField === "password" ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            "Save Password"
          )}
        </button>
      </section>

      {/* Bio */}
      <section className="space-y-3">
        <label className="flex items-center gap-2 font-medium text-gray-700">
          <FileText size={18} className="text-pink-600" />
          Update Profile Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="w-full border border-pink-200 rounded px-3 py-2 bg-white resize-none"
          placeholder="Tell us a bit about yourself..."
        />
        <button
          type="button"
          disabled={loadingField === "bio"}
          onClick={() => handleUpdate("bio")}
          className={`flex items-center justify-center gap-2 bg-pink-600 text-white px-4 py-2 rounded transition ${
            loadingField === "bio"
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-pink-700"
          }`}
        >
          {loadingField === "bio" ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            "Save Bio"
          )}
        </button>
      </section>
    </div>
  );
}
