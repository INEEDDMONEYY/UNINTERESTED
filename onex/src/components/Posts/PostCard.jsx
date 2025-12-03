import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import axios from "axios";

export default function PostCard({ post }) {
  if (!post) return null;

  // Safely extract user info from populated userId
  const username = post.userId?.username || "Unknown";
  const bio = post.userId?.bio || "";
  const profilePic = post.userId?.profilePic || "";

  // ✅ Get logged-in user
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isOwner = user._id && post.userId?._id === user._id;

  // ------------------- Delete Post -------------------
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`, // ensure JWT is stored
        },
      });
      alert("Post deleted successfully");
      window.location.reload(); // refresh feed after deletion
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Error deleting post");
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-pink-500 via-black to-yellow-500 p-[2px] rounded-lg shadow-lg max-w-sm sm:max-w-md md:max-w-lg lg:max-w-sm mx-auto sm:mx-0 transition-transform hover:scale-[1.02]">
      <div className="bg-white rounded-lg p-4 relative">
        <Link
          to={`/post/${post._id}`}
          className="block relative hover:shadow-xl transition"
        >
          {/* 🏷️ Visibility Badge */}
          {post.visibility && (
            <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs sm:text-sm font-semibold px-2 py-1 rounded-full shadow-md">
              {post.visibility === "Both"
                ? "See's Both"
                : `See's Only: ${post.visibility}`}
            </div>
          )}

          {/* 🖼️ Post Picture */}
          <div className="mb-4">
            {post.picture ? (
              <img
                src={post.picture}
                alt="Post"
                className="w-auto h-48 sm:h-20 md:h-28 lg:h-28 rounded-md object-cover border border-pink-300"
              />
            ) : (
              <div className="w-full h-48 sm:h-40 md:h-52 lg:h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-md">
                No Image
              </div>
            )}
          </div>

          {/* 📝 Post Content */}
          <div>
            {/* User Info */}
            <div className="flex items-center gap-2 mb-1">
              {profilePic && (
                <img
                  src={profilePic}
                  alt={username}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-pink-300"
                />
              )}
              <h2 className="text-xl sm:text-2xl font-bold text-pink-600 break-words">
                {username}
              </h2>
            </div>

            {bio && (
              <p className="text-sm sm:text-base text-gray-500 mb-2 break-words">
                {bio}
              </p>
            )}

            <h4 className="text-sm sm:text-base text-black mt-2 break-words font-semibold">
              {post.title || "No title provided."}
            </h4>

            <div className="overflow-hidden">
              <p className="text-sm sm:text-base text-gray-700 mt-2 break-words">
                {post.description || "No description provided."}
              </p>
            </div>

            <p className="text-sm sm:text-base text-gray-700 mt-2 break-words">
              {post.city && post.state
                ? `${post.city}, ${post.state}`
                : "Location not specified."}
            </p>

            {post.createdAt && (
              <p className="text-gray-400 text-xs mt-1">
                Posted on {new Date(post.createdAt).toLocaleString()}
              </p>
            )}
          </div>

          {/* 🗑️ Delete Icon for Owner */}
          {isOwner && (
            <button
              onClick={handleDelete}
              className="absolute bottom-2 right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition"
              title="Delete Post"
            >
              <Trash2 size={18} />
            </button>
          )}
        </Link>
      </div>
    </div>
  );
}
