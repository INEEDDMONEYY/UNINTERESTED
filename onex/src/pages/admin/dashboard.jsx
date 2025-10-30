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
} from "lucide-react";
import AdminAnalytics from "./AdminAnalytics";
import AdminSettings from "./AdminSettings";
import AdminMessages from "./AdminMessages";
import AdminUserManagement from "./AdminUserManagement";
import { useUser } from "../../context/useUser"; // ✅ global user context

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [activeView, setActiveView] = useState("dashboard");
  const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0 });
  const [restrictedAccounts, setRestrictedAccounts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState(null);
  const [posts, setPosts] = useState([]); // ✅ all posts
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
        // ✅ Fetch platform stats
        const statsRes = await fetch(
          "https://uninterested.onrender.com/api/admin/settings/stats",
          { headers, credentials: "include" }
        );
        if (!statsRes.ok) throw new Error("Failed to fetch stats");
        const statsData = await statsRes.json();
        setStats(statsData);

        // ✅ Fetch all posts
        const postsRes = await fetch(
          "https://uninterested.onrender.com/api/posts",
          { headers, credentials: "include" }
        );
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(Array.isArray(postsData) ? postsData : []);
        }

        // ✅ Restricted accounts
        const restrictedRes = await fetch(
          "https://uninterested.onrender.com/api/admin/users/restricted",
          { headers, credentials: "include" }
        );
        if (restrictedRes.ok) {
          const restrictedData = await restrictedRes.json();
          setRestrictedAccounts(restrictedData);
        }

        // ✅ Messages
        const messagesRes = await fetch(
          "https://uninterested.onrender.com/api/admin/messages",
          { headers, credentials: "include" }
        );
        if (messagesRes.ok) {
          const messagesData = await messagesRes.json();
          setMessages(messagesData);
        }

        // ✅ Admin settings (for profile picture)
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

  // ✅ Update profile picture when user context changes
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-black via-gray-900 to-pink-800">
      {/* Sidebar */}
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
            <SidebarButton icon={Settings} label="Settings" view="settings" />
            <SidebarButton icon={BarChart2} label="Site Analytics" view="analytics" />
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

        {activeView === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome, {user?.username || "Admin"}
            </h1>
            <p className="text-gray-300 mb-6">
              Here’s a quick overview of your platform stats and posts.
            </p>

            {loading ? (
              <p className="text-gray-400">Loading platform data...</p>
            ) : error ? (
              <p className="text-red-400">Error: {error}</p>
            ) : (
              <>
                {/* ✅ Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white border border-pink-300 rounded-lg p-4 shadow-sm">
                    <h3 className="text-pink-700 font-semibold text-lg">Total Users</h3>
                    <p className="text-black text-xl">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-white border border-pink-300 rounded-lg p-4 shadow-sm">
                    <h3 className="text-pink-700 font-semibold text-lg">Total Admins</h3>
                    <p className="text-black text-xl">{stats.totalAdmins}</p>
                  </div>
                  <div className="bg-white border border-pink-300 rounded-lg p-4 shadow-sm">
                    <h3 className="text-pink-700 font-semibold text-lg">Restricted Users</h3>
                    <p className="text-black text-xl">{restrictedAccounts.length}</p>
                  </div>
                </div>

                {/* 🧩 Posts Grid */}
                <div>
                  <h2 className="text-2xl font-bold text-pink-200 mb-4">All Posts</h2>
                  {posts.length === 0 ? (
                    <p className="text-gray-400">No posts found.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {posts.map((post) => (
                        <div
                          key={post._id}
                          className="bg-white rounded-lg shadow-md border border-pink-200 overflow-hidden hover:shadow-lg transition"
                        >
                          {post.imageUrl ? (
                            <img
                              src={post.imageUrl}
                              alt={post.caption || "Post image"}
                              className="w-full h-40 object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-40 bg-pink-50 text-pink-400">
                              <ImageIcon size={36} />
                            </div>
                          )}
                          <div className="p-4">
                            <p className="text-gray-800 font-medium mb-1">
                              {post.caption || "No caption"}
                            </p>
                            <p className="text-sm text-gray-500">
                              By {post.user?.username || "Unknown"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeView === "users" && (
          <div className="bg-white rounded-lg p-6 shadow-md border border-pink-200">
            <AdminUserManagement />
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
