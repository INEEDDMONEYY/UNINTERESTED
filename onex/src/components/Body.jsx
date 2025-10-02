import { Link } from 'react-router';
import SetLocation from '../components/LocationSet';
import Heading from '../components/Header';
// import Example from '../components/Example'; // Optional: your post card component

export default function Body() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!user.username;

  // Dummy promoted user (replace with real data)
  const promotedUser = {
    name: 'Name Placeholder',
    image: 'https://via.placeholder.com/80', // Replace with actual image URL
    message: '🔥 Don’t miss today’s spotlight performance!',
  };

  const recentPosts = [
    { title: 'Recent Post #1', content: 'New drop just landed.' },
    { title: 'Recent Post #2', content: 'Behind the scenes update.' },
    { title: 'Recent Post #3', content: 'Community shoutout!' },
  ];

  return (
    <section className="bg-white min-h-screen p-5 scroll-smooth">
      <Heading />

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-3">
        <h3 className="text-lg font-semibold text-gray-700">Ads</h3>
        <SetLocation />
        {isLoggedIn && (
          <div className="post-btn-div">
            <Link to="/post">
              <button
                className="border border-pink-400 px-3 py-1 rounded bg-pink-200 hover:bg-pink-300 text-sm font-medium"
                id="post-btn"
              >
                Post
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6" id="post-grid-container">
        {/* Promoted Entertainer */}
        <div className="bg-pink-100 border border-pink-300 rounded-lg p-4 shadow-md col-span-1 md:col-span-2 lg:col-span-3 flex flex-col md:flex-row items-center gap-4">
          <img
            src={promotedUser.image}
            alt={`${promotedUser.name}'s profile`}
            className="w-20 h-20 rounded-full object-cover border-2 border-pink-400"
          />
          <div>
            <h2 className="text-pink-700 font-bold text-xl mb-1">Promoted Entertainer for the Day</h2>
            <p className="text-black font-semibold">{promotedUser.name}</p>
            <p className="text-gray-800 text-sm mt-1">{promotedUser.message}</p>
          </div>
        </div>

        {/* Recent Posts */}
        {recentPosts.map((post, index) => (
          <div key={index} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <h3 className="text-black font-semibold text-md mb-1">{post.title}</h3>
            <p className="text-gray-700 text-sm">{post.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
