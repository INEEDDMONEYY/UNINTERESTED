import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import CategoryList from "../Categories/categoryList";
import api, { getAuthToken } from "../../utils/api";
import { UserContext } from "../../context/UserContext";

export default function PostForm({ onSuccess, embedded = false }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [hasActivePromo, setHasActivePromo] = useState(false);
  const [promoExpiryAt, setPromoExpiryAt] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    state: "",
    country: "",
    category: "",
    pictures: [],
    visibility: "",
    promoCode: "",
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

  // Check for active promo redemption
  useEffect(() => {
    if (user?.activePromoExpiry) {
      const expiryDate = new Date(user.activePromoExpiry);
      const now = new Date();
      if (now < expiryDate) {
        setHasActivePromo(true);
        setPromoExpiryAt(user.activePromoExpiry);
      } else {
        setHasActivePromo(false);
        setPromoExpiryAt("");
      }
    } else {
      setHasActivePromo(false);
      setPromoExpiryAt("");
    }
  }, [user]);

  // ----------------------- Handlers -----------------------
  const handleCategorySelect = (category) => {
    setFormData((prev) => ({ ...prev, category }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      // handle file uploads
      setFormData((prev) => ({ ...prev, [name]: Array.from(files) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    if (!acknowledged) {
      setToast({ type: "error", msg: "Please acknowledge the posting terms before submitting." });
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setToast({ type: "error", msg: "No authentication token found. Please log in." });
      return;
    }

    setLoading(true);

    try {
      let effectivePromoExpiry = hasActivePromo ? promoExpiryAt : "";
      const enteredPromoCode = formData.promoCode?.trim();

      if (enteredPromoCode) {
        const { data: redeemData } = await api.post("/promo-codes/redeem", {
          code: enteredPromoCode,
        });

        effectivePromoExpiry =
          redeemData?.data?.expiresAt ||
          redeemData?.user?.activePromoExpiry ||
          effectivePromoExpiry;

        if (effectivePromoExpiry) {
          setHasActivePromo(true);
          setPromoExpiryAt(effectivePromoExpiry);
        }
      }

      const fd = new FormData();
      const effectiveCategory = formData.category?.trim() || "uncategorized";
      const payload = { ...formData, category: effectiveCategory };

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null) {
          if (key === "pictures") {
            value.forEach((file) => fd.append("pictures", file)); // MUST match multer field name
          } else if (key === "promoCode") {
            // promo code is handled by redeem endpoint and is not part of post payload
          } else {
            fd.append(key, value);
          }
        }
      });

      // Add promo status only when promo is active/redeemed.
      if (effectivePromoExpiry) {
        fd.append("isPromo", "true");
        fd.append("promoExpiresAt", effectivePromoExpiry);
      }

      console.log("[PostForm] Sending FormData:");
      for (let pair of fd.entries()) console.log(pair[0], pair[1]);

      await api.post("/posts", fd, { headers: { Authorization: `Bearer ${token}` } });

      console.log("[PostForm] Post created successfully");
      setToast({ type: "success", msg: "Post created successfully!" });
      if (onSuccess) onSuccess();

      // reset form
      const category = effectiveCategory;
      setFormData({
        title: "",
        description: "",
        city: "",
        state: "",
        country: "",
        category: "",
        pictures: [],
        visibility: "",
        promoCode: "",
      });
      setAcknowledged(false);

      if (!embedded) {
        setTimeout(() => {
          navigate(
            category && category.toLowerCase() !== "uncategorized"
              ? `/category/${category}`
              : "/home",
          );
        }, 1200);
      }
    } catch (err) {
      console.error("[PostForm] Error:", err.response?.data || err.message);
      setToast({
        type: "error",
        msg: err.response?.data?.error || "Error creating post. Make sure you are logged in.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ----------------------- Render -----------------------
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
        <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center sm:text-center">
          Leave category blank to post to uncategorized, or select one to place your post there.
        </p>
        {formData.category && (
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 text-center sm:text-center">
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
          type="text"
          name="promoCode"
          placeholder="Promo code (optional)"
          value={formData.promoCode}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 sm:p-3 md:p-4 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-sm sm:text-base md:text-lg"
        />

        <input
          type="file"
          name="pictures"
          accept="image/*,video/*"
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
            By acknowledging this checkbox, you confirm your post follows platform rules and understand promo codes are optional but required for promoted placement. If you have any questions, please look at our{" "}
            <a href="/terms-policy" className="text-pink-600 underline">policy page</a>.
          </span>
        </label>

        <p className="text-xs sm:text-sm text-gray-600">
          for extra exposure on the platfrom you will have to pay
        </p>

        {hasActivePromo && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-center">
            ✓ Promo Post Activated
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 sm:py-3 md:py-4 rounded-lg text-sm sm:text-base md:text-lg font-semibold flex items-center justify-center gap-2 transition ${
            loading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-500 to-yellow-400 text-white hover:opacity-90"
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Post"
          )}
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
