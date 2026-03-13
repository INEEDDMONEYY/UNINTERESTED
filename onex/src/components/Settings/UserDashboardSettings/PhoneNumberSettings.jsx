import { useContext, useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle, Phone } from "lucide-react";
import { UserContext } from "../../../context/UserContext";

export default function PhoneNumberSettings({ user }) {
  const { updateProfile } = useContext(UserContext);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const incomingPhone =
      user?.phoneNumber ||
      (() => {
        try {
          const storedUser = localStorage.getItem("user");
          if (!storedUser) return "";
          return JSON.parse(storedUser)?.phoneNumber || "";
        } catch {
          return "";
        }
      })();

    setPhone(incomingPhone);
  }, [user?.phoneNumber]);

  const handleSave = async () => {
    if (!phone.trim()) {
      setToast({ type: "error", message: "Phone number cannot be empty." });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ phoneNumber: phone.trim() });

      setToast({ type: "success", message: "Phone number saved successfully!" });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to save phone number" });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <section className="w-full px-4 py-6 md:px-6 lg:px-8">
      {toast && (
        <div
          className={`flex items-center justify-center gap-2 px-4 py-2 mb-4 rounded-lg shadow text-white text-sm transition-all ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <XCircle size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center space-y-4 max-w-md mx-auto text-center">
        <label className="block text-pink-600 font-medium flex items-center gap-2">
          <Phone size={16} /> Phone Number
        </label>

        <input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full max-w-xs border border-pink-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 text-center"
        />

        <button
          type="button"
          disabled={loading}
          onClick={handleSave}
          className={`flex items-center justify-center gap-2 bg-pink-600 text-white px-6 py-2 rounded transition ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-pink-700"
          }`}
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Save"}
        </button>
      </div>
    </section>
  );
}