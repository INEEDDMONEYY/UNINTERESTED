import { useEffect, useState } from "react";
import api from "../../../utils/api";

export default function PromocodeSettings() {
  const [code, setCode] = useState("");
  const [duration, setDuration] = useState("7");
  const [maxUses, setMaxUses] = useState("1");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [promoCodes, setPromoCodes] = useState([]);

  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const res = await api.get("/admin/promo-codes");
        const codes = res.data?.data;
        setPromoCodes(Array.isArray(codes) ? codes : []);
      } catch (err) {
        console.error("Failed to load promo codes", err);
        setError(err.response?.data?.error || "Failed to load promo codes.");
      }
    };

    fetchPromoCodes();
  }, []);

  const handleCreateCode = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const normalizedCode = code.trim().toUpperCase();
    const assignedTo = userId.trim();

    if (!normalizedCode) {
      setError("Promo code is required.");
      return;
    }

    try {
      const res = await api.post("/admin/promo-codes", {
        code: normalizedCode,
        durationDays: Number(duration),
        maxUses: Number(maxUses),
        assignedUser: assignedTo || "",
      });

      const created = res.data?.data;
      if (created) {
        setPromoCodes((prev) => [created, ...prev]);
      }

      setSuccess(`Promo code ${normalizedCode} created successfully.`);
      setCode("");
      setDuration("7");
      setMaxUses("1");
      setUserId("");
    } catch (err) {
      console.error("Failed to create promo code", err);
      setError(err.response?.data?.error || "Failed to create promo code.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-6 text-center md:text-left">
        Promocode Settings
      </h2>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {success && <p className="mb-4 text-sm text-green-600">{success}</p>}

      {/* Create Promocode Card */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">
          Grant Free Posting Period
        </h3>

        <form
          onSubmit={handleCreateCode}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Promo Code */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">Promo Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="FREEPOST"
              required
              className="border rounded-lg px-3 py-2"
            />
          </div>

          {/* Duration */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">Free Posting Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="1">1 Day</option>
              <option value="7">7 Days</option>
              <option value="30">30 Days</option>
              <option value="90">90 Days</option>
            </select>
          </div>

          {/* Max Uses */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">Max Uses</label>
            <input
              type="number"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              min="1"
              className="border rounded-lg px-3 py-2"
            />
          </div>

          {/* Specific User */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">Assign to User (optional)</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="User ID or Username"
              className="border rounded-lg px-3 py-2"
            />
          </div>

          {/* Button */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end mt-2">
            <button
              type="submit"
              className="px-6 py-2 text-white rounded-lg shadow-md bg-gradient-to-r from-pink-500 via-black to-yellow-400 hover:opacity-90"
            >
              Create Promocode
            </button>
          </div>
        </form>
      </div>

      {/* Existing Promo Codes */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Active Promo Codes</h3>

        {promoCodes.length === 0 ? (
          <p className="text-gray-500 text-sm">No promo codes created yet.</p>
        ) : (
          <>
            {/* =========================
          MOBILE CARD VIEW
         ========================= */}
            <div className="space-y-4 md:hidden">
              {promoCodes.map((promo) => (
                <div
                  key={promo._id || promo.id}
                  className="border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-pink-600">
                      {promo.code}
                    </span>
                    <span className="text-xs text-gray-500">
                      {promo.createdAt
                        ? new Date(promo.createdAt).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>

                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-medium">Duration:</span>{" "}
                      {promo.durationDays || promo.duration} days
                    </p>

                    <p>
                      <span className="font-medium">Max Uses:</span>{" "}
                      {promo.maxUses}
                    </p>

                    <p>
                      <span className="font-medium">Usage:</span>{" "}
                      {promo.usageCount || 0}/{promo.maxUses}
                    </p>

                    <p>
                      <span className="font-medium">Assigned:</span>{" "}
                      {promo.assignedUser?.username ||
                        promo.assignedUser?.email ||
                        "All Users"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* =========================
          DESKTOP TABLE VIEW
         ========================= */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Code</th>
                    <th className="py-2">Duration</th>
                    <th className="py-2">Max Uses</th>
                    <th className="py-2">Usage</th>
                    <th className="py-2">Assigned User</th>
                    <th className="py-2">Created</th>
                  </tr>
                </thead>

                <tbody>
                  {promoCodes.map((promo) => (
                    <tr key={promo._id || promo.id} className="border-b">
                      <td className="py-2 font-semibold">{promo.code}</td>

                      <td className="py-2">
                        {promo.durationDays || promo.duration} days
                      </td>

                      <td className="py-2">{promo.maxUses}</td>

                      <td className="py-2">
                        {promo.usageCount || 0}/{promo.maxUses}
                      </td>

                      <td className="py-2">
                        {promo.assignedUser?.username ||
                          promo.assignedUser?.email ||
                          "All Users"}
                      </td>

                      <td className="py-2 text-gray-500">
                        {promo.createdAt
                          ? new Date(promo.createdAt).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
