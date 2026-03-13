import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './PostCard';

export default function PostList({ authorId = "" }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!authorId) {
      setPosts([]);
      setLoading(false);
      setErrorMessage("No profile selected.");
      return;
    }

    const fetchAllPosts = async () => {
      try {
        const query = new URLSearchParams({ userId: authorId }).toString();
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL || ""}/api/posts?${query}`
        );

        if (!Array.isArray(data)) {
          setErrorMessage("Unexpected response format from server.");
          setPosts([]);
        } else if (data.length === 0) {
          setErrorMessage("No posts found.");
          setPosts([]);
        } else {
          setPosts(data);
          setErrorMessage(null);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setErrorMessage("Error fetching posts. Please try again later.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, [authorId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-gray-500 text-lg">
        Loading posts...
      </div>
    );
  }

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-10">
      <h2 className="text-2xl font-bold text-pink-700 mb-6 text-center sm:text-left">
        All Posts
      </h2>

      {errorMessage && (
        <div className="text-red-500 text-center mb-6">{errorMessage}</div>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={(id) => {
                setPosts((prev) => prev.filter((p) => p._id !== id));
              }}
            />
          ))
        ) : (
          !errorMessage && (
            <p className="text-gray-500 text-center col-span-full">
              No posts found.
            </p>
          )
        )}
      </div>
    </section>
  );
}
