import { useMemo, useState } from "react";
import confetti from "canvas-confetti";
import api from "../../../utils/api";

export default function PromoteAccountSettings({ users = [], onUserPromoted }) {
  const [selectedUser, setSelectedUser] = useState("");
  const [promotionDuration, setPromotionDuration] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [recentlyPromoted, setRecentlyPromoted] = useState([]);

  const activePromotedUsers = useMemo(() => {
    const now = new Date();
    return users.filter((user) => {
      if (!user?.activePromoExpiry) return false;
      const expiry = new Date(user.activePromoExpiry);
      return !Number.isNaN(expiry.getTime()) && expiry > now;
    });
  }, [users]);

  const promotedUsers = [...recentlyPromoted, ...activePromotedUsers].filter(
    (user, index, arr) => index === arr.findIndex((item) => item?._id === user?._id)
  );

  const selectedUserProfile = users.find((user) => user._id === selectedUser);

  const showConfetti = () => {
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#ec4899", "#f472b6", "#fb7185", "#f9a8d4"],
    });
  };

  const handlePromoteUser = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (!selectedUser || !promotionDuration) {
      setErrorMessage("Please select a user and promotion duration.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post(
        "/admin/users/promote",
        { userId: selectedUser, duration: promotionDuration },
        { withCredentials: true }
      );

      const promotedUser = response?.data?.data?.promotedUser;
      const expiresAt = response?.data?.data?.expiresAt;
      const selectedUsername = selectedUserProfile?.username || promotedUser?.username || "User";

      // Use API response if available, otherwise fall back to the locally-known selectedUserProfile
      const promotedEntry = promotedUser || selectedUserProfile;
      if (promotedEntry) {
        const updatedEntry = {
          ...promotedEntry,
          activePromoExpiry: expiresAt || promotedUser?.activePromoExpiry,
        };
        setRecentlyPromoted((prev) => {
          const cleaned = prev.filter((item) => item?._id !== promotedEntry._id);
          return [updatedEntry, ...cleaned];
        });
        // Notify parent so its users list stays in sync
        onUserPromoted?.(promotedEntry._id, expiresAt || promotedUser?.activePromoExpiry);
      }

      showConfetti();
      setSuccessMessage(`${selectedUsername} is now in the promoted accounts section.`);

      setSelectedUser("");
      setPromotionDuration("");
    } catch (err) {
      console.error("Failed to promote user:", err);
      setErrorMessage(
        err.response?.data?.error ||
          "Failed to promote user. Make sure you are an admin."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-pink-200 rounded-lg p-6 shadow-sm w-full">
      {/* Title */}
      <h6 className="text-lg font-semibold text-pink-600 mb-4">
        Promote User Account
      </h6>

      {successMessage ? (
        <p className="mb-3 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {successMessage}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      {/* Responsive Form */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">

        {/* User Selector */}
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select user</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>

        {/* Duration Selector */}
        <select
          value={promotionDuration}
          onChange={(e) => setPromotionDuration(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Promotion duration</option>
          <option value="24hrs">24hrs</option>
          <option value="2days">2 days</option>
          <option value="4days">4 days</option>
          <option value="1week">1 week</option>
        </select>

        {/* Button */}
        <button
          onClick={handlePromoteUser}
          disabled={submitting}
          className="bg-pink-600 text-white px-5 py-2 rounded hover:bg-pink-700 transition whitespace-nowrap"
        >
          {submitting ? "Saving..." : "Save Promotion"}
        </button>

      </div>

      {/* Selected user preview */}
      {selectedUserProfile ? (
        <div className="mt-4 rounded-lg border border-pink-100 bg-pink-50/50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">Selected user</p>
          <div className="mt-2 flex items-center gap-3">
            <img
              src={selectedUserProfile.profilePic || "https://via.placeholder.com/48?text=U"}
              alt={selectedUserProfile.username || "Selected user"}
              className="h-10 w-10 rounded-full object-cover border border-pink-200"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">{selectedUserProfile.username}</p>
              <p className="text-xs text-gray-500">Will be added to promoted accounts after save.</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Promoted accounts section */}
      <div className="mt-5 rounded-lg border border-pink-100 bg-pink-50/30 p-4">
        <h3 className="text-sm font-semibold text-pink-700 mb-3">Promoted account&apos;s section</h3>

        {promotedUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {promotedUsers.map((user) => (
              <div
                key={user._id}
                className="rounded-md border border-pink-200 bg-white p-3"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={user.profilePic || "https://via.placeholder.com/40?text=P"}
                    alt={user.username || "Promoted user"}
                    className="h-8 w-8 rounded-full object-cover border border-pink-200"
                  />
                  <p className="text-sm font-medium text-gray-800">{user.username || "Unknown user"}</p>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Active until: {user.activePromoExpiry ? new Date(user.activePromoExpiry).toLocaleString() : "Unknown"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No promoted accounts yet.</p>
        )}
      </div>
    </div>
  );
}