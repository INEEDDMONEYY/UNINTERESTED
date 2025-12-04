import { useState, useEffect } from "react";

export default function PlatformUpdatesPage() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE || ""}/api/updates`,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-800 p-6">
      {/* Updates List */}
      <div className="mt-8 max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">Platform Updates</h2>

        {loading ? (
          <p className="text-gray-300">Loading updates...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : updates.length === 0 ? (
          <p className="text-gray-300">No updates found.</p>
        ) : (
          updates.map((update) => (
            <div
              key={update._id}
              className="bg-white rounded-lg p-4 shadow-md border border-pink-200"
            >
              <h3 className="text-pink-700 font-semibold text-lg mb-2">
                {update.title}
              </h3>
              <p className="text-black text-sm mb-2">{update.description}</p>
              <p className="text-gray-500 text-xs">
                Posted on {new Date(update.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
