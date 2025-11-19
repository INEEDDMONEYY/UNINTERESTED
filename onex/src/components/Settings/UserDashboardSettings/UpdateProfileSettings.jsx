import { useState, useContext, useEffect } from "react";
import {
  User,
  Key,
  Image,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { UserContext } from "../../../context/UserContext";

export default function UpdateProfileSettings({ onProfileUpdate, user }) {
  const { updateProfile } = useContext(UserContext);

  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState(user?.bio || "");

  // Local file and preview handling
  const [profilePic, setProfilePic] = useState(null);      // selected file
  const [previewUrl, setPreviewUrl] = useState(null);      // blob or hosted URL

  const [loadingField, setLoadingField] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync incoming user prop to inputs and clear local preview when user changes
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setBio(user.bio || "");
      setProfilePic(null);

      // Prefer the incoming user's hosted URL when available
      if (user.profilePic) {
        setPreviewUrl(user.profilePic);
      } else {
        setPreviewUrl(null);
      }
    }
  }, [user]);

  // Revoke blob URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleUpdate = async (field, payload = null) => {
    if (!field) return;

    let data;
    let isFormData = false;

    if (field === "availability") {
      data = payload;
    } else if (field === "profilePic") {
      // Send multipart FormData for profilePic
      data = new FormData();
      if (profilePic) {
        data.append("profilePic", profilePic);
        isFormData = true;
      }
      // Include other fields if you want them updated together
      // data.append("username", username);
      // data.append("bio", bio);
    } else {
      // Other fields as JSON
      data = {};
      if (field === "username") data.username = username;
      if (field === "password") data.password = password;
      if (field === "bio") data.bio = bio;
    }

    try {
      setLoadingField(field);

      // Pass isFormData so UserContext sets multipart headers
      const updatedUser = await updateProfile(data, field, isFormData);

      // Mirror updated user for any listeners that read this key
      localStorage.setItem("userProfile", JSON.stringify(updatedUser));

      setToast({
        type: "success",
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`,
      });

      // Reset fields and sync with server response
      if (field === "password") setPassword("");
      if (field === "username") setUsername(updatedUser.username || "");
      if (field === "bio") setBio(updatedUser.bio || "");

      if (field === "profilePic") {
        // Switch preview from local blob to the hosted URL returned by backend
        if (updatedUser.profilePic) {
          // Revoke old blob to avoid leaks
          if (previewUrl && previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
          }
          setPreviewUrl(updatedUser.profilePic);
        }
        setProfilePic(null); // clear selected file
      }

      if (onProfileUpdate) onProfileUpdate();
    } catch (err) {
      console.error("Error updating profile:", err.message || err);
      setToast({
        type: "error",
        message: err.message || "Failed to update profile.",
      });
    } finally {
      setLoadingField(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleFileChange = (file) => {
    setProfilePic(file);

    // Create immediate preview for selected file
    if (file) {
      // Revoke previous blob before creating a new one
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      const blobUrl = URL.createObjectURL(file);
      setPreviewUrl(blobUrl);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-white text-sm transition-all ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Profile Picture */}
      <section className="flex flex-col sm:flex-row items-center gap-4 border-b border-pink-100 pb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-pink-400 shadow">
          <img
            src={previewUrl || user?.profilePic || "https://via.placeholder.com/96"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-3 w-full">
          <label className="flex items-center gap-2 font-medium text-gray-700">
            <Image size={18} className="text-pink-600" /> Update Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files[0])}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800"
          />
          <button
            type="button"
            disabled={loadingField === "profilePic" || !profilePic}
            onClick={() => handleUpdate("profilePic")}
            className={`flex items-center justify-center gap-2 bg-pink-600 text-white px-4 py-2 rounded transition ${
              loadingField === "profilePic" || !profilePic
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
          <User size={18} className="text-pink-600" /> Update Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800"
          placeholder="Update username"
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
          <Key size={18} className="text-pink-600" /> Update Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800"
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
      <section className="space-y-3 border-b border-pink-100 pb-6">
        <label className="flex items-center gap-2 font-medium text-gray-700">
          <FileText size={18} className="text-pink-600" /> Update Profile Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 resize-none"
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
    </>
  );
}
