import { useEffect, useState } from "react";
import axios from "axios";

export default function UserActivity() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL || ""}/api/posts`
        );
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setErrorMessage("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-gray-500 text-lg">
        Loading user activity...
      </div>
    );
  }

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-10">
      <h2 className="text-2xl font-bold text-pink-700 mb-6 text-center sm:text-left">
        All User Posts
      </h2>

      {errorMessage && (
        <div className="text-red-500 text-center mb-6">{errorMessage}</div>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow p-4 border border-gray-200"
            >
              {post.picture && (
                <img
                  src={post.picture}
                  alt="Post"
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-lg font-semibold text-pink-700">
                {post.title || "Untitled"}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Posted by <span className="font-medium">{post.username}</span>
              </p>
              <p className="text-gray-700 text-sm">{post.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No posts available.
          </p>
        )}
      </div>
    </section>
  );
}
