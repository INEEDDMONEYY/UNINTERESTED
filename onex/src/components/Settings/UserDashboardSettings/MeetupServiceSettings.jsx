import { useState } from "react";
import { DollarSign, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function MeetupServiceSettings() {
  const [incallPrice, setIncallPrice] = useState("");
  const [outcallPrice, setOutcallPrice] = useState("");
  const [loadingField, setLoadingField] = useState(null);
  const [toast, setToast] = useState(null);

  const handleSave = async (type) => {
    try {
      setLoadingField(type);
      // Simulate async update (replace with actual API call)
      await new Promise((res) => setTimeout(res, 1000));

      setToast({
        type: "success",
        message: `${type === "incall" ? "Incall" : "Outcall"} price updated!`,
      });
    } catch (err) {
      setToast({
        type: "error",
        message: "Failed to update price.",
      });
    } finally {
      setLoadingField(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <section className="space-y-6">
      {toast && (
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow text-white text-sm transition-all ${
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

      {/* ✅ Incall Section */}
      <div className="space-y-2">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <DollarSign size={18} className="text-pink-600" />
          Incall Price
        </h3>
        <input
          type="number"
          value={incallPrice}
          onChange={(e) => setIncallPrice(e.target.value)}
          placeholder="Enter incall price"
          className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          type="button"
          disabled={loadingField === "incall"}
          onClick={() => handleSave("incall")}
          className={`flex items-center justify-center gap-2 bg-pink-600 text-white px-4 py-2 rounded transition ${
            loadingField === "incall"
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-pink-700"
          }`}
        >
          {loadingField === "incall" ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            "Save Incall Price"
          )}
        </button>
      </div>

      {/* ✅ Outcall Section */}
      <div className="space-y-2">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <DollarSign size={18} className="text-pink-600" />
          Outcall Price
        </h3>
        <input
          type="number"
          value={outcallPrice}
          onChange={(e) => setOutcallPrice(e.target.value)}
          placeholder="Enter outcall price"
          className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          type="button"
          disabled={loadingField === "outcall"}
          onClick={() => handleSave("outcall")}
          className={`flex items-center justify-center gap-2 bg-pink-600 text-white px-4 py-2 rounded transition ${
            loadingField === "outcall"
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-pink-700"
          }`}
        >
          {loadingField === "outcall" ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            "Save Outcall Price"
          )}
        </button>
      </div>
    </section>
  );
}
