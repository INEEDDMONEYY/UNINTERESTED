import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function PostCard() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL || ""}/api/posts`
        );
        const sortedPosts = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];

        const latestPost = sortedPosts.length > 0 ? sortedPosts[0] : null;

        if (latestPost) {
          setPost(latestPost);
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

  if (!post) {
    return (
      <div className="text-center text-red-500 py-10">
        No post found.
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-r from-pink-500 via-black to-yellow-500 p-[2px] rounded-lg shadow-lg max-w-sm sm:max-w-md md:max-w-lg lg:max-w-sm mx-auto sm:mx-0 transition-transform hover:scale-[1.02]">
      <div className="bg-white rounded-lg p-4">
        <Link
          to={`/post/${post._id}`}
          className="block relative hover:shadow-xl transition"
        >
          {/* 🏷️ Visibility Badge */}
          {post.visibility && (
            <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs sm:text-sm font-semibold px-2 py-1 rounded-full shadow-md">
              {post.visibility === "Both"
                ? "See's for All"
                : `See's Only: ${post.visibility}`}
            </div>
          )}

          {/* 🖼️ Post Picture */}
          <div className="mb-4">
            {post.picture ? (
              <img
                src={post.picture}
                alt="Post"
                className="w-full h-48 sm:h-40 md:h-52 lg:h-48 rounded-md object-cover"
              />
            ) : (
              <div className="w-full h-48 sm:h-40 md:h-52 lg:h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-md">
                No Image
              </div>
            )}
          </div>

          {/* 📝 Post Content */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-pink-600 break-words">
              {post.username || "Unknown"}
            </h2>
            <p className="text-sm sm:text-base text-gray-700 mt-2 break-words">
              {post.title || "No title provided."}
            </p>
            <p className="text-sm sm:text-base text-gray-700 mt-2 break-words">
              {post.description || "No description provided."}
            </p>
            <p className="text-sm sm:text-base text-gray-700 mt-2 break-words">
              {post.city || "No city provided."}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
