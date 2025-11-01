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
  // ✅ Filter posts by location and category
  const filteredPosts = posts
    .filter((post) => {
      const matchesLocation =
        !location ||
        post.city?.toLowerCase() === location.city?.toLowerCase() ||
        post.state?.toLowerCase() === location.state?.toLowerCase();

      const matchesCategory =
        !selectedCategory ||
        post.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesLocation && matchesCategory;
    })
    .slice(0, visibleCount);

  return (
    <>
      {/* ------------------ Posts Grid ------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, i) => <PostCard key={post._id || i} post={post} />)
        ) : (
          <EmptyCategoryLoader />
        )}
      </div>

      {/* ------------------ Load More Button ------------------ */}
      {filteredPosts.length >= 15 && filteredPosts.length < MAX_POSTS && (
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
