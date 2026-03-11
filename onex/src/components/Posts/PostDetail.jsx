// 📦 External Libraries
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FEATURE_FLAGS } from "../../config/featureFlags";
import api from "../../utils/api";

// 🌀 Loaders & Components
import PostDetailLoader from "../Loaders/PostDetailLoader";
import UserAvailabilityDisplay from "../UserDisplay/UserAvailabilityDisplay";
import UserMeetupDisplay from "../UserDisplay/UserMeetupDisplay";

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [availability, setAvailability] = useState({ status: "" });
  const [incallPrice, setIncallPrice] = useState("");
  const [outcallPrice, setOutcallPrice] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setFetchError("");
        const { data } = await api.get(`/posts/${postId}`);

        console.log("✅ Post fetched:", data); // Debug log

        setPost(data);

        // Set availability from populated user profile
        setAvailability(data.userId?.availability || { status: "" });

        // Set meetup prices from populated user profile
        setIncallPrice(data.userId?.incallPrice || "");
        setOutcallPrice(data.userId?.outcallPrice || "");
      } catch (err) {
        console.error("Failed to fetch post:", err);
        console.error("Error response:", err.response?.data); // Debug log
        setPost(null);
        const status = err?.response?.status;
        const backendMessage = err?.response?.data?.error;
        if (!status) {
          setFetchError("Unable to reach the server. Please check your connection or deployment API URL.");
        } else if (status === 404) {
          setFetchError("This post could not be found. It may have been deleted or the link is invalid.");
        } else {
          setFetchError(backendMessage || `Failed to load post details (HTTP ${status}).`);
        }
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
        <p className="font-semibold">Post not found.</p>
        {fetchError && <p className="mt-2 text-sm text-red-400">{fetchError}</p>}
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
        <h2 className="text-2xl font-bold text-pink-600">
          {post.title || "Untitled Post"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          by {post.userId?.username || "Anonymous"}
        </p>
      </div>

      {/* 📝 Description */}
      <p className="text-gray-700 text-base mb-6">
        {(post.description || "No description provided.")
          .split(/(?<=[.!?])\s+/)
          .map((sentence, i) => (
            <span key={i}>
              {sentence}
              <br />
            </span>
          ))}
      </p>

      {/* 🟢 User Availability */}
      {FEATURE_FLAGS.ENABLE_DISPLAY_AVAILABILITY && (
        <div className="mb-6">
          <div className="h-auto overflow-hidden p-1">
            <UserAvailabilityDisplay availability={availability} />
          </div>
        </div>
      )}

      {/* 💲 User Meetup Prices */}
      {FEATURE_FLAGS.MEETUP_SERVICE_SETTINGS && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">
            Meetup Prices
          </h3>
          <div className="h-auto overflow-hidden p-1">
            <UserMeetupDisplay
              incallPrice={incallPrice}
              outcallPrice={outcallPrice}
            />
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
          <p className="text-sm text-gray-500">
            Comment functionality coming soon...
          </p>
        </div>
      )}

      {/* 🔘 Action Buttons */}
      <div className="flex flex-row justify-between items-center mt-8">
        <button
          onClick={() => navigate("/home")}
          className="px-4 py-2 text-[12px] text-white font-medium rounded-lg shadow-md transition-all hover:opacity-90 bg-gradient-to-r from-yellow-400 via-black to-pink-500"
        >
          Return to posts
        </button>

        {FEATURE_FLAGS.ENABLE_PUBLIC_PROFILE && (
          <button
            onClick={() => navigate(`/profile/${post.userId?.username || ""}`)}
            className="px-4 py-2 text-[12px] text-white font-medium rounded-lg shadow-md transition-all hover:opacity-90 bg-gradient-to-r from-pink-500 via-black to-yellow-400"
          >
            View profile
          </button>
        )}
      </div>
    </div>
  );
}