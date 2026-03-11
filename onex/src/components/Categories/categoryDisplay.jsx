import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UserSearch from "../../components/Searchbar/UserSearch";
import CategoryPostsLoader from "../Loaders/CategoryPostsLoader";
import PostCard from "../Posts/PostCard";
import { FEATURE_FLAGS } from "../../config/featureFlags";
import { statesMatch } from "../../utils/stateNormalizer";

export default function CategoryDisplay({ selectedCategory, users = [], posts = [], location = null }) {
  const { categoryName } = useParams();
  const category = selectedCategory || categoryName;

  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [visiblePosts, setVisiblePosts] = useState(posts);

  useEffect(() => {
    setVisiblePosts(posts);
  }, [posts]);

  // Filter posts by category, location, and optionally user
  const categoryPosts = visiblePosts.filter((post) => {
    const matchesCategory = post.category?.trim().toLowerCase() === category?.trim().toLowerCase();
    const locationCity = location?.city?.trim()?.toLowerCase();
    const locationState = location?.state?.trim();
    const hasLocationCity = !!locationCity && !locationCity.includes("unknown");
    const hasLocationState = !!locationState && !locationState.toLowerCase().includes("unknown");

    const matchesLocation =
      !location ||
      (hasLocationCity && post.city?.trim()?.toLowerCase() === locationCity) ||
      (hasLocationState && statesMatch(post.state, locationState)) ||
      (!hasLocationCity && !hasLocationState);
    const matchesUser = selectedUser ? post.userId?.username === selectedUser : true;

    return matchesCategory && matchesLocation && matchesUser;
  });

  const selectedPost = categoryPosts.find((post) => post._id === selectedPostId);

  return (
    <div className="w-full py-10 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="bg-pink-100 text-black rounded-t-lg shadow-md p-4 sm:p-6 border border-black border-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">
            {category ? `Posts for: ${category}` : "Select a category to view posts"}
          </h2>
          <div className="w-full md:w-1/2 lg:w-1/3">
            {FEATURE_FLAGS.ENABLE_USER_SEARCH && (
              <UserSearch
                users={users}
                query={query}
                onQueryChange={setQuery}
                onSelectUser={setSelectedUser}
              />
            )}
          </div>
        </div>

        {selectedPost ? (
          <div className="mb-6">
            <button
              onClick={() => setSelectedPostId(null)}
              className="text-pink-600 underline text-sm mb-4"
            >
              ← Back to category posts
            </button>
            <PostCard
              post={selectedPost}
              onDelete={(id) => {
                setVisiblePosts((prev) => prev.filter((p) => p._id !== id));
                setSelectedPostId(null);
              }}
            />
          </div>
        ) : category ? (
          categoryPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryPosts.map((post, i) => (
                <PostCard
                  key={post._id || i}
                  post={post}
                  onDelete={(id) => {
                    setVisiblePosts((prev) => prev.filter((p) => p._id !== id));
                  }}
                />
              ))}
            </div>
          ) : (
            <CategoryPostsLoader />
          )
        ) : (
          <p className="text-black italic">No category selected.</p>
        )}
      </div>
    </div>
  );
}
