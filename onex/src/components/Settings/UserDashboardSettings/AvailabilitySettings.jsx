import { useState } from "react";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

export default function AvailabilitySettings({ onAvailabilitySave }) {
  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const suffix = i < 12 ? "AM" : "PM";
    return `${hour}:00 ${suffix}`;
  });

  const [availability, setAvailability] = useState({});
  const [loadingDay, setLoadingDay] = useState(null);
  const [toast, setToast] = useState(null);

  const handleSave = async (day) => {
    try {
      setLoadingDay(day);

      if (onAvailabilitySave) {
        await onAvailabilitySave({ [day]: availability[day] });
      } else {
        await new Promise((res) => setTimeout(res, 1000)); // fallback mock
      }

      setToast({ type: "success", message: `${day} availability saved!` });
    } catch {
      setToast({ type: "error", message: `Failed to save ${day} availability.` });
    } finally {
      setLoadingDay(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <section className="w-full px-4 py-6 md:px-6 lg:px-8">
      <h2 className="text-xl md:text-2xl font-semibold text-pink-700 mb-6 text-center">
        Set your availability so your clients know when to book.
      </h2>

      {toast && (
        <div
          className={`flex items-center gap-2 px-4 py-2 mb-4 rounded-lg shadow text-white text-sm transition-all ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysOfWeek.map((day) => (
          <div key={day} className="bg-white shadow rounded-lg p-4 space-y-3">
            <label className="block text-pink-600 font-medium">{day}</label>
            <select
              value={availability[day] || ""}
              onChange={(e) =>
                setAvailability({ ...availability, [day]: e.target.value })
              }
              className="w-full border border-pink-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Select available time</option>
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={loadingDay === day}
              onClick={() => handleSave(day)}
              className={`flex items-center justify-center gap-2 bg-pink-600 text-white text-xs px-3 py-1.5 rounded transition ${
                loadingDay === day
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-pink-700"
              }`}
            >
              {loadingDay === day ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <>
                  <Clock size={14} />
                  Save
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
