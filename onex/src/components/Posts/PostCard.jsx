import { Link } from "react-router-dom";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function PostCard({ post, onDelete }) {
  // -------------------- Carousel State --------------------
  const [currentImage, setCurrentImage] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const totalImages = post?.pictures?.length || 0;

  // Reset carousel when images change
  useEffect(() => {
    setCurrentImage(0);
  }, [post?.pictures]);

  if (!post || isDeleted) return null;

  // -------------------- User Info --------------------
  const username = post.userId?.username || "Unknown";
  const bio = post.userId?.bio || "";
  const profilePic = post.userId?.profilePic || "";

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isOwner = user._id && post.userId?._id === user._id;

  // -------------------- Promo Status --------------------
  const getPostStatus = () => {
    if (post.isPromo) {
      const expiryDate = post.promoExpiresAt ? new Date(post.promoExpiresAt) : null;
      const now = new Date();
      if (expiryDate && now < expiryDate) {
        return { type: "promo", label: "PROMO", color: "bg-blue-500" };
      } else {
        return { type: "promo-expired", label: "PROMO EXPIRED", color: "bg-gray-500" };
      }
    }
    return { type: "paid", label: "PAID", color: "bg-purple-500" };
  };

  const postStatus = getPostStatus();

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % totalImages);
  };

  // -------------------- Delete Post --------------------
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Delete this post from UI and database?")) return;
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      await api.delete(`/posts/${post._id}`);

      window.dispatchEvent(
        new CustomEvent("app-toast", {
          detail: {
            type: "success",
            message: "Post deleted successfully.",
          },
        })
      );

      if (typeof onDelete === "function") {
        onDelete(post._id);
      }

      setIsDeleted(true);
    } catch (err) {
      console.error("Failed to delete post:", err?.response?.data || err.message);
      alert(err?.response?.data?.error || "Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <div className="relative bg-gradient-to-r from-pink-500 via-black to-yellow-500 p-[2px] rounded-lg shadow-lg max-w-sm sm:max-w-md md:max-w-lg lg:max-w-sm mx-auto sm:mx-0 transition-transform hover:scale-[1.02]">
      <div className="bg-white rounded-lg p-4 relative">

        {/* -------------------- Image Carousel -------------------- */}
        <div className="mb-4 relative">
          {totalImages > 0 ? (
            <>
              {post.pictures[currentImage] ? (
                <img
                  src={post.pictures[currentImage]}
                  alt={`Post image ${currentImage + 1}`}
                  className="w-full h-48 sm:h-40 md:h-52 lg:h-48 rounded-md object-cover border border-pink-300"
                />
              ) : (
                <div className="w-full h-48 sm:h-40 md:h-52 lg:h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-md">
                  No Image
                </div>
              )}

              {totalImages > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition"
                    title="Previous"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition"
                    title="Next"
                  >
                    <ChevronRight size={20} />
                  </button>

                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {post.pictures.map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-2 h-2 rounded-full ${
                          idx === currentImage ? "bg-pink-600" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-48 sm:h-40 md:h-52 lg:h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-md">
              No Image
            </div>
          )}
        </div>

        {/* -------------------- Link wraps only content -------------------- */}
        <Link to={`/posts/${post._id}`} className="block hover:shadow-xl transition">

          {/* Status Tags */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1">
            <div
              className={`${postStatus.color} text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full shadow-md`}
            >
              {postStatus.label}
            </div>
          </div>

          {/* Visibility Badge */}
          {post.visibility && (
            <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs sm:text-sm font-semibold px-2 py-1 rounded-full shadow-md">
              {post.visibility === "Both"
                ? "See's Both"
                : `See's Only: ${post.visibility}`}
            </div>
          )}

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
        </Link>

        {/* Delete Button */}
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute bottom-2 right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
            title="Delete Post"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
