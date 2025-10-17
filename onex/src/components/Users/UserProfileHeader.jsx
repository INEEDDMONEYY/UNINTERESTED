import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router
import axios from 'axios';

export default function UserProfileHeader() {
  const { userId } = useParams(); // Get user ID from route
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await axios.get(`/api/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center py-10 text-red-500">User not found.</div>;
  }

  return (
    <div className="flex flex-col items-center text-center py-10 px-6 md:px-12 lg:px-20 bg-white rounded-xl shadow-md">
      {/* 🖼️ Avatar */}
      <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="User avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">No Avatar</div>
        )}
      </div>

      {/* 🧑 Name + Bio */}
      <h2 className="text-xl font-bold text-pink-600">{user.name}</h2>
      <p className="text-sm text-gray-600 mt-2 max-w-md">{user.bio || 'No bio available.'}</p>

      {/* 💬 Comment Button */}
      <button
        onClick={() => window.location.href = `/profile/${userId}/comment`}
        className="mt-6 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition"
      >
        Leave a Comment
      </button>
    </div>
  );
}
