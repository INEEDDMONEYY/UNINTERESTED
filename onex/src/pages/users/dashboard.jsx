import { useNavigate } from "react-router";
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  BarChart3,
  MessageSquareText,
  LogOut,
  Home,
  UserRound,
  Menu,
  X,
  Sparkles,
  Link2,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

import UserProfileSettings from "./UserProfileSettings.jsx";
import ProfilePage from "../profiles/ProfilePage.jsx";
import UserActivity from "./UserActivity.jsx";
import { UserContext } from "../../context/UserContext";
import { FEATURE_FLAGS } from "../../config/featureFlags";
import api from "../../utils/api";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const [activeView, setActiveView] = useState("dashboard");
  const [profilePic, setProfilePic] = useState(user?.profilePic || "");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const SHOW_WHATS_NEW_BADGE = true;

  const restrictionLabelMap = {
    "no-posting": "Posting disabled",
    "no-comments": "Commenting disabled",
    "read-only": "Read-only access",
  };

  const activeRestriction = user?.roleRestriction || "";
  const restrictionLabel = restrictionLabelMap[activeRestriction] || activeRestriction;

  useEffect(() => {
    setProfilePic(user?.profilePic || "");
  }, [user]);

  useEffect(() => {
    if (!user?._id) {
      setUnreadMessages(0);
      return;
    }

    let isMounted = true;

    const fetchUnreadCount = async () => {
      try {
        const { data } = await api.get("/messages/unread/count");
        if (!isMounted) return;
        const count = Number(data?.unreadCount);
        setUnreadMessages(Number.isFinite(count) && count >= 0 ? count : 0);
      } catch {
        if (!isMounted) return;
        setUnreadMessages(0);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user?._id]);

  // -------- Promo Countdown Timer --------
  useEffect(() => {
    // Promo countdown logic removed with dashboard promo sections
  }, []);

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
            <span className="inline-flex items-center gap-2">
              Edit Profile
              {SHOW_WHATS_NEW_BADGE && (
                <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-pink-700">
                  New
                </span>
              )}
            </span>
          </button>

          <Link
            to="/user/messages"
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition hover:bg-gray-100"
          >
            <MessageSquareText size={18} />
            <span className="inline-flex items-center gap-2">
              Messages
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-blue-700">
                Beta
              </span>
            </span>
            <span
              className={`ml-auto inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                unreadMessages > 0
                  ? "bg-pink-100 text-pink-700"
                  : "bg-gray-200 text-gray-600"
              }`}
              aria-label={`Unread messages: ${unreadMessages}`}
            >
              {unreadMessages}
            </span>
          </Link>

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

        {activeRestriction && (
          <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900 shadow-sm">
            <p className="text-sm font-semibold">Access restricted</p>
            <p className="text-sm">
              Your account currently has the following restriction: {restrictionLabel}.
            </p>
          </div>
        )}

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
            <ProfilePage userId={user?._id || user?.id || null} disableActionButtons />
          </div>
        )}

        {activeView === "dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

            <div className="bg-white p-6 rounded-xl shadow border border-pink-200 sm:col-span-2 xl:col-span-3">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-lg font-semibold inline-flex items-center gap-2">
                  <Sparkles size={18} className="text-pink-600" />
                  What's New for Users
                </h2>
                {SHOW_WHATS_NEW_BADGE && (
                  <span className="rounded-full bg-pink-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.05em] text-white">
                    New
                  </span>
                )}
              </div>

              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <ShieldAlert size={19} className="mt-0.5 text-amber-600" />
                  <span>
                    <strong>Contact privacy update:</strong> phone number and email now display directly on your profile and post details when they are set in your settings. Contact masking will return later when the payment system is ready.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 text-green-600" />
                  <span>
                    <strong>Profile account & Badge payment integration:</strong> You can now pay for account upgrades and badges for further account creditability.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 text-green-600" />
                  <span>
                    <strong>Profile header improvement:</strong> very long usernames now scale down automatically so badges remain visible on smaller screens.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <MessageSquareText size={16} className="mt-0.5 text-blue-600" />
                  <span>
                    <strong>Messages (Beta)</strong> is currently for contacting a site admin only: report platform bugs, ask platform questions, or report harmful/unsafe client activity.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Link2 size={16} className="mt-0.5 text-pink-600" />
                  <span>
                    Go to <strong>Edit Profile</strong> and add your <strong>Verified Links</strong> to show references from other platforms.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 text-green-600" />
                  <span>
                    When creating a post, there is now <strong>two media uploaders</strong> for both photos and videos from your device gallery.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldAlert size={16} className="mt-0.5 text-red-600" />
                  <span>
                    In <strong>Danger Zone</strong>, you can now delete your account. You'll get a confirmation prompt before deletion is final.
                  </span>
                </li>
              </ul>

              <button
                type="button"
                onClick={() => safeSetActiveView("profile")}
                className="mt-4 inline-flex items-center rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 transition"
              >
                Open Profile Settings
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}