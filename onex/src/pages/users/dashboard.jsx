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
  Clock,
} from "lucide-react";

import UserProfileSettings from "./UserProfileSettings.jsx";
import ProfilePage from "../profiles/ProfilePage.jsx";
import UserActivity from "./UserActivity.jsx";
import { UserContext } from "../../context/UserContext";
import { FEATURE_FLAGS } from "../../config/featureFlags";
import api from "../../utils/api";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useContext(UserContext);
  const [activeView, setActiveView] = useState("dashboard");
  const [profilePic, setProfilePic] = useState(user?.profilePic || "");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [promoCountdown, setPromoCountdown] = useState("");
  const [hasActivePromo, setHasActivePromo] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMessage, setPromoMessage] = useState(null);

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

  // -------- Promo Countdown Timer --------
  useEffect(() => {
    if (!user?.activePromoExpiry) {
      setHasActivePromo(false);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const expiryDate = new Date(user.activePromoExpiry);
      const diffMs = expiryDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        setHasActivePromo(false);
        setPromoCountdown("");
        return;
      }

      setHasActivePromo(true);

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      let countdown = "";
      if (days > 0) {
        countdown = `${days}d ${hours}h ${minutes}m`;
      } else if (hours > 0) {
        countdown = `${hours}h ${minutes}m ${seconds}s`;
      } else {
        countdown = `${minutes}m ${seconds}s`;
      }

      setPromoCountdown(countdown);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [user?.activePromoExpiry]);

  const handleActivatePromo = async (e) => {
    e.preventDefault();
    const code = promoInput.trim();
    if (!code) return;
    setPromoLoading(true);
    setPromoMessage(null);
    try {
      const { data } = await api.post("/promo-codes/redeem", { code });
      if (data.success) {
        await refreshUser();
        setPromoInput("");
        setPromoMessage({
          type: "success",
          text: data.message || "Promo code activated! You're now featured in promoted accounts.",
        });
      } else {
        setPromoMessage({ type: "error", text: data.error || "Failed to activate promo code." });
      }
    } catch (err) {
      setPromoMessage({
        type: "error",
        text: err.response?.data?.error || "Invalid or expired promo code.",
      });
    } finally {
      setPromoLoading(false);
    }
  };

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

            {/* Activate Promo Code — shown only when no promotion is active */}
            {!hasActivePromo && (
              <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                <h2 className="text-lg font-semibold mb-1">Activate Promo Code</h2>
                <p className="text-gray-500 text-sm mb-4">
                  Have a promo code? Enter it here to get featured in the promoted accounts section.
                </p>
                <form onSubmit={handleActivatePromo} className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Enter your promo code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                  <button
                    type="submit"
                    disabled={promoLoading || !promoInput.trim()}
                    className="bg-pink-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-pink-700 disabled:opacity-50 transition"
                  >
                    {promoLoading ? "Activating..." : "Activate"}
                  </button>
                </form>
                {promoMessage && (
                  <p className={`text-sm mt-3 ${promoMessage.type === "success" ? "text-green-700" : "text-red-600"}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>
            )}

            {/* Promo Status Badge */}
            {hasActivePromo && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow border-2 border-green-400">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-500 rounded-full p-2">
                    <Clock size={20} className="text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-green-800">Promo Code Active</h2>
                </div>
                <p className="text-green-700 text-sm mb-2">
                  Your promo posts are live on the platform!
                </p>
                <div className="bg-green-600 text-white font-bold text-center py-3 rounded-lg text-xl">
                  {promoCountdown || "Calculating..."}
                </div>
                <p className="text-green-600 text-xs mt-2 text-center">
                  Expires at {new Date(user.activePromoExpiry).toLocaleString()}
                </p>
              </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow border border-pink-200 sm:col-span-2 xl:col-span-3">
              <h2 className="text-lg font-semibold mb-2">Platform Development Notice</h2>
              <p className="text-gray-700 text-sm mb-3">
                Mystery Mansion is in the early stages of development. New features, fixes, and improvements are often shipped daily or weekly.
              </p>
              <p className="text-gray-700 text-sm mb-4">
                For the latest changes, announcements, and rollout details, please check the updates page.
              </p>
              <Link
                to="/platform-updates"
                className="inline-flex items-center rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 transition"
              >
                View Platform Updates
              </Link>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}