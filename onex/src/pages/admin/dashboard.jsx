import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

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
        <h1 className="text-3xl font-bold text-pink-700 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 text-lg mb-6">
          Welcome back, <span className="font-semibold text-black">{user.username}</span>
        </p>

        {/* Stats Section */}
        {loading ? (
          <p className="text-gray-600 mb-6">Loading stats...</p>
        ) : error ? (
          <p className="text-red-600 mb-6">Error: {error}</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Management */}
          <div className="bg-pink-200 rounded-lg p-4 shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-pink-800 mb-2">User Management</h2>
            <p className="text-gray-700 mb-4">View, edit, or promote users.</p>
            <button className="bg-pink-700 text-white px-4 py-2 rounded hover:bg-pink-800">Manage Users</button>
          </div>

          {/* Analytics */}
          <div className="bg-pink-200 rounded-lg p-4 shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-pink-800 mb-2">Site Analytics</h2>
            <p className="text-gray-700 mb-4">Monitor traffic and engagement.</p>
            <button className="bg-pink-700 text-white px-4 py-2 rounded hover:bg-pink-800">View Reports</button>
          </div>

          {/* Settings */}
          <div className="bg-pink-200 rounded-lg p-4 shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-pink-800 mb-2">Settings</h2>
            <p className="text-gray-700 mb-4">Configure platform preferences.</p>
            <button className="bg-pink-700 text-white px-4 py-2 rounded hover:bg-pink-800">Go to Settings</button>
          </div>

          {/* Logout */}
          <div className="bg-pink-200 rounded-lg p-4 shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-pink-800 mb-2">Logout</h2>
            <p className="text-gray-700 mb-4">End your admin session securely.</p>
            <button
              onClick={handleLogout}
              className="bg-pink-700 text-white px-4 py-2 rounded hover:bg-pink-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
