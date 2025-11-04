import { useParams } from "react-router-dom";
import { useState } from "react";
import UserSearch from "../../components/Searchbar/UserSearch";
import CategoryPostsLoader from "../Loaders/CategoryPostsLoader";
import PostCard from "../Posts/PostCard";

export default function CategoryDisplay({ selectedCategory, users = [], posts = [], location = null }) {
  const { categoryName } = useParams();
  const category = selectedCategory || categoryName;

  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null); // ✅ Track clicked post

  const categoryPosts = posts.filter((post) => {
    const matchesCategory = post.category?.trim().toLowerCase() === category?.trim().toLowerCase();
    const matchesLocation =
      !location ||
      post.city?.toLowerCase() === location.city?.toLowerCase() ||
      post.state?.toLowerCase() === location.state?.toLowerCase();
    const matchesUser = selectedUser ? post.username === selectedUser : true;

    return matchesCategory && matchesLocation && matchesUser;
  });

  const selectedPost = categoryPosts.find((post) => post._id === selectedPostId);

  return (
    <div className="w-full py-10 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="bg-white text-black rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">
            {category ? `Posts for: ${category}` : "Select a category to view posts"}
          </h2>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <UserSearch
              users={users}
              query={query}
              onQueryChange={setQuery}
              onSelectUser={setSelectedUser}
            />
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
            <PostCard post={selectedPost} />
          </div>
        ) : category ? (
          categoryPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryPosts.map((post, i) => (
                <div
                  key={post._id || i}
                  className="bg-white border border-black rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition"
                  onClick={() => setSelectedPostId(post._id)} // ✅ Single click to view full post
                >
                  {post.picture && (
                    <img
                      src={post.picture}
                      alt="Post visual"
                      className="w-auto h-38 object-cover rounded-md mb-3 border border-pink-600"
                    />
                  )}
                  <h3 className="text-pink-600 font-semibold text-md mb-1">{post.username}</h3>
                  <h5 className="text-gray-700 text-sm font-semibold underline">{post.title}</h5>
                  <p className="text-gray-700 text-sm">{post.description}</p>
                  {(post.city || post.state) && (
                    <p className="text-gray-500 text-xs mt-1">
                      {post.city}, {post.state}
                    </p>
                  )}
                  {post.createdAt && (
                    <p className="text-gray-400 text-xs mt-1">
                      Posted on {new Date(post.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <CategoryPostsLoader />
          )
        ) : (
          <p className="text-gray-500 italic">No category selected.</p>
        )}
      </div>
    </div>
  );
}
