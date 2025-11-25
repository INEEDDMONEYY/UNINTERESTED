//Availability Settings
import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

export default function AvailabilitySettings({
  availability,
  setAvailability,
  userId, // ✅ new optional prop to namespace by user
}) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // ✅ Build a per-user storage key (falls back to a generic key if no userId)
  const storageKey = userId ? `availability_${userId}` : "availability";

  // ✅ Read availability for the current userId on mount / user change
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        // Only update if saved shape looks right
        if (saved && typeof saved === "object" && "status" in saved) {
          setAvailability(saved);
        }
      }
    } catch {
      // ignore parsing errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // re-hydrate when user identity changes

  // ✅ Persist to localStorage whenever availability changes (for this userId)
  useEffect(() => {
    if (!availability) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(availability));
    } catch {
      // ignore storage errors
    }
  }, [availability, storageKey]);

  // Whenever availability.status changes, show a toast
  useEffect(() => {
    if (availability.status) {
      setToast({
        type: "success",
        message: `Availability set to "${availability.status}"`,
      });

      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [availability.status]);

  const handleSave = () => {
    setLoading(true);

    // Simulate a save action locally
    setTimeout(() => {
      // ✅ Explicitly persist current value for this user
      try {
        localStorage.setItem(storageKey, JSON.stringify(availability));
      } catch {
        // ignore storage errors
      }

      setToast({
        type: "success",
        message: "Availability saved locally!",
      });
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }, 1000);
  };

  return (
    <section className="w-full px-4 py-6 md:px-6 lg:px-8">
      <h2 className="text-xl md:text-2xl font-semibold text-pink-700 mb-6 text-center">
        Set your availability status
      </h2>

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

      {/* ✅ Redesigned Flex Layout */}
      <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center space-y-4 max-w-md mx-auto text-center">
        <label className="block text-pink-600 font-medium">Availability</label>
        <select
          value={availability.status || ""}
          onChange={(e) =>
            setAvailability({ ...availability, status: e.target.value })
          }
          className="w-full max-w-xs border border-pink-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 text-center"
        >
          <option value="">Select status</option>
          <option value="Available">Available</option>
          <option value="Not Available">Not Available</option>
        </select>

        <button
          type="button"
          disabled={loading}
          onClick={handleSave}
          className={`flex items-center justify-center gap-2 bg-pink-600 text-white px-6 py-2 rounded transition ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-pink-700"
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <Clock size={16} />
              Save
            </>
          )}
        </button>
      </div>
    </section>
  );
}
