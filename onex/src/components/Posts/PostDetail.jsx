// 📦 External Libraries
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { FEATURE_FLAGS } from "../../config/featureFlags";
import api from "../../utils/api";
import { UserContext } from "../../context/UserContext";

// 🌀 Loaders & Components
import PostDetailLoader from "../Loaders/PostDetailLoader";
import UserAvailabilityDisplay from "../UserDisplay/UserAvailabilityDisplay";
import UserMeetupDisplay from "../UserDisplay/UserMeetupDisplay";

const formatPhoneNumber = (value = "") => {
  const digits = String(value).replace(/\D/g, "").slice(0, 10);
  if (!digits) return "";
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const hasActivePromotion = (expiry) => {
  if (!expiry) return false;
  const date = new Date(expiry);
  return !Number.isNaN(date.getTime()) && date.getTime() > Date.now();
};

const getPostedAgoLabel = (createdAt) => {
  if (!createdAt) return "";

  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return "";

  const diffMs = Date.now() - created.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diffMs < minute) return "Posted just now";
  if (diffMs < hour) {
    const minutes = Math.floor(diffMs / minute);
    return `Posted ${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `Posted ${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (diffMs < week) {
    const days = Math.floor(diffMs / day);
    return `Posted ${days} day${days === 1 ? "" : "s"} ago`;
  }
  if (diffMs < month) {
    const weeks = Math.floor(diffMs / week);
    return `Posted ${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }
  if (diffMs < year) {
    const months = Math.floor(diffMs / month);
    return `Posted ${months} month${months === 1 ? "" : "s"} ago`;
  }

  const years = Math.floor(diffMs / year);
  return `Posted ${years} year${years === 1 ? "" : "s"} ago`;
};

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [availability, setAvailability] = useState({ status: "" });
  const [incallPrice, setIncallPrice] = useState("");
  const [outcallPrice, setOutcallPrice] = useState("");
  const mediaItems = [
    ...(Array.isArray(post?.pictures)
      ? post.pictures.map((url) => ({ type: "image", url }))
      : []),
    ...(Array.isArray(post?.videos)
      ? post.videos.map((url) => ({ type: "video", url }))
      : []),
  ];
  const postOwnerId = post?.userId?._id || post?.userId?.id || "";
  const currentUserId = currentUser?._id || currentUser?.id || "";
  const effectiveUser = postOwnerId && currentUserId && postOwnerId === currentUserId
    ? { ...post?.userId, ...currentUser }
    : post?.userId;
  const locationParts = [post?.city, post?.state, post?.country].filter(Boolean);
  const displayLocation = locationParts.length > 0 ? locationParts.join(", ") : "";
  const displayPhoneNumber = effectiveUser?.phoneNumber
    ? formatPhoneNumber(effectiveUser.phoneNumber)
    : "";
  const isPromotedUser = hasActivePromotion(effectiveUser?.activePromoExpiry);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setFetchError("");
        const { data } = await api.get(`/posts/${postId}`);

        console.log("✅ Post fetched:", data); // Debug log

        setPost(data);

        // Set availability from populated user profile
        const fetchedOwnerId = data.userId?._id || data.userId?.id || "";
        const loggedInUserId = currentUser?._id || currentUser?.id || "";
        const detailUser = fetchedOwnerId && loggedInUserId && fetchedOwnerId === loggedInUserId
          ? { ...data.userId, ...currentUser }
          : data.userId;

        setAvailability(detailUser?.availability || { status: "" });

        // Set meetup prices from populated user profile
        setIncallPrice(detailUser?.incallPrice || "");
        setOutcallPrice(detailUser?.outcallPrice || "");
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
  }, [postId, currentUser]);

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
      <span
        className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-gray-200"
        aria-label={isPromotedUser ? "Promoted user" : "Standard user"}
        title={isPromotedUser ? "Promoted user" : "Standard user"}
      >
        <BadgeCheck className={isPromotedUser ? "text-pink-500" : "text-gray-400"} size={20} />
      </span>

      {/* 🖼️ Post Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {mediaItems.length > 0 ? (
          mediaItems.map((media, idx) =>
            media.type === "video" ? (
              <video
                key={`video-${idx}`}
                src={media.url}
                controls
                className="w-full h-auto object-cover rounded-md"
              />
            ) : (
              <img
                key={`image-${idx}`}
                src={media.url}
                alt={`Post image ${idx + 1}`}
                className="w-full h-auto object-cover rounded-md"
              />
            )
          )
        ) : post.picture ? (
          <img
            src={post.picture}
            alt="Post"
            className="w-full h-auto object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-md col-span-full">
            No Media Available
          </div>
        )}
      </div>

      {/* 🧑 Username + Title + Age + Phone Number + location */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-pink-600">
          {post.title || "Untitled Post"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          by {effectiveUser?.username || "Anonymous"}
        </p>
        {effectiveUser?.age && (
          <p className="text-sm text-gray-500 mt-1">
            Age: {effectiveUser.age}
          </p>
        )}
        {displayPhoneNumber && (
          <p className="text-sm text-gray-500 mt-1">
            Phone: {displayPhoneNumber}
          </p>
        )}
        {displayLocation && (
          <p className="text-sm text-gray-500 mt-1">
            Location: {displayLocation}
          </p>
        )}

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
          {getPostedAgoLabel(post.createdAt)}
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
            onClick={() => {
              const creatorId = post.userId?._id || post.userId?.id;
              if (!creatorId) return;
              navigate(`/user/${creatorId}`);
            }}
            className="px-4 py-2 text-[12px] text-white font-medium rounded-lg shadow-md transition-all hover:opacity-90 bg-gradient-to-r from-pink-500 via-black to-yellow-400"
          >
            View profile
          </button>
        )}
      </div>
    </div>
  );
}