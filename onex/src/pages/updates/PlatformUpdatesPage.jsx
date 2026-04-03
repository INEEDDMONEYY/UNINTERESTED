import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useUser } from "../../context/useUser";
import { setSEO } from "../../utils/seo";

export default function PlatformUpdatesPage() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    type: "platform",
  });
  const { user } = useUser();

  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const fetchUpdates = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/updates");
      setUpdates(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load updates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSEO(
      'Platform Updates | Mystery Mansion',
      'Stay up to date with the latest features, improvements, and announcements from Mystery Mansion, the escort and sex work advertising platform.',
      { robots: 'index, follow', canonicalPath: '/platform-updates' }
    );
  }, []);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleDeleteUpdate = async (updateId) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this update?")) return;

    try {
      await api.delete(`/updates/${updateId}`);
      setUpdates((prev) => prev.filter((update) => update._id !== updateId));
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to delete update");
    }
  };

  const startEditing = (update) => {
    setEditingId(update?._id || "");
    setEditForm({
      title: update?.title || "",
      description: update?.description || "",
      type: update?.type === "feature" ? "feature" : "platform",
    });
  };

  const cancelEditing = () => {
    setEditingId("");
    setSavingEdit(false);
    setEditForm({ title: "", description: "", type: "platform" });
  };

  const handleSaveEdit = async (updateId) => {
    if (!isAdmin || !updateId) return;

    const title = editForm.title.trim();
    const description = editForm.description.trim();

    if (!title || !description) {
      alert("Title and description are required.");
      return;
    }

    try {
      setSavingEdit(true);
      const { data } = await api.put(`/updates/${updateId}`, {
        title,
        description,
        type: editForm.type,
      });

      const updated = data?.data;
      if (updated) {
        setUpdates((prev) => prev.map((item) => (item._id === updateId ? updated : item)));
      }

      cancelEditing();
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to edit update");
      setSavingEdit(false);
    }
  };

  const toBulletItems = (description = "") => {
    return description
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.replace(/^[-*•]\s*/, ""));
  };

  const isNewUpdate = (createdAt) => {
    const updateDate = new Date(createdAt);
    const now = new Date();
    const diffDays = (now - updateDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };
  const platformUpdates = updates.filter((update) => update.type !== "feature");
  const featureUpdates = updates.filter((update) => update.type === "feature");

  const renderUpdateCard = (update, isFeatureSection = false) => {
    const isEditing = isAdmin && editingId === update._id;

    return (
      <div
        key={update._id}
        className="bg-white rounded-xl p-5 shadow-md border border-pink-200"
      >
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full border border-pink-200 rounded-md px-3 py-2 text-sm"
              placeholder="Update title"
            />

            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full border border-pink-200 rounded-md px-3 py-2 text-sm min-h-[110px]"
              placeholder="Update details (one bullet per line)"
            />

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <select
                value={editForm.type}
                onChange={(e) => setEditForm((prev) => ({ ...prev, type: e.target.value }))}
                className="border border-pink-200 rounded-md px-3 py-2 text-sm w-full sm:w-auto"
              >
                <option value="platform">Platform Update</option>
                <option value="feature">Upcoming Feature</option>
              </select>

              <div className="flex gap-2 sm:ml-auto w-full sm:w-auto">
                <button
                  onClick={() => handleSaveEdit(update._id)}
                  disabled={savingEdit}
                  className="flex-1 sm:flex-none text-xs bg-pink-600 text-white px-3 py-2 rounded hover:bg-pink-700 transition disabled:opacity-60"
                >
                  {savingEdit ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={cancelEditing}
                  disabled={savingEdit}
                  className="flex-1 sm:flex-none text-xs bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <h3 className="text-pink-700 font-semibold text-lg">
                {update.title}
              </h3>

              <div className="flex items-center gap-2 flex-wrap">
                {!isFeatureSection && isNewUpdate(update.createdAt) && (
                  <span className="text-xs bg-pink-600 text-white px-2 py-1 rounded-full">
                    NEW
                  </span>
                )}
                {isAdmin && (
                  <>
                    <button
                      onClick={() => startEditing(update)}
                      className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUpdate(update._id)}
                      className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            <ul className="list-disc pl-5 text-black text-sm mb-2 space-y-1">
              {toBulletItems(update.description).map((item, idx) => (
                <li key={`${update._id}-${idx}`}>{item}</li>
              ))}
            </ul>

            <p className="text-gray-500 text-xs">
              Posted on {new Date(update.createdAt).toLocaleString()}
            </p>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900/70 px-4 sm:px-6 py-10">
      {/* Updates List */}
      <div className="mt-4 max-w-4xl mx-auto space-y-5">
        {/* Platform Updates Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
          Platform Updates
        </h2>

        <p className="text-gray-300 text-center text-sm mb-6 max-w-2xl mx-auto">
          Here are a list of recent updates and improvements we've made to the
          platform. We're committed to continuously enhancing your experience,
          and these updates reflect our dedication to growth and innovation.
          Stay tuned for more exciting features and improvements in the near
          future!
        </p>

        {loading ? (
          <p className="text-gray-300 text-center">Loading updates...</p>
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : platformUpdates.length === 0 ? (
          <p className="text-gray-300 text-center">No updates found.</p>
        ) : (
          platformUpdates.map((update) => renderUpdateCard(update, false))
        )}

        {/* =====================================================
           Upcoming Features Section
        ===================================================== */}

        <div className="pt-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
            Upcoming Features
          </h2>

          <p className="text-gray-300 text-center text-sm mb-6 max-w-2xl mx-auto">
            Here's a preview of some features we're actively working on. These
            improvements are part of our ongoing effort to grow and enhance the
            platform experience.
          </p>

          <div className="space-y-4">
            {featureUpdates.length === 0 ? (
              <p className="text-gray-300 text-center">
                No feature updates posted yet.
              </p>
            ) : (
              featureUpdates.map((feature) => renderUpdateCard(feature, true))
            )}
          </div>
        </div>

        {/* Return Home Button */}
        <div className="flex justify-center pt-6">
          <button
            onClick={() => navigate("/")}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-md shadow-md transition"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
