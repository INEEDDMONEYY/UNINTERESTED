// 📦 External Libraries 
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FEATURE_FLAGS } from '../../config/featureFlags';

// 🌀 Loaders & Components
import PostDetailLoader from '../Loaders/PostDetailLoader';
//import UserProfile from '../../pages/profiles/ProfilePage';
import UserAvailabilityDisplay from '../UserDisplay/UserAvailabilityDisplay';
import UserMeetupDisplay from '../UserDisplay/UserMeetupDisplay';

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load availability from localStorage (availability feature is disabled until future update)
  const [availability, setAvailability] = useState(() => {
    const saved = localStorage.getItem("availability");
    return saved ? JSON.parse(saved) : { status: "" };
  });

  // ✅ Load meetup prices from localStorage
  const [incallPrice, setIncallPrice] = useState(() => {
    return localStorage.getItem("incallPrice") || "";
  });
  const [outcallPrice, setOutcallPrice] = useState(() => {
    return localStorage.getItem("outcallPrice") || "";
  });

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

  if (loading) return <PostDetailLoader />;
  if (!post) {
    return (
      <div className="text-center py-10 text-red-500">
        Post not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white rounded-xl shadow-md m-5 relative">
      {/* 🖼️ Post Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {Array.isArray(post.pictures) && post.pictures.length > 0 ? (
          post.pictures.map((pic, idx) => (
            <img
              key={idx}
              src={pic}
              alt={`Post image ${idx + 1}`}
              className="w-full h-auto object-cover rounded-md"
            />
          ))
        ) : post.picture ? (
          <img
            src={post.picture}
            alt="Post"
            className="w-full h-auto object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-md col-span-full">
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

      {/* 🟢 User Availability */}
      {FEATURE_FLAGS.ENABLE_VIEW_ACTIVITY && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">User Availability</h3>
          <div className="h-auto overflow-hidden p-1">
            <UserAvailabilityDisplay availability={availability} />
          </div>
        </div>
      )}

      {/* 💲 User Meetup Prices */}
      {FEATURE_FLAGS.MEETUP_SERVICE_SETTINGS && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Meetup Prices</h3>
          <div className="h-auto overflow-hidden p-1">
            <UserMeetupDisplay incallPrice={incallPrice} outcallPrice={outcallPrice} />
          </div>
        </div>
      )}

      {/* 📅 Timestamp */}
      {post.createdAt && (
        <p className="text-xs text-gray-400 mb-6">
          Posted on {new Date(post.createdAt).toLocaleString()}
        </p>
      )}

      {/* 💬 Comment Section Placeholder */}
      {FEATURE_FLAGS.ENABLE_COMMENTS && (
        <div className="mt-8 border-t pt-6 mb-7">
          <h3 className="text-lg font-semibold text-pink-500 mb-2">Comments</h3>
          <p className="text-sm text-gray-500">Comment functionality coming soon...</p>
        </div>
      )}

      {/* 🔘 Action Buttons */}
      <div className="flex flex-row justify-between items-center mt-8">
        <button
          onClick={() => navigate('/home')}
          className="px-4 py-2 text-[12px] text-white font-medium rounded-lg shadow-md transition-all hover:opacity-90 bg-gradient-to-r from-yellow-400 via-black to-pink-500"
        >
          Return to posts
        </button>

        {FEATURE_FLAGS.ENABLE_PUBLIC_PROFILE && (
          <button
            onClick={() => navigate(`/profile/${post.username}`)}
            className="px-4 py-2 text-[12px] text-white font-medium rounded-lg shadow-md transition-all hover:opacity-90 bg-gradient-to-r from-pink-500 via-black to-yellow-400"
          >
            View profile
          </button>
        )}
      </div>
    </div>
  );
}
