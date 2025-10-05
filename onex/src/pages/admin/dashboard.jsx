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
import AdminSettings from "./AdminSettings";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [activeView, setActiveView] = useState("dashboard");
  const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0 });
  const [restrictedAccounts, setRestrictedAccounts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch data on load
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch site stats
    fetch("https://uninterested.onrender.com/admin/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Fetch user messages
    fetch("https://uninterested.onrender.com/admin/messages", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Failed to fetch messages:", err));

    // Fetch restricted accounts
    fetch("https://uninterested.onrender.com/admin/restricted", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setRestrictedAccounts(data))
      .catch((err) =>
        console.error("Failed to fetch restricted accounts:", err)
      );
  }, []);

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
          <h2 className="text-xl font-bold text-pink-700 mb-6 text-center">
            Admin Panel
          </h2>

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

        {/* Dynamic Views */}
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

            {/* Restricted Accounts Section */}
            <section className="mt-6">
              <h2 className="text-2xl font-bold text-pink-700 mb-3">
                Restricted Accounts
              </h2>
              {restrictedAccounts.length > 0 ? (
                <ul className="space-y-3">
                  {restrictedAccounts.map((acc, i) => (
                    <li
                      key={i}
                      className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm"
                    >
                      <p className="text-gray-800 font-medium">
                        {acc.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        Reason: {acc.reason || "N/A"}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No restricted accounts found.</p>
              )}
            </section>
          </div>
        )}

        {activeView === "users" && (
          <div>
            <h2 className="text-2xl font-bold text-pink-700 mb-2">
              User Management
            </h2>
            <p className="text-gray-700">View, edit, or promote users here.</p>
          </div>
        )}

        {activeView === "settings" && (
          <div>
            <h2 className="text-2xl font-bold text-pink-700 mb-2">Settings</h2>
            <p className="text-gray-700 mb-4">
              Configure platform preferences and admin tools.
            </p>
            <AdminSettings />
          </div>
        )}

        {activeView === "analytics" && (
          <div>
            <h2 className="text-2xl font-bold text-pink-700 mb-2">
              Site Analytics
            </h2>
            <p className="text-gray-700 mb-4">
              Monitor traffic, engagement, and performance metrics.
            </p>
            <AdminAnalytics />
          </div>
        )}

        {activeView === "messages" && (
          <div>
            <h2 className="text-2xl font-bold text-pink-700 mb-4">
              Messages from Users
            </h2>
            {messages.length > 0 ? (
              <ul className="space-y-4">
                {messages.map((msg, i) => (
                  <li
                    key={i}
                    className="bg-white rounded-lg p-4 shadow border border-pink-100"
                  >
                    <h3 className="text-pink-700 font-semibold">{msg.title}</h3>
                    <p className="text-gray-700 text-sm">{msg.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      From: {msg.sender}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No messages found.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
