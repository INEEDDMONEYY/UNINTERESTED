import { useState } from "react";
import api from "../../utils/api";

export default function NewFeatureUpdatesForm({ onFeatureSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data } = await api.post("/updates", {
        title,
        description,
        type: "feature",
      });

      if (onFeatureSubmit) onFeatureSubmit(data);

      setTitle("");
      setDescription("");
      setSuccess("Feature update posted successfully.");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to submit feature update.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-black mb-4">
        Create New Feature Update
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Feature Title"
          className="border-2 border-black rounded-lg px-3 py-2 text-black text-[1rem]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Feature Description"
          className="border-2 border-black rounded-lg px-3 py-2 text-black text-[1rem] min-h-[120px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <p className="text-xs text-gray-600 -mt-2">
          Tip: Enter one point per line if you want features to appear as bullet points.
        </p>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          className="bg-black text-white rounded-md px-4 py-2 hover:bg-green-600 transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Feature"}
        </button>
      </form>
    </div>
  );
}