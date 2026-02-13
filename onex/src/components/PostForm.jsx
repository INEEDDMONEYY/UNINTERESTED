import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // fixed import
import { Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import CategoryList from "../components/Categories/categoryList";
import api, { getAuthToken } from "../utils/api";

export default function PostForm({ onSuccess, embedded = false }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    state: "",
    country: "",
    category: "",
    pictures: [],
    visibility: "",
  });

  const [acknowledged, setAcknowledged] = useState(false);

  // Ensure user is logged in
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setToast({ type: "error", msg: "You must be logged in to create a post." });
      navigate("/signin");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setToast(null);

  if (!acknowledged) {
    setToast({ type: "error", msg: "Please acknowledge the cost before submitting." });
    return;
  }

  const token = getAuthToken();
  if (!token) {
    setToast({ type: "error", msg: "No auth token. Please log in." });
    return;
  }

  setLoading(true);

  try {
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        if (key === "pictures") {
          value.forEach((file) => fd.append("pictures", file)); // MUST match multer field name
        } else {
          fd.append(key, value);
        }
      }
    });

    console.log("[PostForm] Sending FormData:");
    for (let pair of fd.entries()) console.log(pair[0], pair[1]);

    const res = await api.post("/posts", fd, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    console.log("[PostForm] Post created:", res.data);
    setToast({ type: "success", msg: "Post created successfully!" });
    if (onSuccess) onSuccess();
  } catch (err) {
    console.error("[PostForm] Error:", err.response?.data || err.message);
    setToast({ type: "error", msg: err.response?.data?.error || "Error creating post" });
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className={`w-full ${
        embedded ? "bg-transparent shadow-none" : "bg-white shadow-md"
      } rounded-2xl p-4 sm:p-6 md:p-8 max-w-3xl mx-auto`}
    >
      {!embedded && (
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center">
          Create New Post
        </h1>
      )}

      <div className="mb-4">
        <label className="block mb-2 font-semibold text-sm sm:text-base md:text-lg">
          Choose Category:
        </label>
        <div className="overflow-x-auto">
          <CategoryList onSelect={handleCategorySelect} />
        </div>
        {formData.category && (
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 text-center sm:text-left">
            Selected:{" "}
            <span className="font-medium text-gray-800">{formData.category}</span>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 md:gap-5">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 sm:p-3 md:p-4 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-sm sm:text-base md:text-lg"
        />
        <textarea
          name="description"
          placeholder="What's on your mind?"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full border border-gray-300 p-2 sm:p-3 md:p-4 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-sm sm:text-base md:text-lg resize-none"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="flex-1 border border-gray-300 p-2 sm:p-3 md:p-4 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-sm sm:text-base md:text-lg"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="flex-1 border border-gray-300 p-2 sm:p-3 md:p-4 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-sm sm:text-base md:text-lg"
          />
        </div>

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          className="flex-1 border border-gray-300 p-2 sm:p-3 md:p-4 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-sm sm:text-base md:text-lg"
        />

        <input
          type="file"
          name="pictures"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 sm:p-3 md:p-4 rounded-lg text-sm sm:text-base md:text-lg"
        />

        <select
          name="visibility"
          value={formData.visibility}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 sm:p-3 md:p-4 rounded-lg text-gray-700 focus:ring-2 focus:ring-pink-400 focus:outline-none text-sm sm:text-base md:text-lg"
        >
          <option value="" disabled>
            See's Only
          </option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Both">Both</option>
        </select>

        <label className="flex items-start gap-2 mt-1 text-xs sm:text-sm md:text-base text-gray-700">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-pink-500 border-gray-300 rounded focus:ring-pink-400"
          />
          <span>
            By acknowledging this checkbox, you are acknowledging that each post
            will cost <strong>$13</strong>. If you have any questions, please
            look at our{" "}
            <a href="/terms-policy" className="text-pink-600 underline">
              policies page
            </a>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-yellow-400 text-white py-2 sm:py-3 md:py-4 rounded-lg text-sm sm:text-base md:text-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Post"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/home")}
          className="w-full flex items-center justify-center gap-2 py-2 sm:py-3 md:py-4 mt-2 rounded-lg border border-pink-400 text-pink-600 hover:bg-pink-50 transition text-sm sm:text-base md:text-lg font-medium"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> Return Home
        </button>
      </form>

      {toast && (
        <div
          className={`mt-4 flex items-center gap-2 p-3 rounded-lg text-sm sm:text-base md:text-lg ${
            toast.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {toast.type === "success" ? <CheckCircle /> : <XCircle />}{" "}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
