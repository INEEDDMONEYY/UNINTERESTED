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
import { statesMatch } from "../utils/stateNormalizer";

const dedupePostsById = (items = []) => {
  const seen = new Set();
  return items.filter((item) => {
    const id = item?._id;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_API_URL ||
  "https://uninterested.onrender.com";

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
  const LOAD_MORE_STEP = 15;

  const getAreaLabel = (selectedLocation) => {
    if (!selectedLocation) return "your area";

    const city = selectedLocation?.city?.trim();
    const state = selectedLocation?.state?.trim();
    const country = selectedLocation?.country?.trim();

    const cityKnown = city && !city.toLowerCase().includes("unknown");
    const stateKnown = state && !state.toLowerCase().includes("unknown");
    const countryKnown = country && !country.toLowerCase().includes("unknown");

    if (stateKnown) return state;
    if (cityKnown) return city;
    if (countryKnown) return country;
    return "your area";
  };

  // --------------------------- Fetch Posts ---------------------------
  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/api/posts`
      );
      const normalized = Array.isArray(data) ? data : [];
      setPosts(dedupePostsById(normalized));
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setPosts([]);
    }
  };

  // --------------------------- Fetch Users ---------------------------
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/api/users`
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
    setVisibleCount((prev) => prev + LOAD_MORE_STEP);
  };

  // --------------------------- Filter Posts --------------------------
  const locationMatchesPost = (post, selectedLocation) => {
    if (!selectedLocation) return true;

    const locationCity = selectedLocation?.city?.trim()?.toLowerCase();
    const locationState = selectedLocation?.state?.trim();
    const locationCountry = selectedLocation?.country?.trim()?.toLowerCase();

    const hasCity = !!locationCity && !locationCity.includes("unknown");
    const hasState = !!locationState && !locationState.toLowerCase().includes("unknown");
    const hasCountry = !!locationCountry;

    const cityMatch = hasCity && post.city?.trim()?.toLowerCase() === locationCity;
    const stateMatch = hasState && statesMatch(post.state, locationState);
    const countryMatch =
      hasCountry && post.country?.trim()?.toLowerCase() === locationCountry;

    if (!hasCity && !hasState && !hasCountry) return true;
    return cityMatch || stateMatch || countryMatch;
  };

  const hasSearchQuery = typeof searchQuery === "string" && searchQuery.trim().length > 0;
  const sourcePosts = hasSearchQuery
    ? Array.isArray(searchResults)
      ? dedupePostsById(searchResults)
      : []
    : posts;

  const filteredUncategorizedPool = sourcePosts
    .filter((post) => {
      const categoryValue = post.category?.trim()?.toLowerCase() || "";
      const hasNoCategory = !categoryValue || categoryValue === "uncategorized";
      const matchesLocation = hasSearchQuery ? true : locationMatchesPost(post, location);
      const matchesCategory = hasSearchQuery ? true : hasNoCategory;
      return matchesCategory && matchesLocation;
    })
  ;

  const filteredUncategorizedPosts = filteredUncategorizedPool.slice(0, visibleCount);
  const areaLabel = getAreaLabel(location);

  // 🐛 Debug logging
  useEffect(() => {
    console.log("📊 Posts Data:", posts);
    console.log("📍 Current Location:", location);
    console.log("✅ Filtered Posts Count:", filteredUncategorizedPosts.length);
    if (posts.length > 0) {
      console.log("📌 First Post Structure:", posts[0]);
    }
  }, [posts, location, filteredUncategorizedPosts.length]);

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
        <h3 className="text-lg font-semibold text-gray-700">New listings daily</h3>
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
            posts={posts}
            onResults={setSearchResults}
            query={searchQuery}
            onQueryChange={setSearchQuery}
          />
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Listings in your area
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Providers near {areaLabel}
        </p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        ref={postsRef}
      >
        {filteredUncategorizedPosts.length > 0 ? (
          filteredUncategorizedPosts.map((post, i) => (
            <PostCard
              key={post._id || i}
              post={post}
              onDelete={(id) => {
                setPosts((prev) => prev.filter((p) => p._id !== id));
              }}
            />
          ))
        ) : (
          <EmptyCategoryLoader />
        )}
      </div>

      {filteredUncategorizedPool.length > visibleCount && (
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
