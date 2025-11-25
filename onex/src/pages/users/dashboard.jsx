import { useNavigate } from "react-router";
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  BarChart3,
  LogOut,
  Home,
  UserRound,
} from "lucide-react";

import UserProfileSettings from "./UserProfileSettings.jsx";
import ProfilePage from "../profiles/ProfilePage.jsx";
import UserActivity from "./UserActivity.jsx";
import { UserContext } from "../../context/UserContext";
import { FEATURE_FLAGS } from "../../config/featureFlags";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const [activeView, setActiveView] = useState("dashboard");
  const [profilePic, setProfilePic] = useState(user?.profilePic || "");

  useEffect(() => {
    setProfilePic(user?.profilePic || "");
  }, [user]);

  const handleSignOut = async () => {
    navigate("/signout");
    await logout();
  };

  // 🚫 Prevent switching to disabled views
  const safeSetActiveView = (view) => {
    if (view === "activity" && !FEATURE_FLAGS.ENABLE_VIEW_ACTIVITY) return;
    if (view === "publicProfile" && !FEATURE_FLAGS.ENABLE_PUBLIC_PROFILE) return;
    setActiveView(view);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-yellow-100 via-white via-black to-purple-400 flex flex-col md:flex-row">

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-xl p-6 flex flex-col justify-between">
        <nav className="mt-2 w-full space-y-2 text-sm">

          {/* Edit Profile (always enabled) */}
          <button
            onClick={() => safeSetActiveView("profile")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              activeView === "profile"
                ? "bg-pink-100 text-pink-800 font-semibold"
                : "hover:bg-pink-100 text-pink-800"
            }`}
          >
            <User size={18} />
            Edit Profile
          </button>

          {/* View Activity — gated by feature flag */}
          {FEATURE_FLAGS.ENABLE_VIEW_ACTIVITY && (
            <button
              onClick={() => safeSetActiveView("activity")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                activeView === "activity"
                  ? "bg-pink-100 text-pink-800 font-semibold"
                  : "hover:bg-pink-100 text-pink-800"
              }`}
            >
              <BarChart3 size={18} />
              View Activity
            </button>
          )}

          {/* Public Profile — gated by feature flag */}
          {FEATURE_FLAGS.ENABLE_PUBLIC_PROFILE && (
            <button
              onClick={() => safeSetActiveView("publicProfile")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                activeView === "publicProfile"
                  ? "bg-pink-100 text-pink-800 font-semibold"
                  : "hover:bg-pink-100 text-pink-800"
              }`}
            >
              <UserRound size={18} />
              Profile
            </button>
          )}

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-pink-200 hover:bg-pink-300 text-pink-800 font-medium mt-4 transition"
          >
            <LogOut size={18} />
            Sign Out
          </button>

          <Link
            to="/home"
            className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-pink-700 mt-3 transition"
          >
            <Home size={18} />
            Return Home
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <nav className="text-sm text-gray-600 mb-4">
          <ol className="list-reset flex items-center gap-2">
            <li>
              <button
                onClick={() => safeSetActiveView("dashboard")}
                className="text-pink-700 hover:underline"
              >
                Dashboard
              </button>
            </li>
            {activeView !== "dashboard" && (
              <>
                <li>/</li>
                <li className="text-gray-800 font-medium capitalize">
                  {activeView}
                </li>
              </>
            )}
          </ol>
        </nav>

        {activeView === "profile" && (
          <div>
            <h1 className="text-2xl font-bold text-pink-700 mb-2">Edit Your Profile</h1>
            <p className="text-gray-700 mb-4">Update your profile information below.</p>
            <UserProfileSettings />
          </div>
        )}

        {FEATURE_FLAGS.ENABLE_VIEW_ACTIVITY && activeView === "activity" && (
          <div>
            <h1 className="text-2xl font-bold text-pink-700 mb-2">Your Activity</h1>
            <p className="text-gray-700 mb-4">
              Browse all posts shared by users across the platform.
            </p>
            <UserActivity />
          </div>
        )}

        {FEATURE_FLAGS.ENABLE_PUBLIC_PROFILE && activeView === "publicProfile" && (
          <div>
            <ProfilePage />
          </div>
        )}

        {activeView === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold text-pink-700 mb-4">Your Dashboard</h1>
            <p className="text-gray-700">
              Manage your profile, check your activity, and stay connected with the platform.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
