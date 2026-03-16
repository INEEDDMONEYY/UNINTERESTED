import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import api from '../../utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminAnalytics({ embed = false }) {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('7d');
  const [userType, setUserType] = useState('all');
  const [activityType, setActivityType] = useState('all');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/admin/settings/analytics', {
          params: {
            range: dateRange,
            userType,
            activityType,
          },
        });

        setAnalytics(res?.data?.data || null);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.error || err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange, userType, activityType]);

  // Line chart for traffic
  const lineData = {
    labels: analytics?.traffic?.map(item => format(new Date(item.date), 'MMM d')) || [],
    datasets: [
      {
        label: 'Site Traffic',
        data: analytics?.traffic?.map(item => item.visits) || [],
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        tension: 0.4
      }
    ]
  };

  // Bar chart for posts
  const barData = {
    labels: analytics?.signups?.map(item => format(new Date(item.date), 'MMM d')) || [],
    datasets: [
      {
        label: 'New Sign Ups',
        data: analytics?.signups?.map(item => item.count) || [],
        backgroundColor: '#f472b6'
      }
    ]
  };

  const averageBrowseSeconds = analytics?.session?.averageBrowseSeconds || 0;
  const averageBrowseMinutes = (averageBrowseSeconds / 60).toFixed(1);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading analytics...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Optional breadcrumbs/header */}
      {!embed && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <nav className="text-sm text-gray-600 mb-2 md:mb-0">
            <ol className="list-reset flex items-center gap-2">
              <li>
                <button onClick={() => navigate('/admin')} className="text-pink-700 hover:underline">
                  Admin Dashboard
                </button>
              </li>
              <li>/</li>
              <li className="text-gray-800 font-medium">Site Analytics</li>
            </ol>
          </nav>
          <button
            onClick={() => navigate('/admin')}
            className="bg-pink-200 text-pink-800 px-3 py-1 rounded hover:bg-pink-300 text-sm font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      )}

      <h1 className="text-3xl font-bold text-pink-700 mb-4">Site Analytics</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={dateRange}
          onChange={e => setDateRange(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>

        <select
          value={userType}
          onChange={e => setUserType(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="all">All Users</option>
          <option value="admin">Admins</option>
          <option value="user">Regular Users</option>
        </select>

        <select
          value={activityType}
          onChange={e => setActivityType(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="all">All Activity</option>
          <option value="posts">Posts</option>
          <option value="logins">Logins</option>
          <option value="comments">Comments</option>
        </select>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-pink-50 p-4 rounded shadow w-full">
          <p className="text-sm text-gray-500">Total Visits</p>
          <p className="text-2xl font-bold text-pink-700">{analytics?.summary?.totalVisits || 0}</p>
        </div>
        <div className="bg-pink-50 p-4 rounded shadow w-full">
          <p className="text-sm text-gray-500">Total Sign Ups</p>
          <p className="text-2xl font-bold text-pink-700">{analytics?.summary?.totalSignups || 0}</p>
        </div>
        <div className="bg-pink-50 p-4 rounded shadow w-full">
          <p className="text-sm text-gray-500">Avg Browse Time</p>
          <p className="text-2xl font-bold text-pink-700">{averageBrowseMinutes} min</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-pink-50 p-4 rounded shadow w-full">
          <h2 className="text-lg font-semibold text-pink-700 mb-2">Traffic Over Time</h2>
          {lineData.labels.length ? <Line data={lineData} /> : <div className="text-gray-500">No traffic data available</div>}
        </div>

        <div className="bg-pink-50 p-4 rounded shadow w-full">
          <h2 className="text-lg font-semibold text-pink-700 mb-2">Sign Ups Over Time</h2>
          {barData.labels.length ? <Bar data={barData} /> : <div className="text-gray-500">No signup data available</div>}
        </div>
      </div>
    </div>
  );
}
