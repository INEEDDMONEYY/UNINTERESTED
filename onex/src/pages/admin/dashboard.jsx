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
  ImageIcon,
  UserPlus, // ⭐ NEW ICON
} from "lucide-react";

import AdminAnalytics from "./AdminAnalytics";
import AdminSettings from "./AdminSettings";
import AdminMessages from "./AdminMessages";
import AdminUserManagement from "./AdminUserManagement";
import AdminCreateUserForm from "./AdminCreateUserForm"; // ⭐ ALREADY IMPORTED
import { useUser } from "../../context/useUser";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [activeView, setActiveView] = useState("dashboard");
  const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0 });
  const [restrictedAccounts, setRestrictedAccounts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [profilePicture, setProfilePicture] = useState(
    user?.profilePic ||
      localStorage.getItem("profilePicture") ||
      "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/home");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const fetchData = async () => {
      try {
        const statsRes = await fetch(
          "https://uninterested.onrender.com/api/admin/settings/stats",
          { headers, credentials: "include" }
        );
        if (!statsRes.ok) throw new Error("Failed to fetch stats");
        const statsData = await statsRes.json();
        setStats(statsData);

        const postsRes = await fetch(
          "https://uninterested.onrender.com/api/posts",
          { headers, credentials: "include" }
        );
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(Array.isArray(postsData) ? postsData : []);
        }

        const restrictedRes = await fetch(
          "https://uninterested.onrender.com/api/admin/users/restricted",
          { headers, credentials: "include" }
        );
        if (restrictedRes.ok) {
          const restrictedData = await restrictedRes.json();
          setRestrictedAccounts(restrictedData);
        }

        const messagesRes = await fetch(
          "https://uninterested.onrender.com/api/admin/messages",
          { headers, credentials: "include" }
        );
        if (messagesRes.ok) {
          const messagesData = await messagesRes.json();
          setMessages(messagesData);
        }

        const settingsRes = await fetch(
          "https://uninterested.onrender.com/api/admin/settings",
          { headers, credentials: "include" }
        );
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData);

          if (settingsData?.profilePicture) {
            localStorage.setItem("profilePicture", settingsData.profilePicture);
            setProfilePicture(settingsData.profilePicture);
            setUser((prev) => ({
              ...prev,
              profilePic: settingsData.profilePicture,
            }));
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, setUser]);

  useEffect(() => {
    if (user?.profilePic) {
      setProfilePicture(user.profilePic);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profilePicture");
    navigate("/home");
  };

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
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-black via-gray-900 to-pink-800">

      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white shadow-lg flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-pink-700">Admin Panel</h2>
            <img
              src={profilePicture}
              alt="Admin Profile"
              className="w-10 h-10 rounded-full object-cover border border-pink-300 shadow-sm"
            />
          </div>

          <nav className="space-y-4 text-sm">
            <SidebarButton icon={Home} label="Dashboard" view="dashboard" />
            <SidebarButton icon={Users} label="User Management" view="users" />
            <SidebarButton
              icon={UserPlus} // ⭐ NEW
              label="Create Users" // ⭐ NEW
              view="create-users" // ⭐ NEW
            />
            <SidebarButton icon={Settings} label="Settings" view="settings" />
            <SidebarButton icon={BarChart2} label="Site Analytics" view="analytics" />
            <SidebarButton icon={Mail} label="Messages" view="messages" />
          </nav>
        </div>

        <div className="space-y-3 mt-8">
          <button
            onClick={() => navigate("/home")}
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

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-300 mb-4">
          <ol className="list-reset flex items-center gap-2">
            <li>
              <button
                onClick={() => setActiveView("dashboard")}
                className="text-pink-300 hover:underline"
              >
                Dashboard
              </button>
            </li>
            {activeView !== "dashboard" && (
              <>
                <li>/</li>
                <li className="text-white font-medium capitalize">{activeView}</li>
              </>
            )}
          </ol>
        </nav>

        {/* VIEWS */}
        {activeView === "dashboard" && (
          <>
            {/* (Unchanged dashboard code…) */}
          </>
        )}

        {activeView === "users" && (
          <div className="bg-white rounded-lg p-6 shadow-md border border-pink-200">
            <AdminUserManagement />
          </div>
        )}

        {activeView === "create-users" && ( // ⭐ NEW VIEW
          <div className="bg-white rounded-lg p-6 shadow-md border border-pink-200">
            <AdminCreateUserForm />
          </div>
        )}

        {activeView === "settings" && (
          <AdminSettings
            onProfileUpdate={(url) => {
              setProfilePicture(url);
              setUser((prev) => ({ ...prev, profilePic: url }));
            }}
            settingsData={settings}
          />
        )}

        {activeView === "analytics" && <AdminAnalytics />}

        {activeView === "messages" && (
          <div className="bg-gradient-to-br from-black via-gray-900 to-pink-800 min-h-[80vh] rounded-lg p-6 shadow-lg border border-pink-400">
            <AdminMessages messages={messages} />
          </div>
        )}
      </main>
    </div>
  );
}
