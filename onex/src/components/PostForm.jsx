import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
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
    category: "",
    pictures: [], // <-- changed from single picture to array
    visibility: "",
  });

  const [acknowledged, setAcknowledged] = useState(false);

  // ✅ Ensure user is logged in
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setToast({ type: "error", msg: "You must be logged in to create a post." });
      navigate("/signin");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      // <-- handle multiple files
      setFormData((prev) => ({ ...prev, [name]: Array.from(files) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({ ...prev, category }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    if (!acknowledged) {
      setToast({ type: "error", msg: "Please acknowledge the cost before submitting." });
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setToast({ type: "error", msg: "No authentication token found. Please log in." });
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          if (key === "pictures") {
            // append each file individually
            value.forEach((file) => fd.append("pictures", file));
          } else {
            fd.append(key, value);
          }
        }
      });

      console.log("[PostForm] Submitting FormData:", formData);

      const res = await api.post("/posts", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("[PostForm] Post created successfully:", res.data);

      setToast({ type: "success", msg: "Post created successfully!" });

      if (onSuccess) onSuccess();

      setFormData({
        title: "",
        description: "",
        city: "",
        state: "",
        category: "",
        pictures: [],
        visibility: "",
      });
      setAcknowledged(false);

      if (!embedded) {
        setTimeout(() => {
          navigate(formData.category ? `/category/${formData.category}` : "/home");
        }, 1200);
      }
    } catch (err) {
      console.error("[PostForm] Post creation error:", err.response?.data || err.message);
      setToast({
        type: "error",
        msg:
          err.response?.data?.error ||
          "Error creating post. Make sure you are logged in.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full ${
        embedded ? "bg-transparent shadow-none" : "bg-white shadow-md"
      } rounded-2xl p-4 sm:p-6 max-w-xl mx-auto`}
    >
      {!embedded && (
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          Create New Post
        </h1>
      )}

      <div className="mb-4">
        <label className="block mb-2 font-semibold text-sm sm:text-base">
          Choose Category:
        </label>
        <div className="overflow-x-auto">
          <CategoryList onSelect={handleCategorySelect} />
        </div>
        {formData.category && (
          <p className="text-xs sm:text-sm text-gray-600 mt-1 text-center sm:text-left">
            Selected:{" "}
            <span className="font-medium text-gray-800">{formData.category}</span>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-sm sm:text-base"
        />
        <textarea
          name="description"
          placeholder="What's on your mind?"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-sm sm:text-base resize-none"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="flex-1 border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-sm sm:text-base"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="flex-1 border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-sm sm:text-base"
          />
        </div>

        <input
          type="file"
          name="pictures"
          accept="image/*"
          multiple // <-- allow multiple images
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base"
        />

        <select
          name="visibility"
          value={formData.visibility}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-gray-700 focus:ring-2 focus:ring-pink-400 focus:outline-none text-sm sm:text-base"
        >
          <option value="" disabled>
            See's Only
          </option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Both">Both</option>
        </select>

        <label className="flex items-start gap-2 mt-1 text-xs sm:text-sm text-gray-700">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-1 w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-400"
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
          className="w-full bg-gradient-to-r from-pink-500 to-yellow-400 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Post"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/home")}
          className="w-full flex items-center justify-center gap-2 py-2 sm:py-3 mt-2 rounded-lg border border-pink-400 text-pink-600 hover:bg-pink-50 transition text-sm sm:text-base font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Return Home
        </button>
      </form>

      {toast && (
        <div
          className={`mt-4 flex items-center gap-2 p-3 rounded-lg text-sm sm:text-base ${
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
