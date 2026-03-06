import { useNavigate } from "react-router";
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  BarChart3,
  LogOut,
  Home,
  UserRound,
  Menu,
  X,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setProfilePic(user?.profilePic || "");
  }, [user]);

  const handleSignOut = async () => {
    navigate("/signout");
    await logout();
  };

  const safeSetActiveView = (view) => {
    if (view === "activity" && !FEATURE_FLAGS.ENABLE_VIEW_ACTIVITY) return;
    if (view === "publicProfile" && !FEATURE_FLAGS.ENABLE_PUBLIC_PROFILE) return;
    setActiveView(view);
    setSidebarOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Dashboard</h2>

        <nav className="space-y-2 text-sm">

          <button
            onClick={() => safeSetActiveView("profile")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              activeView === "profile"
                ? "bg-gray-200 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            <User size={18} />
            Edit Profile
          </button>

          {FEATURE_FLAGS.ENABLE_VIEW_ACTIVITY && (
            <button
              onClick={() => safeSetActiveView("activity")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                activeView === "activity"
                  ? "bg-gray-200 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              <BarChart3 size={18} />
              View Activity
            </button>
          )}

          {FEATURE_FLAGS.ENABLE_PUBLIC_PROFILE && (
            <button
              onClick={() => safeSetActiveView("publicProfile")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                activeView === "publicProfile"
                  ? "bg-gray-200 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              <UserRound size={18} />
              Profile
            </button>
          )}

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium mt-4 transition"
          >
            <LogOut size={18} />
            Sign Out
          </button>

          <Link
            to="/home"
            className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-black mt-3 transition"
          >
            <Home size={18} />
            Return Home
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3 mt-6 pt-6 border-t">
        <img
          src={profilePic || "https://via.placeholder.com/40"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold">{user?.username || "User"}</p>
          <p className="text-xs text-gray-500">Member</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* MOBILE DRAWER OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden rounded-md"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed md:relative z-50 md:z-auto top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 flex flex-col justify-between p-6
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Mobile close button */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <SidebarContent />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">

        {/* MOBILE HEADER */}
        <div className="flex items-center justify-between md:hidden mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-white shadow"
          >
            <Menu size={22} />
          </button>

          <h1 className="font-semibold">Dashboard</h1>
          <div />
        </div>

        {/* DESKTOP HEADER */}
        <div className="hidden md:block mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.username || "User"} 👋
          </h1>
          <p className="text-gray-500">
            Manage your account and activity from your dashboard.
          </p>
        </div>

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="flex items-center gap-2">
            <li>
              <button
                onClick={() => safeSetActiveView("dashboard")}
                className="hover:underline"
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
          <div className="bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-4">Edit Your Profile</h1>
            <UserProfileSettings />
          </div>
        )}

        {FEATURE_FLAGS.ENABLE_VIEW_ACTIVITY && activeView === "activity" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-4">Your Activity</h1>
            <UserActivity />
          </div>
        )}

        {FEATURE_FLAGS.ENABLE_PUBLIC_PROFILE && activeView === "publicProfile" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <ProfilePage />
          </div>
        )}

        {activeView === "dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-2">Account Overview</h2>
              <p className="text-gray-600 text-sm">
                Manage your profile, activity, and platform interactions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-2">Profile Status</h2>
              <p className="text-gray-600 text-sm">
                Keep your profile updated to stay visible to others.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-2">Platform Activity</h2>
              <p className="text-gray-600 text-sm">
                View your posts and interactions across the platform.
              </p>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}