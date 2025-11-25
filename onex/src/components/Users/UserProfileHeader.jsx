import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";

/*
  UserProfileHeader
  -----------------
  • Displays a user’s profile info based on priority:
    1️⃣ propUser object (highest priority)
    2️⃣ userId prop (loads from localStorage)
    3️⃣ logged-in context user (if displayUserId matches logged-in user)
  • refreshKey forces re-read when parent signals updates
  • Works correctly for logged-out users
*/
export default function UserProfileHeader({ refreshKey = 0, propUser = null, userId: propUserId = null }) {
  const { user: ctxUser } = useContext(UserContext);

  // Determine which user ID we are trying to display
  const displayUserId = propUser?._id || propUser?.id || propUserId || null;

  const [user, setUser] = useState({ username: "", bio: "", profilePic: null });

  // Helper: read a stored profile from localStorage
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

  useEffect(() => {
    // 1️⃣ propUser always takes priority
    if (propUser) {
      setUser({
        username: propUser.username || "",
        bio: propUser.bio || "",
        profilePic: propUser.profilePic || null,
      });
      return;
    }

    // 2️⃣ Attempt to read stored profile for displayUserId
    if (displayUserId) {
      const stored = readProfileFromStorage(displayUserId);
      if (stored) {
        setUser({
          username: stored.username || "",
          bio: stored.bio || "",
          profilePic: stored.profilePic || null,
        });
        return;
      }
    }

    // 3️⃣ Fallback: use logged-in context user ONLY if it matches displayUserId
    if (ctxUser && ctxUser._id === displayUserId) {
      setUser({
        username: ctxUser.username || "",
        bio: ctxUser.bio || "",
        profilePic: ctxUser.profilePic || null,
      });
      return;
    }

    // 4️⃣ If all else fails, empty fallback for unknown/logged-out users
    setUser({ username: "", bio: "", profilePic: null });
  }, [refreshKey, propUser, displayUserId, ctxUser]);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-xl shadow-lg bg-white p-6 text-center">
      <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent mb-4">
        {user.username || "Unnamed User"}
      </h1>
      <div className="text-sm md:text-base text-gray-700 max-w-xl mx-auto">
        {user.bio || "No bio available."}
      </div>
      {user.profilePic && (
        <div className="mt-4 flex justify-center">
          <img
            src={user.profilePic}
            alt={user.username || "Profile"}
            className="w-24 h-24 rounded-full object-cover border-2 border-pink-400 shadow"
          />
        </div>
      )}
    </div>
  );
}
