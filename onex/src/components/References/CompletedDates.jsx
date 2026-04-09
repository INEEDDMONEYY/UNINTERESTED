import { useState } from "react";
import { CalendarPlus, CheckCircle2, XCircle, RefreshCcw, Trash2 } from "lucide-react";
import { useUser } from "../../context/useUser";

const STATUS_OPTIONS = [
  { value: "yes", label: "Yes", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 border-green-300" },
  { value: "no", label: "No", icon: XCircle, color: "text-red-500", bg: "bg-red-50 border-red-300" },
  { value: "reschedule", label: "Reschedule", icon: RefreshCcw, color: "text-amber-600", bg: "bg-amber-50 border-amber-300" },
];

const STATUS_BADGE = {
  yes: "bg-green-100 text-green-700 border border-green-200",
  no: "bg-red-100 text-red-600 border border-red-200",
  reschedule: "bg-amber-100 text-amber-700 border border-amber-200",
};

export default function CompletedDates({ userId }) {
  const { user } = useUser();
  const isOwner = user && userId && (user._id === userId || user.id === userId);

  const [entries, setEntries] = useState([]);
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("yes");

  const handleAdd = () => {
    if (!date) return;
    setEntries((prev) => [
      { id: crypto.randomUUID(), date, status },
      ...prev,
    ]);
    setDate("");
    setStatus("yes");
  };

  const handleRemove = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="rounded-xl border border-pink-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-800 tracking-wide uppercase">
        Completed Dates
      </h3>

      {/* Input row — owner only */}
      {isOwner && (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <label className="text-xs font-medium text-gray-500">Date Hosted</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Outcome</label>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={`flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition active:scale-95 ${
                  status === opt.value
                    ? `${opt.bg} ${opt.color} ring-2 ring-offset-1 ring-pink-300`
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <opt.icon size={13} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!date}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-pink-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-pink-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CalendarPlus size={15} />
          Add
        </button>
      </div>
      )}

      {/* Entries list */}
      {entries.length > 0 ? (
        <ul className="mt-5 space-y-2">
          {entries.map(({ id, date, status }) => {
            const opt = STATUS_OPTIONS.find((o) => o.value === status);
            const Icon = opt?.icon;
            return (
              <li
                key={id}
                className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="shrink-0 text-sm text-gray-700">
                    {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[status]}`}
                  >
                    {Icon && <Icon size={11} />}
                    {opt?.label}
                  </span>
                </div>
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => handleRemove(id)}
                    className="shrink-0 rounded p-1 text-gray-400 transition hover:text-red-500 active:scale-95"
                    aria-label="Remove entry"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-5 text-center text-xs text-gray-400">
          No dates recorded yet.
        </p>
      )}
    </div>
  );
}
