// Availability Settings
import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

export default function AvailabilitySettings({
  availability,
  setAvailability,
  userId,
}) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Per-user localStorage key
  const storageKey = userId ? `availability_${userId}` : "availability";

  // ✅ Load availability from backend first (true cross-device persistence)
  useEffect(() => {
    async function loadFromBackend() {
      try {
        const res = await fetch("/api/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (data?.availability) {
          setAvailability({ status: data.availability });

          // Sync to localStorage
          localStorage.setItem(
            storageKey,
            JSON.stringify({ status: data.availability })
          );

          return; // stop here if backend had data
        }
      } catch (err) {
        console.error("Failed to load availability from backend", err);
      }

      // Fallback: load from localStorage
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved && typeof saved === "object" && "status" in saved) {
            setAvailability(saved);
          }
        }
      } catch {}
    }

    loadFromBackend();
  }, [userId]);
  

  // Persist to localStorage whenever availability changes
  useEffect(() => {
    if (!availability) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(availability));
    } catch {}
  }, [availability, storageKey]);


  // Toast on status change
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


  // Save to backend
  const handleSave = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/users/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          availability: availability.status,
        }),
      });

      await res.json();

      setToast({
        type: "success",
        message: "Availability saved!",
      });
    } catch (err) {
      setToast({
        type: "error",
        message: "Failed to save availability",
      });
    }

    setLoading(false);
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
