import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  Settings,
  BarChart2,
  LogOut,
  Home,
  Mail,
  ArrowLeftCircle,
} from "lucide-react";
import AdminAnalytics from "./AdminAnalytics";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [activeView, setActiveView] = useState("dashboard");
  const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0 });
  const [restrictedAccounts, setRestrictedAccounts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all dashboard data on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const fetchData = async () => {
      try {
        // Site stats
        const statsRes = await fetch(
          "https://uninterested.onrender.com/admin/stats",
          { headers, credentials: "include" }
        );
        if (!statsRes.ok) throw new Error("Failed to fetch stats");
        const statsData = await statsRes.json();
        setStats(statsData);

        // Restricted accounts
        const restrictedRes = await fetch(
          "https://uninterested.onrender.com/admin/restricted",
          { headers, credentials: "include" }
        );
        const restrictedData = await restrictedRes.json();
        setRestrictedAccounts(restrictedData);

        // Messages
        const messagesRes = await fetch(
          "https://uninterested.onrender.com/admin/messages",
          { headers, credentials: "include" }
        );
        const messagesData = await messagesRes.json();
        setMessages(messagesData);

        // ✅ Admin Settings (Step 4)
        const settingsRes = await fetch(
          "https://uninterested.onrender.com/api/admin/settings",
          { headers, credentials: "include" }
        );
        if (!settingsRes.ok) throw new Error("Failed to fetch admin settings");
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Update admin settings handler
  const handleUpdateSettings = async (updatedSettings) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "https://uninterested.onrender.com/api/admin/settings",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedSettings),
        }
      );
      if (!res.ok) throw new Error("Failed to update settings");
      const data = await res.json();
      setSettings(data);
      alert("✅ Settings updated successfully!");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/home");
  };

  const handleReturnHome = () => navigate("/home");

  const SidebarButton = ({ icon: Icon, label, view }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-pink-100 transition ${
        activeView === view
          ? "bg-pink-50 text-pink-700 font-semibold"
          : "text-gray-700"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-pink-100 to-pink-300">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-lg flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-pink-700">Admin Panel</h2>
            <img
              src={
                localStorage.getItem("profilePicture") ||
                "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
              }
              alt="Admin Profile"
              className="w-10 h-10 rounded-full object-cover border border-pink-300 shadow-sm"
            />
          </div>

          <nav className="space-y-4 text-sm">
            <SidebarButton icon={Home} label="Dashboard" view="dashboard" />
            <SidebarButton icon={Users} label="User Management" view="users" />
            <SidebarButton icon={Settings} label="Settings" view="settings" />
            <SidebarButton
              icon={BarChart2}
              label="Site Analytics"
              view="analytics"
            />
            <SidebarButton icon={Mail} label="Messages" view="messages" />
          </nav>
        </div>

        <div className="space-y-3 mt-8">
          <button
            onClick={handleReturnHome}
            className="flex items-center gap-2 w-full justify-center bg-pink-200 text-pink-800 px-4 py-2 rounded-lg hover:bg-pink-300 transition"
          >
            <ArrowLeftCircle size={18} /> Return Home
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full justify-center bg-pink-700 text-white px-4 py-2 rounded-lg hover:bg-pink-800 transition"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
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

        {/* Dashboard View */}
        {activeView === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold text-pink-700 mb-2">
              Welcome, {user.username}
            </h1>
            <p className="text-gray-700 mb-6">
              Here’s a quick overview of your platform stats.
            </p>

            {loading ? (
              <p className="text-gray-600">Loading site analytics...</p>
            ) : error ? (
              <p className="text-red-600">Error: {error}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white border border-pink-300 rounded-lg p-4 shadow-sm">
                  <h3 className="text-pink-700 font-semibold text-lg">
                    Total Users
                  </h3>
                  <p className="text-black text-xl">{stats.totalUsers}</p>
                </div>
                <div className="bg-white border border-pink-300 rounded-lg p-4 shadow-sm">
                  <h3 className="text-pink-700 font-semibold text-lg">
                    Total Admins
                  </h3>
                  <p className="text-black text-xl">{stats.totalAdmins}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings View (Step 4 UI) */}
        {activeView === "settings" && (
          <div>
            <h2 className="text-2xl font-bold text-pink-700 mb-2">
              Admin Settings
            </h2>
            {settings ? (
              <form
                className="space-y-4 max-w-lg"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateSettings(settings);
                }}
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) =>
                      setSettings({ ...settings, siteName: e.target.value })
                    }
                    className="w-full mt-1 border border-pink-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, supportEmail: e.target.value })
                    }
                    className="w-full mt-1 border border-pink-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Developer Message
                  </label>
                  <textarea
                    value={settings.devMessage}
                    onChange={(e) =>
                      setSettings({ ...settings, devMessage: e.target.value })
                    }
                    className="w-full mt-1 border border-pink-300 rounded-lg p-2"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <p>Loading settings...</p>
            )}
          </div>
        )}

        {activeView === "analytics" && <AdminAnalytics />}
      </main>
    </div>
  );
}
