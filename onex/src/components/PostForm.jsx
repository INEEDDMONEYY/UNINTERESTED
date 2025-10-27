import { useState } from "react";
import { useNavigate } from "react-router";
import { Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import CategoryList from "../components/Categories/categoryList";
import api from "../utils/api";

export default function PostForm({ onSuccess, embedded = false }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    description: "",
    city: "",
    state: "",
    category: "",
    picture: null,
  });

  // 🧠 Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, picture: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🏷️ Handle category selection
  const handleCategorySelect = (category) => {
    setFormData((prev) => ({ ...prev, category }));
  };

  // 🚀 Handle submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value);
      });

      await api.post("/posts", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setToast({ type: "success", msg: "Post created successfully!" });

      if (onSuccess) onSuccess();

      setFormData({
        title: "",
        username: "",
        description: "",
        city: "",
        state: "",
        category: "",
        picture: null,
      });

      // 🔁 Navigate based on category selection
      if (!embedded) {
        setTimeout(() => {
          if (formData.category) {
            navigate(`/category/${formData.category}`);
          } else {
            navigate("/home");
          }
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", msg: "Error creating post. Please try again." });
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

      {/* Category Selector */}
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
            <span className="font-medium text-gray-800">
              {formData.category}
            </span>
          </p>
        )}
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
        <input
          type="text"
          name="username"
          placeholder="Your name"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-sm sm:text-base"
        />
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
          name="picture"
          accept="image/*"
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base"
        />

        {/* Post Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-yellow-400 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Post"}
        </button>

        {/* 🔙 Return Button */}
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="w-full flex items-center justify-center gap-2 py-2 sm:py-3 mt-2 rounded-lg border border-pink-400 text-pink-600 hover:bg-pink-50 transition text-sm sm:text-base font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Return Home
        </button>
      </form>

      {/* Toast */}
      {toast && (
        <div
          className={`mt-4 flex items-center gap-2 p-3 rounded-lg text-sm sm:text-base ${
            toast.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {toast.type === "success" ? <CheckCircle /> : <XCircle />}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
