import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import EmptyCategoryLoader from "../Loaders/EmptyCategoryLoader";

export default function FilteredPosts({
  posts = [],
  location = null,
  selectedCategory = null,
  visibleCount = 15,
  handleLoadMore,
  MAX_POSTS = 100,
}) {
  const [visiblePosts, setVisiblePosts] = useState(posts);

  useEffect(() => {
    setVisiblePosts(posts);
  }, [posts]);

  // ------------------ Sort: promoted first, founding provider second ------------------
  const sortPostsByPriority = (arr) =>
    [...arr].sort((a, b) => {
      const now = Date.now();

      const hasActivePromotion = (post) => {
        const postExpiry = post?.promoExpiresAt ? new Date(post.promoExpiresAt) : null;
        const userExpiry = post?.userId?.activePromoExpiry
          ? new Date(post.userId.activePromoExpiry)
          : null;

        const postPromoActive =
          post?.isPromo && postExpiry && !Number.isNaN(postExpiry.getTime()) && postExpiry.getTime() > now;
        const userPromoActive =
          userExpiry && !Number.isNaN(userExpiry.getTime()) && userExpiry.getTime() > now;

        return Boolean(postPromoActive || userPromoActive);
      };

      const isFoundingProvider = (post) => {
        if (hasActivePromotion(post)) return false;

        const createdAt = post?.userId?.createdAt;
        if (!createdAt) return false;

        const createdDate = new Date(createdAt);
        if (Number.isNaN(createdDate.getTime())) return false;

        const oneYearMs = 365 * 24 * 60 * 60 * 1000;
        return now - createdDate.getTime() < oneYearMs;
      };

      const getPriority = (post) => {
        if (hasActivePromotion(post)) return 0;
        if (isFoundingProvider(post)) return 1;
        return 2;
      };

      return getPriority(a) - getPriority(b);
    });

  // ------------------ Filter posts by location, category ------------------
  const filteredPosts = sortPostsByPriority(visiblePosts)
    .filter((post) => {
      // ✅ Safe optional chaining for location filter
      const matchesLocation =
        !location ||
        post.city?.toLowerCase() === location.city?.toLowerCase() ||
        post.state?.toLowerCase() === location.state?.toLowerCase();

      // ✅ Safe optional chaining for category filter
      const matchesCategory =
        !selectedCategory ||
        post.category?.toLowerCase() === selectedCategory?.toLowerCase();

      return matchesLocation && matchesCategory;
    })
    .slice(0, visibleCount);

  // ------------------ Render ------------------
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, i) => {
            // ✅ Ensure PostCard gets username from populated userId
            const postWithUsername = {
              ...post,
              username: post.userId?.username || "Unknown",
              profilePic: post.userId?.profilePic || null,
              bio: post.userId?.bio || "",
            };
            return (
              <PostCard
                key={post._id || i}
                post={postWithUsername}
                onDelete={(id) => {
                  setVisiblePosts((prev) => prev.filter((p) => p._id !== id));
                }}
              />
            );
          })
        ) : (
          <EmptyCategoryLoader />
        )}
      </div>

      {/* ------------------ Load More Button ------------------ */}
      {visibleCount < posts.length && visibleCount < MAX_POSTS && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 via-black to-yellow-400 text-white rounded-lg shadow-md hover:opacity-90 transition-all text-sm sm:text-base"
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
}
