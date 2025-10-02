import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Users,
  Settings,
  BarChart2,
  LogOut,
  Home
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://uninterested.onrender.com/admin/stats', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-300 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-pink-700">Admin Dashboard</h1>
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-sm bg-pink-200 hover:bg-pink-300 text-pink-800 px-3 py-1 rounded"
          >
            <Home size={16} /> Return Home
          </button>
        </div>

        {/* Greeting */}
        <p className="text-gray-600 text-lg mb-4">
          Welcome back, <span className="font-semibold text-black">{user.username}</span>
        </p>

        {/* Site Analytics */}
        {loading ? (
          <p className="text-gray-600 mb-4">Loading site analytics...</p>
        ) : error ? (
          <p className="text-red-600 mb-4">Error: {error}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-pink-300 rounded-lg p-4 shadow-sm">
              <h3 className="text-pink-700 font-semibold text-lg">Total Users</h3>
              <p className="text-black text-xl">{stats.totalUsers}</p>
            </div>
            <div className="bg-white border border-pink-300 rounded-lg p-4 shadow-sm">
              <h3 className="text-pink-700 font-semibold text-lg">Total Admins</h3>
              <p className="text-black text-xl">{stats.totalAdmins}</p>
            </div>
          </div>
        )}

        {/* Dashboard Items */}
        <ul className="space-y-4 mb-6">
          <li
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/admin/users')}
            title="View, edit, or promote users"
          >
            <Users className="text-pink-700 group-hover:scale-110 transition" />
            <span className="text-black font-medium group-hover:text-pink-700">
              User Management
            </span>
          </li>
          <li
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/admin/settings')}
            title="Configure platform preferences"
          >
            <Settings className="text-pink-700 group-hover:scale-110 transition" />
            <span className="text-black font-medium group-hover:text-pink-700">
              Settings
            </span>
          </li>
          <li
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/analytics')}
            title="Monitor traffic and engagement"
          >
            <BarChart2 className="text-pink-700 group-hover:scale-110 transition" />
            <span className="text-black font-medium group-hover:text-pink-700">
              Site Analytics
            </span>
          </li>
        </ul>

        {/* Sign Out */}
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-pink-700 text-white px-4 py-2 rounded hover:bg-pink-800 transition"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
