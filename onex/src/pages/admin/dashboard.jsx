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
  UserPlus,
  Menu, // ⭐ NEW
  X, // ⭐ NEW
  Clock3,
  Ticket,
} from "lucide-react";

import AdminAnalytics from "./AdminAnalytics";
import AdminSettings from "./AdminSettings";
import AdminMessages from "./AdminMessages";
import AdminUserManagement from "./AdminUserManagement";
import AdminCreateUserForm from "./AdminCreateUserForm";
import UserProfileHeader from "../../components/Users/UserProfileHeader.jsx";
import { useUser } from "../../context/useUser";
import api from "../../utils/api";
import { setSEO } from "../../utils/seo";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [activeView, setActiveView] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // ⭐ NEW

  useEffect(() => {
    setSEO('Admin | Mystery Mansion', '', { robots: 'noindex, nofollow' });
  }, []);

  const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0 });
  const [restrictedAccounts, setRestrictedAccounts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [posts, setPosts] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [nowMs, setNowMs] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
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

  const profilePictureSrc =
    user?.profilePic ||
    localStorage.getItem("profilePicture") ||
    "https://cdn-icons-png.flaticon.com/512/9131/9131529.png";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/home");

    const fetchData = async () => {
      try {
        const [statsRes, usersRes, postsRes, restrictedRes, settingsRes, promoCodesRes] =
          await Promise.allSettled([
            api.get("/admin/settings/stats"),
            api.get("/admin/users"),
            api.get("/posts"),
            api.get("/admin/users/restricted"),
            api.get("/admin/settings"),
            api.get("/admin/promo-codes"),
          ]);

        if (statsRes.status === "fulfilled") {
          const statsData = statsRes.value?.data;
          const payload = statsData?.data || statsData;
          setStats({
            totalUsers: payload?.totalUsers || 0,
            totalAdmins: payload?.totalAdmins || 0,
          });
        } else if (usersRes.status === "fulfilled") {
          // Fallback when canonical stats endpoint is unavailable.
          const usersData = usersRes.value?.data;
          const userList = Array.isArray(usersData)
            ? usersData
            : Array.isArray(usersData?.data)
              ? usersData.data
              : [];
          const totalAdmins = userList.filter((u) => u?.role === "admin").length;
          setStats({ totalUsers: userList.length, totalAdmins });
        }

        if (postsRes.status === "fulfilled") {
          const postsData = postsRes.value?.data;
          setPosts(Array.isArray(postsData) ? postsData : []);
        }

        if (restrictedRes.status === "fulfilled") {
          const restrictedData = restrictedRes.value?.data;
          setRestrictedAccounts(Array.isArray(restrictedData) ? restrictedData : []);
        }

        // Messages fetch is temporarily disabled until the messages view is re-enabled.

        if (settingsRes.status === "fulfilled") {
          const settingsData = settingsRes.value?.data;
          const payload = settingsData?.data || settingsData;
          setSettings(payload);

          if (payload?.profilePicture) {
            localStorage.setItem("profilePicture", payload.profilePicture);
            setUser((prev) => ({
              ...prev,
              profilePic: payload.profilePicture,
            }));
          }
        }

        if (promoCodesRes.status === "fulfilled") {
          const promoCodesData = promoCodesRes.value?.data;
          const normalized = Array.isArray(promoCodesData)
            ? promoCodesData
            : Array.isArray(promoCodesData?.data)
              ? promoCodesData.data
              : [];
          setPromoCodes(normalized);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, setUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profilePicture");
    navigate("/home");
  };

  const SidebarButton = ({ icon, label, view, badgeCount }) => {
    const IconComponent = icon;
    return (
    <button
      onClick={() => {
        setActiveView(view);
        setMobileMenuOpen(false); // ⭐ close drawer on click
      }}
      className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-pink-100 transition ${
        activeView === view
          ? "bg-pink-50 text-pink-700 font-semibold"
          : "text-gray-700"
      }`}
    >
      <IconComponent size={18} />
      <span>{label}</span>
      {typeof badgeCount === "number" && (
        <span
          className={`ml-auto inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${
            badgeCount > 0
              ? "bg-pink-100 text-pink-700"
              : "bg-gray-200 text-gray-600"
          }`}
          aria-label={`Unread messages: ${badgeCount}`}
        >
          {badgeCount}
        </span>
      )}
    </button>
    );
  };

  const activePromoEntries = promoCodes
    .map((promo) => {
      const code = promo?.code || "";
      const assignedUser = promo?.assignedUser?.username || promo?.assignedUser?.email || "Any user";
      const redemptions = Array.isArray(promo?.redemptions) ? promo.redemptions : [];
      const activeRedemptions = redemptions.filter((entry) => {
        const expiresAtMs = new Date(entry?.expiresAt || 0).getTime();
        return Number.isFinite(expiresAtMs) && expiresAtMs > nowMs;
      });

      if (activeRedemptions.length === 0) return null;

      const nearestExpiryMs = Math.min(
        ...activeRedemptions.map((entry) => new Date(entry.expiresAt).getTime()),
      );
      const diff = Math.max(0, nearestExpiryMs - nowMs);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const countdown = days > 0
        ? `${days}d ${hours}h ${minutes}m ${seconds}s`
        : `${hours}h ${minutes}m ${seconds}s`;

      return {
        code,
        assignedUser,
        countdown,
        expiresAt: new Date(nearestExpiryMs).toLocaleString(),
        redeemedCount: activeRedemptions.length,
      };
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black via-gray-900 to-pink-800">
      {/* MOBILE HEADER ⭐ */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md flex items-center justify-between px-4 py-3 z-40">
        <button onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} className="text-pink-700" />
        </button>

        <h2 className="font-bold text-pink-700">Admin Panel</h2>

        <img
          src={profilePictureSrc}
          alt="Admin Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>

      {/* SIDEBAR / DRAWER */}
      <aside
        className={`
        fixed md:relative z-50 top-0 left-0 h-full w-64 bg-white shadow-lg p-6
        transform transition-transform duration-300
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        {/* CLOSE BUTTON (mobile) ⭐ */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setMobileMenuOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-pink-700">Admin Panel</h2>

            <img
              src={profilePictureSrc}
              alt="Admin Profile"
              className="w-10 h-10 rounded-full object-cover border border-pink-300 shadow-sm"
            />
          </div>

          <nav className="space-y-4 text-sm">
            <SidebarButton icon={Home} label="Dashboard" view="dashboard" />
            <SidebarButton icon={ImageIcon} label="Profile" view="profile" />
            <SidebarButton icon={Users} label="User Management" view="users" />
            <SidebarButton
              icon={UserPlus}
              label="Create Users"
              view="create-users"
            />
            <SidebarButton icon={Settings} label="Settings" view="settings" />
            <SidebarButton
              icon={BarChart2}
              label="Site Analytics"
              view="analytics"
            />
            <SidebarButton
              icon={Mail}
              label="Messages"
              view="messages"
              badgeCount={unreadMessages}
            />
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

      {/* OVERLAY ⭐ */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-6 pt-20 md:pt-6 overflow-y-auto">
        <nav className="text-sm text-gray-300 mb-4">
          <ol className="flex items-center gap-2">
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
                
                <li className="text-white font-medium capitalize">
                  {activeView}
                </li>
              </>
            )}
          </ol>
        </nav>

        {activeView === "users" && (
          <div className="bg-white rounded-lg p-6 shadow-md border border-pink-200">
            <AdminUserManagement />
          </div>
        )}

        {activeView === "create-users" && (
          <div className="bg-white rounded-lg p-6 shadow-md border border-pink-200">
            <AdminCreateUserForm />
          </div>
        )}

        {activeView === "settings" && (
          <AdminSettings
            onProfileUpdate={(url) => {
              setUser((prev) => ({ ...prev, profilePic: url }));
            }}
            settingsData={settings}
          />
        )}

        {activeView === "profile" && (
          <div className="bg-white rounded-lg p-6 shadow-md border border-pink-200 space-y-4">
            <h1 className="text-2xl font-bold text-pink-700">Profile</h1>
            <p className="text-sm text-gray-600">
              Update your banner/background, bio, and location from your profile header below.
            </p>
            <UserProfileHeader userId={user?._id || user?.id || null} />
          </div>
        )}

        {activeView === "analytics" && (
          <div className="bg-white rounded-lg p-6 shadow-md border border-pink-200">
            <AdminAnalytics embed />
          </div>
        )}

        {activeView === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md border border-pink-200">
              <h3 className="font-semibold text-pink-700 mb-2">Users</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
              <p className="text-sm text-gray-500 mt-1">Total registered users</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border border-pink-200">
              <h3 className="font-semibold text-pink-700 mb-2">Posts</h3>
              <p className="text-3xl font-bold text-gray-900">{posts.length}</p>
              <p className="text-sm text-gray-500 mt-1">Platform posts</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border border-pink-200">
              <h3 className="font-semibold text-pink-700 mb-2">Restricted Accounts</h3>
              <p className="text-3xl font-bold text-gray-900">{restrictedAccounts.length}</p>
              <p className="text-sm text-gray-500 mt-1">Accounts with active restrictions</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border border-pink-200">
              <div className="flex items-center gap-2 mb-2 text-pink-700">
                <Clock3 size={18} />
                <h3 className="font-semibold">Active Promo Countdowns</h3>
              </div>
              <p className="text-sm text-gray-600">
                Live timer view of all currently active promo code redemptions.
              </p>
            </div>

            {loading && (
              <div className="bg-white rounded-lg p-6 shadow-md border border-pink-200 md:col-span-2 xl:col-span-2">
                <p className="text-gray-600 text-sm">Loading dashboard data...</p>
              </div>
            )}

            {!loading && error && (
              <div className="bg-red-50 rounded-lg p-6 shadow-md border border-red-200 md:col-span-2 xl:col-span-2">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {activePromoEntries.length === 0 ? (
              <div className="bg-white rounded-lg p-6 shadow-md border border-pink-200 md:col-span-2 xl:col-span-2">
                <p className="text-gray-600 text-sm">No active promo code redemptions right now.</p>
              </div>
            ) : (
              activePromoEntries.map((entry, index) => (
                <div
                  key={`${entry.code}-${index}`}
                  className="relative bg-white rounded-lg p-6 shadow-md border border-pink-200"
                >
                  <span className="absolute right-4 top-4 inline-flex rounded-full bg-pink-100 px-2.5 py-1 text-xs font-semibold text-pink-700">
                    {entry.redeemedCount} redeemed
                  </span>
                  <div className="flex items-center gap-2 text-pink-700 mb-2">
                    <Ticket size={18} />
                    <h4 className="font-semibold">{entry.code}</h4>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Assigned: {entry.assignedUser}</p>
                  <div className="bg-pink-50 border border-pink-200 rounded-md px-3 py-2 text-pink-800 font-semibold text-sm">
                    Next Expiry In: {entry.countdown}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Nearest Expiry: {entry.expiresAt}</p>
                </div>
              ))
            )}

            <div className="bg-white rounded-lg p-6 shadow-md border border-pink-200 md:col-span-2 xl:col-span-3">
              <div className="flex items-center gap-2 mb-3 text-pink-700">
                <Ticket size={18} />
                <h3 className="font-semibold">All Promo Codes</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Full list of all promo codes created (active, inactive, redeemed, and expired).
              </p>

              {promoCodes.length === 0 ? (
                <p className="text-sm text-gray-500">No promo codes have been created yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border border-pink-100 rounded-lg overflow-hidden">
                    <thead className="bg-pink-50 text-pink-800">
                      <tr>
                        <th className="text-left px-3 py-2 font-semibold">Code</th>
                        <th className="text-left px-3 py-2 font-semibold">Assigned To</th>
                        <th className="text-left px-3 py-2 font-semibold">Duration</th>
                        <th className="text-left px-3 py-2 font-semibold">Usage</th>
                        <th className="text-left px-3 py-2 font-semibold">Status</th>
                        <th className="text-left px-3 py-2 font-semibold">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promoCodes.map((promo) => {
                        const assigned = promo?.assignedUser?.username || promo?.assignedUser?.email || "Any user";
                        const usageCount = Number(promo?.usageCount || 0);
                        const maxUses = Number(promo?.maxUses || 0);
                        const isExhausted = maxUses > 0 && usageCount >= maxUses;
                        const isInactive = !promo?.isActive || isExhausted;
                        const statusText = isInactive ? "Inactive" : "Active";

                        return (
                          <tr key={promo?._id || promo?.code} className="border-t border-pink-100 even:bg-pink-50/30">
                            <td className="px-3 py-2 font-semibold text-pink-700">{promo?.code || "-"}</td>
                            <td className="px-3 py-2 text-gray-700">{assigned}</td>
                            <td className="px-3 py-2 text-gray-700">{promo?.durationDays || 0} day(s)</td>
                            <td className="px-3 py-2 text-gray-700">{usageCount}/{maxUses}</td>
                            <td className="px-3 py-2">
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                  isInactive
                                    ? "bg-gray-100 text-gray-600"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {statusText}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-gray-600">
                              {promo?.createdAt ? new Date(promo.createdAt).toLocaleString() : "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === "messages" && (
          <div className="bg-white rounded-lg p-0 shadow-md border border-pink-200 overflow-hidden">
            <AdminMessages />
          </div>
        )}
      </main>
    </div>
  );
}
