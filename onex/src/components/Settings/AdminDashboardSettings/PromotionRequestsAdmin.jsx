

import { useEffect, useState } from "react";
import api from "../../../utils/api";

export default function PromotionRequestsAdmin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [badgeChecked, setBadgeChecked] = useState(false);
  const [promoChecked, setPromoChecked] = useState(false);
  const [promoDuration, setPromoDuration] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch all non-admin users
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/admin/users");
        setUsers((data?.data || []).filter(u => u.role !== "admin"));
      } catch (e) {
        setError("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      if (!badgeChecked && !promoChecked) throw new Error("Select at least one option");
      if (promoChecked && !promoDuration) throw new Error("Select a promo duration");
      let badgeType = undefined;
      let promoActive = undefined;
      let duration = undefined;
      if (badgeChecked) badgeType = "blue";
      if (promoChecked) {
        promoActive = true;
        duration = promoDuration;
      }
      await api.post(`/admin/users/promote`, {
        userId: selectedUser,
        badgeType,
        promoActive,
        duration,
      });
      setSuccess("User promotion updated successfully!");
      setSelectedUser("");
      setBadgeChecked(false);
      setPromoChecked(false);
      setPromoDuration("");
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Failed to promote user");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.post(`/admin/users/promote`, {
        userId: selectedUser,
        cancel: true,
      });
      setSuccess("Promotion and badge cancelled for user.");
      setSelectedUser("");
      setBadgeChecked(false);
      setPromoChecked(false);
      setPromoDuration("");
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Failed to cancel promotion");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-pink-200 rounded-lg p-6 shadow-sm w-full max-w-xl mx-auto">
      <h2 className="text-lg font-bold text-pink-700 mb-4">Promote User Account</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block mb-1 font-medium">Select User</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
            disabled={saving}
          >
            <option value="">-- Select a user --</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>{u.username} ({u.email})</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="block mb-1 font-medium">Options</label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox mr-2"
              checked={badgeChecked}
              onChange={e => setBadgeChecked(e.target.checked)}
              disabled={saving}
            />
            Badge Verification (Blue Check)
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox mr-2"
              checked={promoChecked}
              onChange={e => setPromoChecked(e.target.checked)}
              disabled={saving}
            />
            Paid Promo
          </label>
          {promoChecked && (
            <select
              className="w-full border rounded px-3 py-2 mt-2"
              value={promoDuration}
              onChange={e => setPromoDuration(e.target.value)}
              disabled={saving}
            >
              <option value="">-- Select promo duration --</option>
              <option value="1week">1 Week</option>
              <option value="2weeks">2 Weeks</option>
              <option value="3weeks">3 Weeks</option>
            </select>
          )}
        </div>
        <div className="md:col-span-1 flex flex-wrap items-center gap-2 mt-2">
          <button
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 disabled:opacity-60"
            onClick={handleSave}
            disabled={saving || !selectedUser || (!badgeChecked && !promoChecked) || (promoChecked && !promoDuration)}
          >
            Save Promotion
          </button>
          {(badgeChecked || promoChecked) && (
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel Promotion/Badge
            </button>
          )}
        </div>
        <div className="md:col-span-3 text-xs text-gray-500 mt-2">
          <strong>Note:</strong> Please confirm payment manually via CashApp before promoting a user.
        </div>
      </div>
    </div>
  );
}
