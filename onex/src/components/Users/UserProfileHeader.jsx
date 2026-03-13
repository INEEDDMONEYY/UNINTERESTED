import { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../../context/UserContext";
import { Camera, Pencil } from "lucide-react";

/*
  UserProfileHeader
*/

export default function UserProfileHeader({
  refreshKey = 0,
  propUser = null,
  userId: propUserId = null,
}) {
  const { user: ctxUser, updateProfile } = useContext(UserContext);

  const displayUserId = propUser?._id || propUser?.id || propUserId || null;

  const [user, setUser] = useState({
    username: "",
    bio: "",
    profilePic: null,
    bannerPic: null,
  });

  const [banner, setBanner] = useState(null);
  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [savingBanner, setSavingBanner] = useState(false);
  const [savingBio, setSavingBio] = useState(false);

  const fileInputRef = useRef(null);
  const isOwner = Boolean(ctxUser?._id && displayUserId && String(ctxUser._id) === String(displayUserId));

  const readProfileFromStorage = (id) => {
    if (!id) return null;
    const key = `userProfile_${id}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error(`Failed to parse profile for key ${key}:`, err);
      return null;
    }
  };

  const readBannerFromStorage = (id) => {
    if (!id) return null;
    const key = `userBanner_${id}`;
    return localStorage.getItem(key);
  };

  useEffect(() => {
    let profileData = null;

    if (propUser) {
      profileData = propUser;
    } else if (displayUserId) {
      profileData = readProfileFromStorage(displayUserId);
      if (!profileData && ctxUser && String(ctxUser._id) === String(displayUserId)) {
        profileData = ctxUser;
      }
    } else if (ctxUser && !displayUserId) {
      profileData = ctxUser;
    }

    if (profileData) {
      setUser({
        username: profileData.username || "",
        bio: profileData.bio || "",
        profilePic: profileData.profilePic || null,
        bannerPic: profileData.bannerPic || null,
      });
      setBioInput(profileData.bio || "");
      if (profileData.bannerPic) {
        setBanner(profileData.bannerPic);
      }
    }

    if (!profileData?.bannerPic) {
      const savedBanner = readBannerFromStorage(displayUserId);
      if (savedBanner) setBanner(savedBanner);
    }

  }, [refreshKey, propUser, displayUserId, ctxUser]);

  const handleBannerClick = () => {
    if (!isOwner) return;
    fileInputRef.current?.click();
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isOwner) {
      alert("You can only update your own banner.");
      return;
    }

    setSavingBanner(true);

    try {
      const formData = new FormData();
      formData.append("bannerPic", file);
      const updatedUser = await updateProfile(formData, null, true);
      const updatedBanner = updatedUser?.bannerPic || null;

      if (updatedBanner) {
        setBanner(updatedBanner);
      }

      setUser((prev) => ({
        ...prev,
        ...updatedUser,
      }));

      alert("Banner updated.");
    } catch (err) {
      alert(err.message || "Failed to update banner");
    } finally {
      setSavingBanner(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleBioSave = async () => {
    if (!isOwner) {
      alert("You can only update your own bio.");
      return;
    }

    setSavingBio(true);

    try {
      const updatedUser = await updateProfile({ bio: bioInput });
      setUser((prev) => ({
        ...prev,
        ...updatedUser,
      }));
      setEditingBio(false);
    } catch (err) {
      alert(err.message || "Failed to update bio");
    } finally {
      setSavingBio(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">

      {/* Banner */}
      <div
        className="relative h-36 md:h-44 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400"
        style={
          banner
            ? {
                backgroundImage: `url(${banner})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >

        {/* Edit Banner Button */}
        {isOwner && (
          <button
            onClick={handleBannerClick}
            disabled={savingBanner}
            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur transition disabled:opacity-60"
          >
            <Camera size={18} />
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleBannerChange}
        />
      </div>

      {/* Profile Section */}
      <div className="px-6 pb-6 relative">

        {/* Profile Image */}
        <div className="absolute -top-14 left-6">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt={user.username || "Profile"}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow"
            />
          ) : (
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-300 border-4 border-white shadow flex items-center justify-center text-gray-600 text-sm">
              No Photo
            </div>
          )}
        </div>

        {/* Username + Bio */}
        <div className="pt-16 md:pt-20">

          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {user.username || "Unnamed User"}
          </h1>

          {/* Bio Section */}
          <div className="mt-3 max-w-xl">

            {!editingBio ? (
              <div className="flex items-start gap-2">
                <p className="text-gray-600 text-sm md:text-base flex-1">
                  {user.bio || "No bio available."}
                </p>

                {isOwner && (
                  <button
                    onClick={() => setEditingBio(true)}
                    className="text-gray-500 hover:text-pink-600 transition"
                  >
                    <Pencil size={16} />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2">

                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={3}
                />

                <div className="flex gap-2">
                  <button
                    onClick={handleBioSave}
                    disabled={savingBio}
                    className="bg-pink-600 text-white text-xs px-3 py-1 rounded hover:bg-pink-700 transition disabled:opacity-60"
                  >
                    {savingBio ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={() => {
                      setEditingBio(false);
                      setBioInput(user.bio);
                    }}
                    className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}