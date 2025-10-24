import { useState, useEffect } from 'react';

export default function PostCard() {
  // 🧠 Local state for post data
  const [picture, setPicture] = useState(null);
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');

  // 🧪 Simulate fetching post data (static test data)
  useEffect(() => {
    // Replace this with actual backend fetch logic later
    const testPicture = 'https://via.placeholder.com/150'; // Placeholder image URL
    const testUsername = 'TestUser123';
    const testDescription = 'This is a sample post description for testing purposes.';

    setPicture(testPicture);
    setUsername(testUsername);
    setDescription(testDescription);
  }, []);

  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-4 mx-auto sm:mx-0">
      {/* 🖼️ Post Picture */}
      <div className="mb-4">
        {picture ? (
          <img
            src={picture}
            alt="Post"
            className="w-full h-48 sm:h-40 rounded-md object-cover"
          />
        ) : (
          <div className="w-full h-48 sm:h-40 bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-md">
            No Image
          </div>
        )}
      </div>

      {/* 📝 Post Content */}
      <div>
        <h2 className="text-xl font-bold text-pink-600 break-words">{username}</h2>
        <p className="text-sm text-gray-700 mt-2 break-words">{description}</p>
      </div>
    </div>
  );
}
