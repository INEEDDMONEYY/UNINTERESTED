import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './PostCard'; // Assumes PostCard is in the same folder

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const username = user?.username;

    const fetchUserPosts = async () => {
      if (!username) {
        setPosts([]);
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL || ""}/api/posts?username=${username}`
        );
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch user posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-gray-500 text-lg">
        Loading posts...
      </div>
    );
  }

  return (
    <>
      <section className="px-4 sm:px-6 lg:px-12 py-10">
        <h2 className="text-2xl font-bold text-pink-700 mb-6 text-center sm:text-left">
          Your Posts
        </h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post._id || post.id}
                postId={post._id}
                picture={post.picture}
                username={post.username}
                description={post.description}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">No posts found.</p>
          )}
        </div>
      </section>
    </>
  );
}
