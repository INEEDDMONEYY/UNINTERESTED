import { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../../context/UserContext";
import { Camera, Pencil, CheckCircle2 } from "lucide-react";
import api from "../../utils/api";

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
    age: null,
    location: "",
    profilePic: null,
    bannerPic: null,
    activePromoExpiry: null,
  });

  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [savingBanner, setSavingBanner] = useState(false);
  const [savingBio, setSavingBio] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);

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
    let cancelled = false;

    const applyProfile = (profileData) => {
      if (!profileData || cancelled) return;
      setUser({
        username: profileData.username || "",
        bio: profileData.bio || "",
        age: profileData.age ?? null,
        location: profileData.location || "",
        profilePic: profileData.profilePic || null,
        bannerPic: profileData.bannerPic || null,
        activePromoExpiry: profileData.activePromoExpiry || null,
      });
      setBioInput(profileData.bio || "");
      setLocationInput(profileData.location || "");
      if (profileData.bannerPic) setBanner(profileData.bannerPic);
    };

    if (propUser) {
      applyProfile(propUser);
      return;
    }

    if (!displayUserId) {
      if (ctxUser) applyProfile(ctxUser);
      return;
    }

    // Owner: use context + localStorage for optimistic updates
    if (isOwner) {
      const cached = readProfileFromStorage(displayUserId);
      applyProfile(cached || ctxUser);
      if (!(cached || ctxUser)?.bannerPic) {
        const savedBanner = readBannerFromStorage(displayUserId);
        if (savedBanner) setBanner(savedBanner);
      }
      return;
    }

    // Non-owner viewer: always fetch from backend
    const cached = readProfileFromStorage(displayUserId);
    if (cached) applyProfile(cached); // show cached instantly, then refresh below

    setLoading(true);
    api
      .get(`/public/users/id/${displayUserId}`)
      .then((res) => {
        if (cancelled) return;
        const data = res.data;
        applyProfile(data);
        localStorage.setItem(`userProfile_${displayUserId}`, JSON.stringify(data));
      })
      .catch((err) => {
        console.error('Failed to fetch profile for user', displayUserId, err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [refreshKey, propUser, displayUserId, ctxUser, isOwner]);

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

  const handleLocationSave = async () => {
    if (!isOwner) {
      alert("You can only update your own location.");
      return;
    }

    setSavingLocation(true);

    try {
      const updatedUser = await updateProfile({ location: locationInput });
      setUser((prev) => ({
        ...prev,
        ...updatedUser,
      }));
      setEditingLocation(false);
    } catch (err) {
      alert(err.message || "Failed to update location");
    } finally {
      setSavingLocation(false);
    }
  };

  const isPromotedAccount = Boolean(
    user.activePromoExpiry && new Date(user.activePromoExpiry).getTime() > Date.now()
  );

  if (loading && !user.username) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
        <div className="h-36 md:h-44 bg-gray-200" />
        <div className="px-6 pb-6 pt-16">
          <div className="h-6 w-40 bg-gray-200 rounded mb-3" />
          <div className="h-4 w-64 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

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

          <h1 className="text-xl md:text-2xl font-bold text-gray-900 inline-flex items-center gap-2">
            <span>{user.username || "Unnamed User"}</span>
            <CheckCircle2
              size={18}
              className={isPromotedAccount ? "text-pink-500" : "text-gray-400"}
              aria-label={isPromotedAccount ? "Promoted account" : "Standard account"}
            />
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

            <div className="mt-3 space-y-2">
              {Number.isFinite(Number(user.age)) && Number(user.age) > 0 && (
                <p className="text-gray-700 text-sm md:text-base">
                  Age: {user.age}
                </p>
              )}

              {!editingLocation ? (
                <div className="flex items-start gap-2">
                  <p className="text-gray-700 text-sm md:text-base flex-1">
                    Location: {user.location || "No location set."}
                  </p>

                  {isOwner && (
                    <button
                      onClick={() => setEditingLocation(true)}
                      className="text-gray-500 hover:text-pink-600 transition"
                      aria-label="Edit location"
                      title="Edit location"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter your location"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={handleLocationSave}
                      disabled={savingLocation}
                      className="bg-pink-600 text-white text-xs px-3 py-1 rounded hover:bg-pink-700 transition disabled:opacity-60"
                    >
                      {savingLocation ? "Saving..." : "Save"}
                    </button>

                    <button
                      onClick={() => {
                        setEditingLocation(false);
                        setLocationInput(user.location || "");
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
    </div>
  );
}