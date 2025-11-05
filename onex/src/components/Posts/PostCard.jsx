import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  if (!post) return null;

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
            <h2 className="text-xl sm:text-2xl font-bold text-pink-600 break-words">
              {post.username || "Unknown"}
            </h2>
            <h4 className="text-sm sm:text-base text-black mt-2 break-words font-semibold">
              {post.title || "No title provided."}
            </h4>
            <div className="overflow-hidden">
              <p className="text-sm sm:text-base text-gray-700 mt-2 break-words">
                {post.description || "No description provided."}
              </p>
            </div>
            <p className="text-sm sm:text-base text-gray-700 mt-2 break-words">
              {post.city && post.state ? `${post.city}, ${post.state}` : "Location not specified."}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
