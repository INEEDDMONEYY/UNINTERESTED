import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LocationSet from "../components/Location/LocationSet";
import Heading from "../components/Header";
import PromotionPosts from "../components/Promotion/PromotedPosts";
import CategoryList from "../components/Categories/categoryList";
import CategoryDisplay from "../components/Categories/categoryDisplay";
import UserSearch from "../components/Searchbar/UserSearch";
import EmptyCategoryLoader from "./Loaders/EmptyCategoryLoader";
import PostCard from "../components/Posts/PostCard";
import { FEATURE_FLAGS } from "../config/featureFlags";

// ------------------ Onboarding Guide Component ------------------
function OnboardingGuide({ steps, onFinish }) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep + 1 < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const step = steps[currentStep];
  const element = step.target?.current;

  const style = element
    ? {
        position: "absolute",
        top: element.getBoundingClientRect().top + window.scrollY - 10,
        left: element.getBoundingClientRect().left + window.scrollX - 10,
        width: element.offsetWidth + 20,
        height: element.offsetHeight + 20,
        border: "2px solid #2fda62ff",
        borderRadius: "0.5rem",
        zIndex: 9999,
        pointerEvents: "none",
      }
    : {};

  return (
    <>
      {element && <div style={style}></div>}
      <div
        className="fixed bottom-8 right-8 bg-white p-4 rounded-lg shadow-lg z-50 max-w-sm"
        style={{ pointerEvents: "auto" }}
      >
        <h3 className="text-pink-600 font-bold mb-2">{step.title}</h3>
        <p className="text-gray-700 text-sm">{step.description}</p>
        <button
          onClick={nextStep}
          className="mt-3 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 text-sm"
        >
          {currentStep + 1 === steps.length ? "Finish" : "Next"}
        </button>
      </div>
    </>
  );
}

// ------------------ Body Component ------------------
export default function Body() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = !!user.username;

  const [location, setLocation] = useState(
    JSON.parse(localStorage.getItem("userLocation") || "null")
  );
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [visibleCount, setVisibleCount] = useState(15);
  const MAX_POSTS = 100;

  // --------------------------- Fetch Posts ---------------------------
  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL || ""}/api/posts`
      );
      setPosts(Array.isArray(data) ? data.slice(0, MAX_POSTS) : []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setPosts([]);
    }
  };

  // --------------------------- Fetch Users ---------------------------
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL || ""}/api/users`
      );
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  // --------------------------- Load More -----------------------------
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 15, MAX_POSTS));
  };

  // --------------------------- Filter Posts --------------------------
  const filteredUncategorizedPosts = (
    searchResults && searchResults.length > 0 ? searchResults : posts
  )
    .filter((post) => {
      const hasNoCategory = !post.category || post.category.trim() === "";
      const matchesLocation =
        !location ||
        post.city?.toLowerCase() === location.city?.toLowerCase() ||
        post.state?.toLowerCase() === location.state?.toLowerCase();
      return hasNoCategory && matchesLocation;
    })
    .slice(0, visibleCount);

  // --------------------------- Onboarding Steps ----------------------
  const postsRef = useRef(null);

  const onboardingSteps = [
    {
      target: postsRef,
      title: "Uncategorized Post Section 📢",
      description:
        "The section highlighted in green shows all uncategorized post. You can click the post to bring up the post details.",
    },
    {
      target: null,
      title: "Click 'Finish' to close ❌",
    },
  ];

  // ✅ Feature-flag aware onboarding state
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (!FEATURE_FLAGS.ENABLE_ONBOARDING) return false;
    return sessionStorage.getItem("hasSeenOnboarding") !== "true";
  });

  const handleOnboardingFinish = () => {
    sessionStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
  };

  // --------------------------- Render -------------------------------
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

      {FEATURE_FLAGS.ENABLE_PROMOTE_ACCOUNT && <PromotionPosts />}

      <div className="mt-6 mb-4">
        {FEATURE_FLAGS.ENABLE_USER_SEARCH && (
          <UserSearch
            users={users}
            onResults={setSearchResults}
            query={searchQuery}
            onQueryChange={setSearchQuery}
          />
        )}
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        ref={postsRef}
      >
        {filteredUncategorizedPosts.length > 0 ? (
          filteredUncategorizedPosts.map((post, i) => (
            <PostCard key={post._id || i} post={post} />
          ))
        ) : (
          <EmptyCategoryLoader />
        )}
      </div>

      {filteredUncategorizedPosts.length >= 15 &&
        filteredUncategorizedPosts.length < MAX_POSTS && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 via-black to-yellow-400 text-white rounded-lg shadow-md hover:opacity-90 transition-all text-sm sm:text-base"
            >
              Load More
            </button>
          </div>
        )}

      <div className="mt-8">
        <CategoryList onSelect={setSelectedCategory} />
      </div>

      <div className="mt-6">
        <CategoryDisplay
          selectedCategory={selectedCategory}
          users={users}
          posts={posts}
          location={location}
        />
      </div>

      {/* ✅ Feature-flag controlled onboarding */}
      {FEATURE_FLAGS.ENABLE_ONBOARDING && showOnboarding && (
        <OnboardingGuide
          steps={onboardingSteps}
          onFinish={handleOnboardingFinish}
        />
      )}
    </section>
  );
}
