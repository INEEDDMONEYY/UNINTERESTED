import { useEffect, useState } from "react";
import { useUser } from "../../context/useUser";
import api from "../../utils/api";

export default function UserActivity() {
  const { user, loading: userLoading } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (userLoading) return;

    if (!user?._id) {
      setPosts([]);
      setErrorMessage("Sign in to view your posts.");
      setLoading(false);
      return;
    }

    const fetchUserPosts = async () => {
      try {
        setErrorMessage(null);
        const { data } = await api.get("/posts", {
          params: { userId: user._id },
        });
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setErrorMessage("Failed to load your posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user?._id, userLoading]);

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
        My Posts
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
              {Array.isArray(post.pictures) && post.pictures[0] && (
                <img
                  src={post.pictures[0]}
                  alt="Post"
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-lg font-semibold text-pink-700">
                {post.title || "Untitled"}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Posted by <span className="font-medium">{post.userId?.username || user?.username || "Unknown user"}</span>
              </p>
              <p className="text-gray-700 text-sm">{post.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No posts available for your account.
          </p>
        )}
      </div>
    </section>
  );
}
