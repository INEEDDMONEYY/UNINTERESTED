import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

export default function PostForm() {
  const navigate = useNavigate();

  // 🧩 Local state hooks
  const [formData, setFormData] = useState({
    picture: null,
    username: "",
    description: "",
    city: "",
    state: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg: string }

  // 🧠 Controlled form inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  function CheckboxMessage() {
    return `Checking this box acknowledges that each post will cost $10. 
    Please review our post policy before submitting.`;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setToast(null);

    const { username, description } = formData;
    if (!username.trim() || !description.trim()) {
      setToast({ type: "error", msg: "Title and description are required." });
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      // Map client field names to backend equivalents
      data.append("title", username);
      data.append("content", description);

      // ✅ API URL fallback logic
      const API_BASE =
        import.meta.env.VITE_API_URL ||
        (window.location.hostname === "localhost"
          ? "http://localhost:5020"
          : "https://uninterested.onrender.com");

      await axios.post(`${API_BASE}/api/posts`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setToast({
        type: "success",
        msg: "Post submitted successfully! Redirecting...",
      });

      // Reset form
      setFormData({
        picture: null,
        username: "",
        description: "",
        city: "",
        state: "",
      });

      // Redirect after success
      setTimeout(() => navigate("/home"), 900);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setToast({
        type: "error",
        msg: "Failed to post — check console for details.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <form id="post-form" className="flex flex-col w-96" onSubmit={handleSubmit}>
        <input
          type="file"
          name="picture"
          id="post-picture"
          onChange={handleChange}
          className="border-2 border-black m-2 px-1 text-[1rem] text-black rounded-lg"
        />
        <input
          type="text"
          name="username"
          id="post-username"
          value={formData.username}
          onChange={handleChange}
          className="border-2 border-black m-2 px-1 text-[1rem] text-black rounded-lg"
          placeholder="Enter Title"
          required
        />
        <textarea
          name="description"
          id="post-description"
          value={formData.description}
          onChange={handleChange}
          className="border-2 border-black m-2 px-1 text-[1rem] text-black rounded-lg"
          placeholder="Enter text"
          required
        />

        {/* Optional city/state for filtering */}
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City (optional)"
          className="border-2 border-black m-2 px-1 text-[1rem] text-black rounded-lg"
        />
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State (optional)"
          className="border-2 border-black m-2 px-1 text-[1rem] text-black rounded-lg"
        />

        <div className="p-1 text-[0.7rem]">
          <input type="checkbox" id="payment-checkbox" />
          <label htmlFor="payment-checkbox" className="mx-1">
            {CheckboxMessage()}
          </label>
        </div>

        <button
          type="submit"
          className="border-2 border-white m-1 px-1 text-black text-[1.3rem] rounded-md"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>

        <Link to="/home">
          <p className="underline text-black">Return home</p>
        </Link>
      </form>

      {/* Toasts */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 px-4 py-2 rounded-lg shadow-lg ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.msg}
          <button
            onClick={() => setToast(null)}
            className="ml-3 underline text-sm opacity-90"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
