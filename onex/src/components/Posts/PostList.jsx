import { useState, useEffect } from 'react';
import PostCard from './PostCard'; // Assumes PostCard is in the same folder

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching post list (replace with actual API call)
  useEffect(() => {
    const mockPosts = [
      {
        id: 1,
        username: 'UserOne',
        description: 'First post description',
        imageUrl: 'https://via.placeholder.com/150',
      },
      {
        id: 2,
        username: 'UserTwo',
        description: 'Second post description',
        imageUrl: 'https://via.placeholder.com/150',
      },
      {
        id: 3,
        username: 'UserThree',
        description: 'Third post description',
        imageUrl: 'https://via.placeholder.com/150',
      },
    ];

    setPosts(mockPosts);
    setLoading(false);
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
          Recent Posts
        </h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </section>
    </>
  );
}
