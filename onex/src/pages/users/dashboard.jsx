import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import UserProfile from './UserProfile.jsx';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [activeView, setActiveView] = useState('dashboard');
  const [recentPosts, setRecentPosts] = useState([]);
  const [adminMessage, setAdminMessage] = useState({ title: '', description: '' });

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/home');
  };

  useEffect(() => {
    fetch('https://uninterested.onrender.com/user/recent-posts', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setRecentPosts(data.slice(0, 10)))
      .catch(err => console.error('Error fetching recent posts:', err));
  }, []);

  const handleAdminMessageSubmit = (e) => {
    e.preventDefault();
    fetch('https://uninterested.onrender.com/user/contact-admin', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminMessage),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(() => {
        alert('Message sent to admin!');
        setAdminMessage({ title: '', description: '' });
      })
      .catch(err => {
        console.error('Error sending message:', err);
        alert('Failed to contact admin.');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-300 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-lg p-6 flex flex-col items-center justify-center md:justify-between">
        <div className="w-full flex flex-col items-center">
          <div className="w-24 h-24 mb-4">
            <img
              src={user.image || 'https://via.placeholder.com/96'}
              alt={`${user.username}'s profile`}
              className="w-full h-full rounded-full object-cover border-2 border-pink-400"
            />
          </div>
          <h2 className="text-xl font-bold text-pink-700 mb-2 text-center">
            Welcome, {user.username || 'Guest'}!
          </h2>
          <nav className="mt-6 w-full space-y-3 text-sm">
            <button onClick={() => setActiveView('profile')} className="w-full text-left px-4 py-2 rounded hover:bg-pink-100 text-pink-800 font-medium">✏️ Edit Profile</button>
            <button onClick={() => setActiveView('activity')} className="w-full text-left px-4 py-2 rounded hover:bg-pink-100 text-pink-800 font-medium">📊 View Activity</button>
            <button onClick={handleSignOut} className="w-full text-left px-4 py-2 rounded bg-pink-200 hover:bg-pink-300 text-pink-800 font-medium mt-6">🔒 Sign Out</button>
            <Link to="/home" className="block text-left px-4 py-2 rounded text-gray-600 hover:text-pink-700 mt-2">← Return Home</Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-600 mb-4">
          <ol className="list-reset flex items-center gap-2">
            <li>
              <button onClick={() => setActiveView('dashboard')} className="text-pink-700 hover:underline">Dashboard</button>
            </li>
            {activeView !== 'dashboard' && (
              <>
                <li>/</li>
                <li className="text-gray-800 font-medium">
                  {activeView === 'profile' ? 'Edit Profile' : 'Activity'}
                </li>
              </>
            )}
          </ol>
        </nav>

        {/* Dynamic View */}
        {activeView === 'profile' ? (
          <div>
            <h1 className="text-2xl font-bold text-pink-700 mb-2">Edit Your Profile</h1>
            <p className="text-gray-700">Settings not right, change them!</p>
            <UserProfile />
          </div>
        ) : activeView === 'activity' ? (
          <div>
            <h1 className="text-2xl font-bold text-pink-700 mb-2">Your Activity</h1>
            <p className="text-gray-700">This is where user activity will be displayed.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Dashboard Overview */}
            <div>
              <h1 className="text-3xl font-bold text-pink-700 mb-4">Your Dashboard</h1>
              <p className="text-gray-700">Here you can manage your profile, track your activity, and stay connected with the platform.</p>
            </div>

            {/* Recent Posts */}
            <section>
              <h2 className="text-xl font-bold text-pink-700 mb-4">Your Recent Posts</h2>
              {recentPosts.length > 0 ? (
                <ul className="space-y-3">
                  {recentPosts.map((post, index) => (
                    <li key={index} className="bg-white rounded-lg p-4 shadow border border-pink-100">
                      <h3 className="text-pink-700 font-semibold">{post.title}</h3>
                      <p className="text-gray-700 text-sm">{post.content}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No recent posts found.</p>
              )}
            </section>

            {/* Contact Admin */}
            <section>
              <h2 className="text-xl font-bold text-pink-700 mb-4">Contact an Admin</h2>
              <form
                onSubmit={handleAdminMessageSubmit}
                className="space-y-4 p-6 rounded-xl backdrop-blur-md bg-white/30 border border-white shadow-lg"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={adminMessage.title}
                    onChange={(e) => setAdminMessage({ ...adminMessage, title: e.target.value })}
                    className="w-full border border-white rounded px-3 py-2 bg-white/60"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={adminMessage.description}
                    onChange={(e) => setAdminMessage({ ...adminMessage, description: e.target.value })}
                    className="w-full border border-white rounded px-3 py-2 bg-white/60"
                    rows={4}
                    required
                  />
                </div>
                <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition">
                  Send Message
                </button>
              </form>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
