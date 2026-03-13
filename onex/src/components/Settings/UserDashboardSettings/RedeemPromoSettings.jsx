import { useContext, useState } from "react";
import { Ticket, Gift } from "lucide-react";
import { UserContext } from "../../../context/UserContext";
import api from "../../../utils/api";
import confetti from "canvas-confetti";

const emitAppToast = (type, message) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("app-toast", { detail: { type, message } }));
};

const emitPromoRefresh = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("promo-updated"));
};

// 🎉 Confetti animation
const fireConfetti = () => {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 },
  });
};

export default function RedeemPromoSettings() {
  const { user, setUser } = useContext(UserContext);
  const [promoCode, setPromoCode] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRedeem = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    if (!promoCode.trim()) {
      const message = "Please enter a promo code.";
      setStatusMessage(message);
      emitAppToast("error", message);
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.post("/promo-codes/redeem", {
        code: promoCode.trim().toUpperCase(),
      });

      const durationDays = res.data?.data?.durationDays;
      const expiresAt = res.data?.data?.expiresAt;
      const expiryText = expiresAt ? new Date(expiresAt).toLocaleString() : null;
      const updatedUser = res.data?.user;

      const successMessage = durationDays
        ? `Promo accepted. Active for ${durationDays} day${
            durationDays === 1 ? "" : "s"
          }${expiryText ? ` (until ${expiryText})` : ""}.`
        : res.data?.message || "Promo code accepted.";

      // Update user context with new activePromoExpiry
      if (updatedUser && setUser) {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setStatusMessage(successMessage);
      emitAppToast("success", successMessage);
      emitPromoRefresh();

      // 🎉 Trigger confetti on success
      fireConfetti();

      setPromoCode("");
    } catch (err) {
      console.error("Failed to redeem promo code", err);

      const message =
        err.response?.data?.error ||
        "Failed to redeem promo code. Please try again.";

      setStatusMessage(message);
      emitAppToast("error", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center gap-2 text-gray-700 font-medium">
        <Ticket size={18} className="text-pink-600" />
        <span>Redeem Promo Code</span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500">
        Enter your promo code below to redeem special offers or bonuses.
      </p>

      {user?.username && (
        <p className="text-xs text-gray-400">
          Redeeming as @{user.username}
        </p>
      )}

      {statusMessage && (
        <p className="text-sm text-gray-700">{statusMessage}</p>
      )}

      {/* Form */}
      <form
        onSubmit={handleRedeem}
        className="flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Enter promo code"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 active:scale-95 transition"
        >
          <Gift size={16} />
          {submitting ? "Redeeming..." : "Redeem"}
        </button>
      </form>

    </div>
  );
}