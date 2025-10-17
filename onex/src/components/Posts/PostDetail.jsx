import { useState, useEffect } from 'react';

export default function PostDetail() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate fetching post detail (replace with actual API call)
  useEffect(() => {
    const mockPost = {
      imageUrl: 'https://via.placeholder.com/600x300',
      username: 'TestUser123',
      title: 'Sample Post Title',
      description: 'This is a detailed description of the post. It includes more context and background.',
      createdAt: '2025-10-17T14:30:00Z',
    };

    setPost(mockPost);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading post...</div>;
  }

  if (!post) {
    return <div className="text-center py-10 text-red-500">Post not found.</div>;
  }

  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-10 bg-white rounded-xl shadow-md">
        {/* 🖼️ Post Image */}
        <div className="mb-6">
          <img
            src={post.imageUrl}
            alt="Post"
            className="w-full h-auto rounded-md object-cover"
          />
        </div>

        {/* 🧑 Username + Title */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-pink-600">{post.title}</h2>
          <p className="text-sm text-gray-500 mt-1">by {post.username}</p>
        </div>

        {/* 📝 Description */}
        <p className="text-gray-700 text-base mb-6">{post.description}</p>

        {/* 📅 Timestamp */}
        <p className="text-xs text-gray-400">
          Posted on {new Date(post.createdAt).toLocaleString()}
        </p>

        {/* 💬 Comment Section Placeholder */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold text-pink-500 mb-2">Comments</h3>
          <p className="text-sm text-gray-500">Comment functionality coming soon...</p>
        </div>
      </div>
    </>
  );
}
