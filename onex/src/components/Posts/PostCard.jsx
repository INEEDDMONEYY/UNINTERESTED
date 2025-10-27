import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PostCard() {
  const [picture, setPicture] = useState(null);
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ""}/api/posts`);
        const sortedPosts = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];

        const latestPost = sortedPosts.length > 0 ? sortedPosts[0] : null;

        if (latestPost) {
          setPicture(latestPost.picture || null);
          setUsername(latestPost.username || 'Unknown');
          setDescription(latestPost.description || '');
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-gray-500 text-lg">
        Loading post...
      </div>
    );
  }

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
