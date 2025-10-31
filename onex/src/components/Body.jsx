import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import LocationSet from "../components/LocationSet";
import Heading from "../components/Header";
import PromotionPosts from "../components/Promotion/PromotedPosts";
import CategoryList from "../components/Categories/categoryList";
import CategoryDisplay from "../components/Categories/categoryDisplay";
import UserSearch from "../components/Searchbar/UserSearch";
import EmptyCategoryLoader from "./Loaders/EmptyCategoryLoader";
import PostCard from "../components/Posts/PostCard"; // ✅ Added import

export default function Body() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = !!user.username;
  const [location, setLocation] = useState(JSON.parse(localStorage.getItem("userLocation") || "null"));
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ""}/api/posts`);
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setPosts([]);
      }
    };

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ""}/api/users`);
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      }
    };

    fetchPosts();
    fetchUsers();
  }, []);

  const emptyCategoryPosts = posts.filter((post) => {
    const hasNoCategory = !post.category || post.category.trim() === "";
    const matchesLocation =
      !location ||
      post.city?.toLowerCase() === location.city?.toLowerCase() ||
      post.state?.toLowerCase() === location.state?.toLowerCase();

    return hasNoCategory && matchesLocation;
  });

  return (
    <section className="bg-white min-h-screen px-4 sm:px-6 md:px-10 lg:px-20 py-6 scroll-smooth">
      <Heading />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 mt-4">
        <h3 className="text-lg font-semibold text-gray-700">Ads</h3>
        <LocationSet onLocationChange={setLocation} />
        {isLoggedIn && (
          <div className="post-btn-div">
            <Link to="/post">
              <button
                className="border border-pink-400 px-4 py-2 rounded bg-pink-200 hover:bg-pink-300 text-sm font-medium"
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

      {/* ✅ User Search */}
      <div className="mt-6 mb-4">
        <UserSearch users={users} />
      </div>

      {/* ✅ Empty Category Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {emptyCategoryPosts.length > 0 ? (
          emptyCategoryPosts.map((post, i) => (
            <PostCard key={post._id || i} post={post} /> // ✅ Using PostCard for clickable posts
          ))
        ) : (
          <EmptyCategoryLoader />
        )}
      </div>

      {/* ✅ Category Selection */}
      <div className="mt-8">
        <CategoryList onSelect={setSelectedCategory} />
      </div>

      {/* ✅ Category Display */}
      <div className="mt-6">
        <CategoryDisplay selectedCategory={selectedCategory} users={users} />
      </div>
    </section>
  );
}
