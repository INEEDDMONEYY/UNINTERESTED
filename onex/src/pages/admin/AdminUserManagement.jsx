import { useEffect, useRef, useState } from "react";
import api from "../../utils/api";
import PromoteAccountSettings from "../../components/Settings/AdminDashboardSettings/PromoteAccountSettings";
import PromocodeSettings from "../../components/Settings/AdminDashboardSettings/PromocodeSettings";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");

  const postsRailRef = useRef(null);

  const scrollPosts = (direction) => {
    const container = postsRailRef.current;
    if (!container) return;

    const amount = Math.max(container.clientWidth * 0.8, 280);
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchUsersAndPosts = async () => {
      setUsersLoading(true);
      setPostsLoading(true);
      setUsersError("");
      setPostsError("");

      const [usersResult, postsResult] = await Promise.allSettled([
        api.get("/admin/users"),
        api.get("/posts"),
      ]);

      if (usersResult.status === "fulfilled") {
        const usersData = usersResult.value?.data;
        if (Array.isArray(usersData)) {
          setUsers(usersData);
        } else if (Array.isArray(usersData?.data)) {
          setUsers(usersData.data);
        } else if (Array.isArray(usersData?.users)) {
          setUsers(usersData.users);
        } else {
          setUsers([]);
        }
      } else {
        console.error("Failed to fetch users:", usersResult.reason);
        setUsers([]);
        setUsersError(
          usersResult.reason?.response?.data?.error ||
            "Failed to fetch users. Make sure you are an admin."
        );
      }

      if (postsResult.status === "fulfilled") {
        const postsData = postsResult.value?.data;
        setPosts(Array.isArray(postsData) ? postsData.slice(0, 30) : []);
      } else {
        console.error("Failed to fetch posts:", postsResult.reason);
        setPosts([]);
        const status = postsResult.reason?.response?.status;
        const backendMsg = postsResult.reason?.response?.data?.error;
        setPostsError(
          backendMsg ||
            (status
              ? `Failed to fetch posts for the platform feed (status ${status}).`
              : "Failed to fetch posts for the platform feed. Check API base URL/proxy.")
        );
      }

      setUsersLoading(false);
      setPostsLoading(false);
    };

    fetchUsersAndPosts();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h6 className="text-xl font-bold text-pink-700 mb-4">
        User Management
      </h6>

      {usersError && <p className="text-red-600 mb-4">{usersError}</p>}

      <div className="mb-8 rounded-xl border border-pink-100 bg-white/90 p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-pink-700">Platform Posts</h2>
            <p className="text-sm text-gray-500">Showing latest 30 posts. Use arrows or swipe/scroll horizontally.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollPosts("left")}
              className="rounded-full border border-pink-200 px-3 py-1 text-sm font-medium text-pink-700 transition hover:bg-pink-50"
              aria-label="Scroll posts left"
            >
              Left
            </button>
            <button
              type="button"
              onClick={() => scrollPosts("right")}
              className="rounded-full border border-pink-200 px-3 py-1 text-sm font-medium text-pink-700 transition hover:bg-pink-50"
              aria-label="Scroll posts right"
            >
              Right
            </button>
          </div>
        </div>

        {postsError && <p className="mb-3 text-sm text-red-600">{postsError}</p>}

        {postsLoading ? (
          <p className="text-gray-500">Loading posts...</p>
        ) : posts.length > 0 ? (
          <div
            ref={postsRailRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
          >
            {posts.map((post) => (
              <article
                key={post._id}
                className="min-w-[260px] max-w-[260px] snap-start rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-transform duration-300 hover:-translate-y-1"
              >
                {Array.isArray(post.pictures) && post.pictures[0] && (
                  <img
                    src={post.pictures[0]}
                    alt={post.title || "Post image"}
                    className="mb-3 h-36 w-full rounded-md object-cover"
                  />
                )}

                <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">
                  {post.title || "Untitled post"}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                  {post.description || "No description available."}
                </p>

                <p className="mt-2 text-xs text-pink-700">
                  @{post.userId?.username || "unknown"}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No posts available.</p>
        )}
      </div>

      {usersLoading && <p className="mb-8 text-gray-500">Loading users for settings...</p>}

      {/* Admin Settings */}
      <div className="space-y-6">

        {/* Promote User Accounts */}
        <PromoteAccountSettings users={users} />

        {/* Promocode Settings */}
        <PromocodeSettings />

      </div>
    </div>
  );
}