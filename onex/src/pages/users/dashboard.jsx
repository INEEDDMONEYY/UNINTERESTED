import { useNavigate } from "react-router";
import { useState } from "react";
import { Link } from "react-router-dom";
import { User, BarChart3, LogOut, Home, MessageSquare } from "lucide-react";
import UserProfile from "./UserProfileSettings.jsx";
import UserMessages from "./UserMessages.jsx";

export default function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [activeView, setActiveView] = useState("dashboard");

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-300 flex flex-col md:flex-row">
      {/* 🌸 Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-xl p-6 flex flex-col justify-between">
        {/* User Info */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 mb-4">
            <img
              src={user.image || "https://via.placeholder.com/96"}
              alt={`${user.username}'s profile`}
              className="w-full h-full rounded-full object-cover border-2 border-pink-400 shadow-md"
            />
          </div>
          <h2 className="text-xl font-bold text-pink-700 mb-2 text-center">
            {user.username ? `Welcome, ${user.username}!` : "Welcome!"}
          </h2>

          {/* Nav Menu */}
          <nav className="mt-6 w-full space-y-2 text-sm">
            <button
              onClick={() => setActiveView("profile")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                activeView === "profile"
                  ? "bg-pink-100 text-pink-800 font-semibold"
                  : "hover:bg-pink-100 text-pink-800"
              }`}
            >
              <User size={18} />
              Edit Profile
            </button>

            <button
              onClick={() => setActiveView("activity")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                activeView === "activity"
                  ? "bg-pink-100 text-pink-800 font-semibold"
                  : "hover:bg-pink-100 text-pink-800"
              }`}
            >
              <BarChart3 size={18} />
              View Activity
            </button>

            <button
              onClick={() => setActiveView("messages")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                activeView === "messages"
                  ? "bg-pink-100 text-pink-800 font-semibold"
                  : "hover:bg-pink-100 text-pink-800"
              }`}
            >
              <MessageSquare size={18} />
              Messages
            </button>

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
        </div>
      </aside>

      {/* 🌈 Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-600 mb-4">
          <ol className="list-reset flex items-center gap-2">
            <li>
              <button
                onClick={() => setActiveView("dashboard")}
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

        {/* Dynamic Content */}
        {activeView === "profile" ? (
          <div>
            <h1 className="text-2xl font-bold text-pink-700 mb-2">
              Edit Your Profile
            </h1>
            <p className="text-gray-700 mb-4">
              Update your profile information below.
            </p>
            <UserProfile />
          </div>
        ) : activeView === "activity" ? (
          <div>
            <h1 className="text-2xl font-bold text-pink-700 mb-2">
              Your Activity
            </h1>
            <p className="text-gray-700">
              This is where your activity data will be displayed.
            </p>
          </div>
        ) : activeView === "messages" ? (
          <div>
            <h1 className="text-2xl font-bold text-pink-700 mb-2">
              Messages
            </h1>
            <p className="text-gray-700">
              View and send messages to administrators here.
            </p>
            <div className="mt-6 p-6 bg-white/60 border border-white rounded-lg shadow">
              <UserMessages />
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-pink-700 mb-4">
              Your Dashboard
            </h1>
            <p className="text-gray-700">
              Manage your profile, check your activity, and stay connected with
              the platform.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
