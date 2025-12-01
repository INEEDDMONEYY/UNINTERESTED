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
  // ------------------ Filter posts by location, category ------------------
  const filteredPosts = posts
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
            return <PostCard key={post._id || i} post={postWithUsername} />;
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
