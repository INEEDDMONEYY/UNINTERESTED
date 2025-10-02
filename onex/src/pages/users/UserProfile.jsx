import { useState } from 'react';

export default function UserProfile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [username, setUsername] = useState(user.username || '');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    if (profilePic) formData.append('profilePic', profilePic);

    fetch('https://uninterested.onrender.com/user/update-profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData,
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        alert('Profile updated successfully!');
        // Clear inputs after successful update
        setUsername('');
        setPassword('');
        setProfilePic(null);
      })
      .catch(err => {
        console.error('Error updating profile:', err);
        alert('Failed to update profile.');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-300 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md space-y-6 border border-white"
        encType="multipart/form-data"
      >
        <h1 className="text-2xl font-bold text-pink-700 text-center">Edit Profile Settings</h1>

        {/* Profile Picture Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])}
            className="w-full border border-white rounded px-3 py-2"
          />
        </div>

        {/* Username Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-white rounded px-3 py-2"
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-white rounded px-3 py-2"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

