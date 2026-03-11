import { useState } from "react";
import { Image, Upload } from "lucide-react";

export default function ProfilePictureSetting({ onProfileUpdate, currentProfile }) {
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(currentProfile || null);
  const [uploading, setUploading] = useState(false);

  const handleProfileUpload = async () => {
    if (!profilePic) return alert("Please select a file first!");

    const formData = new FormData();
    formData.append("profilePic", profilePic);

    setUploading(true);

    try {
      const res = await fetch("/api/admin/profile/picture", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Upload failed");
      }

      const data = await res.json();

      // Update preview immediately
      setPreview(data.url);

      // Update localStorage so drawer uses new image
      localStorage.setItem("profilePicture", data.url);

      // Lift state to AdminDashboard for drawer & user context
      if (typeof onProfileUpdate === "function") {
        onProfileUpdate(data.url);
      }

      alert("Profile picture updated!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload profile picture.");
    } finally {
      setUploading(false);
      setProfilePic(null);
    }
  };

  return (
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
  );
}