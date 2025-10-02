import { useNavigate } from 'react-router';

export default function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-300 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center">
        {/* Profile Picture */}
        <div className="w-24 h-24 mb-4">
          <img
            src={user.image || 'https://via.placeholder.com/96'}
            alt={`${user.username}'s profile`}
            className="w-full h-full rounded-full object-cover border-2 border-pink-400"
          />
        </div>

        {/* Greeting */}
        <h1 className="text-2xl font-bold text-pink-700 mb-2">
          Welcome, {user.username || 'Guest'}!
        </h1>
        <p className="text-gray-700 mb-6">
          This is your personal dashboard. You can view your activity, update your profile, and explore the platform.
        </p>

        {/* Return Home Button */}
        <button
          onClick={() => navigate('/home')}
          className="bg-pink-200 text-pink-800 px-4 py-2 rounded hover:bg-pink-300 transition"
        >
          ← Return Home
        </button>
      </div>
    </div>
  );
}
