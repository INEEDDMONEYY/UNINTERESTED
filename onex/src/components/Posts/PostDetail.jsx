import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${postId}`);
        setPost(data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading post...</div>;
  }

  if (!post) {
    return <div className="text-center py-10 text-red-500">Post not found.</div>;
  }

  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-10 bg-white rounded-xl shadow-md m-5 relative">
        {/* 🖼️ Post Image */}
        <div className="mb-6">
          {post.picture ? (
            <img
              src={post.picture}
              alt="Post"
              className="w-full h-auto rounded-md object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-md">
              No Image Available
            </div>
          )}
        </div>

        {/* 🧑 Username + Title */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-pink-600">{post.title || "Untitled Post"}</h2>
          <p className="text-sm text-gray-500 mt-1">by {post.username || "Anonymous"}</p>
        </div>

        {/* 📝 Description */}
        <p className="text-gray-700 text-base mb-6">{post.description || "No description provided."}</p>

        {/* 📅 Timestamp */}
        {post.createdAt && (
          <p className="text-xs text-gray-400">
            Posted on {new Date(post.createdAt).toLocaleString()}
          </p>
        )}

        {/* 💬 Comment Section Placeholder */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold text-pink-500 mb-2">Comments</h3>
          <p className="text-sm text-gray-500">Comment functionality coming soon...</p>
        </div>

        {/* 🔙 Return to Posts Button */}
        <div className="absolute bottom-6 right-6">
          <button
            onClick={() => navigate('/home')}
            className="px-5 py-2 text-white text-sm font-medium rounded-lg shadow-md transition-all hover:opacity-90 bg-gradient-to-r from-yellow-400 via-black to-pink-500"
          >
            Return to posts
          </button>
        </div>
      </div>
    </>
  );
}
