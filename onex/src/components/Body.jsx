import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import LocationSet from "../components/LocationSet";
import Heading from "../components/Header";
import PromotionPosts from "../components/Promotion/PromotedPosts";
import CategoryList from "../components/Categories/categoryList";
import CategoryDisplay from "../components/Categories/categoryDisplay";

export default function Body() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = !!user.username;
  const [location, setLocation] = useState(JSON.parse(localStorage.getItem("userLocation") || "null"));
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ""}/api/posts`);
        if (Array.isArray(data)) setPosts(data);
        else setPosts([]);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setPosts([]);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesLocation =
      !location ||
      post.city?.toLowerCase() === location.city?.toLowerCase() ||
      post.state?.toLowerCase() === location.state?.toLowerCase();

    const matchesCategory =
      !selectedCategory || post.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesLocation && matchesCategory;
  });

  return (
    <section className="bg-white min-h-screen p-5 scroll-smooth">
      <Heading />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-3">
        <h3 className="text-lg font-semibold text-gray-700">Ads</h3>
        <LocationSet onLocationChange={setLocation} />
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

      {/* ✅ Promoted Entertainer Section */}
      <PromotionPosts />

      {/* ✅ Filtered Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, i) => (
            <div key={i} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
              <h3 className="text-black font-semibold text-md mb-1">{post.title}</h3>
              <p className="text-gray-700 text-sm">{post.content}</p>
              {(post.city || post.state) && (
                <p className="text-gray-500 text-xs mt-1">
                  {post.city}, {post.state}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">No posts available.</p>
        )}
      </div>

      {/* ✅ Category Selection */}
      <div>
        <CategoryList onSelect={setSelectedCategory} />
      </div>

      {/* ✅ Category Display */}
      <div>
        <CategoryDisplay selectedCategory={selectedCategory} />
      </div>
    </section>
  );
}
