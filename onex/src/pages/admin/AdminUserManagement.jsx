import { useEffect, useRef, useState } from "react";
import api from "../../utils/api";
import PromoteAccountSettings from "../../components/Settings/AdminDashboardSettings/PromoteAccountSettings";
import PromocodeSettings from "../../components/Settings/AdminDashboardSettings/PromocodeSettings";
import PromotionRequestsAdmin from "../../components/Settings/AdminDashboardSettings/PromotionRequestsAdmin.jsx";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");

  const postsRailRef = useRef(null);
  const usersRailRef = useRef(null);

  const scrollPosts = (direction) => {
    const container = postsRailRef.current;
    if (!container) return;

    const amount = Math.max(container.clientWidth * 0.8, 280);
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const scrollUsers = (direction) => {
    const container = usersRailRef.current;
    if (!container) return;

    const amount = Math.max(container.clientWidth * 0.8, 280);
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const sortedUsersForProfiles = [...users].sort((a, b) => {
    const aHasProfilePic = Boolean(a?.profilePic);
    const bHasProfilePic = Boolean(b?.profilePic);
    const aHasBio = Boolean(a?.bio?.trim());
    const bHasBio = Boolean(b?.bio?.trim());

    const aScore = Number(aHasProfilePic) + Number(aHasBio);
    const bScore = Number(bHasProfilePic) + Number(bHasBio);

    if (aScore !== bScore) return bScore - aScore;

    const aName = (a?.username || a?.email || "").toLowerCase();
    const bName = (b?.username || b?.email || "").toLowerCase();
    return aName.localeCompare(bName);
  });

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

      <div className="mb-8 rounded-xl border border-pink-100 bg-white/90 p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-pink-700">User Profiles</h2>
            <p className="text-sm text-gray-500">
              Profiles with both profile picture and bio are shown first. Swipe/scroll or use arrows.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollUsers("left")}
              className="rounded-full border border-pink-200 px-3 py-1 text-sm font-medium text-pink-700 transition hover:bg-pink-50"
              aria-label="Scroll users left"
            >
              Left
            </button>
            <button
              type="button"
              onClick={() => scrollUsers("right")}
              className="rounded-full border border-pink-200 px-3 py-1 text-sm font-medium text-pink-700 transition hover:bg-pink-50"
              aria-label="Scroll users right"
            >
              Right
            </button>
          </div>
        </div>

        {usersLoading ? (
          <p className="text-gray-500">Loading user profiles...</p>
        ) : sortedUsersForProfiles.length > 0 ? (
          <div
            ref={usersRailRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
          >
            {sortedUsersForProfiles.map((u) => {
              const hasCompleteProfile = Boolean(u?.profilePic) && Boolean(u?.bio?.trim());
              return (
                <article
                  key={u._id}
                  className="min-w-[260px] max-w-[260px] snap-start rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-transform duration-300 hover:-translate-y-1"
                >
                  <img
                    src={u?.profilePic || "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"}
                    alt={u?.username || "User profile"}
                    className="mb-3 h-36 w-full rounded-md object-cover"
                  />

                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">
                      @{u?.username || "unknown"}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        hasCompleteProfile
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {hasCompleteProfile ? "Complete" : "Incomplete"}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-xs text-gray-600">
                    {u?.bio?.trim() || "No bio added yet."}
                  </p>

                  <p className="mt-2 text-xs text-pink-700">{u?.email || "No email"}</p>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No users available.</p>
        )}
      </div>

      {usersLoading && <p className="mb-8 text-gray-500">Loading users for settings...</p>}

      {/* Admin Settings */}
      <div className="space-y-6">

        {/* Promote User Accounts */}
        <PromoteAccountSettings
          users={users}
          onUserPromoted={(userId, expiresAt) =>
            setUsers((prev) =>
              prev.map((u) =>
                u._id === userId ? { ...u, activePromoExpiry: expiresAt } : u
              )
            )
          }
        />

        {/* Promocode Settings */}
        <PromocodeSettings />

        <PromotionRequestsAdmin />

      </div>
    </div>
  );
}