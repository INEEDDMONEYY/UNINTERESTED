import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PlatformUpdatesPage() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL ||
          import.meta.env.VITE_API_BASE ||
          import.meta.env.VITE_API_URL ||
          ""
        }/api/updates`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUpdates(Array.isArray(data) ? data : []);
      } else {
        setError(data.error || "Failed to load updates");
      }
    } catch (err) {
      setError("Server error: " + (err?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900/70 px-4 sm:px-6 py-10">
      {/* Updates List */}
      <div className="mt-4 max-w-4xl mx-auto space-y-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
          Platform Updates
        </h2>

        {loading ? (
          <p className="text-gray-300 text-center">Loading updates...</p>
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : updates.length === 0 ? (
          <p className="text-gray-300 text-center">No updates found.</p>
        ) : (
          updates.map((update) => (
            <div
              key={update._id}
              className="bg-white rounded-xl p-5 shadow-md border border-pink-200"
            >
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <h3 className="text-pink-700 font-semibold text-lg">
                  {update.title}
                </h3>

                {/* New Update Badge */}
                {isNewUpdate(update.createdAt) && (
                  <span className="text-xs bg-pink-600 text-white px-2 py-1 rounded-full">
                    NEW
                  </span>
                )}
              </div>

              <ul className="list-disc pl-5 text-black text-sm mb-2 space-y-1">
                {toBulletItems(update.description).map((item, idx) => (
                  <li key={`${update._id}-${idx}`}>{item}</li>
                ))}
              </ul>

              <p className="text-gray-500 text-xs">
                Posted on {new Date(update.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}

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