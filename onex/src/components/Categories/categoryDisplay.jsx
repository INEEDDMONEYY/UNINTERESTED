import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import UserSearch from "../../components/Searchbar/UserSearch";

export default function CategoryDisplay({ selectedCategory, users = [] }) {
  const { categoryName } = useParams();
  const category = selectedCategory || categoryName;
  const [posts, setPosts] = useState([]);
  const [location, setLocation] = useState(() => {
    return JSON.parse(localStorage.getItem("userLocation") || "null");
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ""}/api/posts`);
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch category posts:", err);
        setPosts([]);
      }
    };

    if (category) fetchPosts();
  }, [category]);

  const categoryPosts = posts.filter((post) => {
    const matchesCategory = post.category?.toLowerCase() === category?.toLowerCase();
    const matchesLocation =
      !location ||
      post.city?.toLowerCase() === location.city?.toLowerCase() ||
      post.state?.toLowerCase() === location.state?.toLowerCase();

    return matchesCategory && matchesLocation;
  });

  return (
    <div className="w-full py-10 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="bg-white text-black rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">
            {category ? `Posts for: ${category}` : "Select a category to view posts"}
          </h2>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <UserSearch users={users} />
          </div>
        </div>

        {category ? (
          categoryPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryPosts.map((post, i) => (
                <div key={i} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  {post.picture && (
                    <img
                      src={post.picture}
                      alt="Post visual"
                      className="w-full h-48 object-cover rounded-md mb-3"
                    />
                  )}
                  <h3 className="text-black font-semibold text-md mb-1">{post.username}</h3>
                  <h5 className="text-gray-700 text-sm">{post.title}</h5>
                  <p className="text-gray-700 text-sm">{post.description}</p>
                  {(post.city || post.state) && (
                    <p className="text-gray-500 text-xs mt-1">
                      {post.city}, {post.state}
                    </p>
                  )}
                  {post.createdAt && (
                    <p className="text-gray-400 text-xs mt-1">
                      Posted on {new Date(post.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No posts found for this category and location.</p>
          )
        ) : (
          <p className="text-gray-500 italic">No category selected.</p>
        )}
      </div>
    </div>
  );
}
