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
    return <div className="text-center py-10 text-gray-500">Loading posts...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 py-10">
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </>
  );
}
