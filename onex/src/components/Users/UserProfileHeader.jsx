import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function UserProfileHeader({ refreshKey }) {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await axios.get(`/api/users/${userId}`);
        setUser(response.data);
        setProfileImage(response.data.profilePic || null);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [userId, refreshKey]); // ✅ re-fetch when refreshKey changes

  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackgroundImage(URL.createObjectURL(file));
    }
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center py-10 text-red-500">User not found.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg bg-white">
      {/* Background Section */}
      <div className="relative w-full h-64 bg-gray-200">
        {backgroundImage ? (
          <img src={backgroundImage} alt="Background" className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No Background Image
          </div>
        )}

        <div className="absolute top-4 right-4">
          <label className="bg-white text-sm px-3 py-1 rounded shadow cursor-pointer hover:bg-pink-100">
            Upload Background
            <input type="file" accept="image/*" onChange={handleBackgroundUpload} className="hidden" />
          </label>
        </div>

        <div className="absolute bottom-[-48px] left-6 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No Avatar
            </div>
          )}
        </div>

        <div className="absolute bottom-[-12px] left-32">
          <label className="bg-white text-xs px-2 py-1 rounded shadow cursor-pointer hover:bg-pink-100">
            Update Avatar
            <input type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Info Section */}
      <div className="pt-20 pb-8 px-6 text-center">
        <h2 className="text-2xl font-bold text-pink-600">{user.name || user.username}</h2>
        <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto">
          {user.bio || 'No bio available.'}
        </p>
      </div>
    </div>
  );
}
