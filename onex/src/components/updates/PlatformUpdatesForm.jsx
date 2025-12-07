import { useState } from "react";

export default function PlatformUpdatesForm({ onUpdateSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in as an admin.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE || ""}/api/platform-updates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // send token
          },
          body: JSON.stringify({ title, description }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit update");
      } else {
        // ✅ Notify parent component to refresh updates
        if (onUpdateSubmit) onUpdateSubmit(data);
        setTitle("");
        setDescription("");
      }
    } catch (err) {
      setError("Server error: " + (err?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6  max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-black mb-4">
        Create Platform Update
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Update Title"
          className="border-2 border-black rounded-lg px-3 py-2 text-black text-[1rem]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Update Description"
          className="border-2 border-black rounded-lg px-3 py-2 text-black text-[1rem] min-h-[120px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-black text-white rounded-md px-4 py-2 hover:bg-green-600 transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Update"}
        </button>
      </form>
    </div>
  );
}
