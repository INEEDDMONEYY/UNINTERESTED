import { useState } from "react";
import { ShieldCheck, Ban, MessageSquare, Save } from "lucide-react";

export default function AdminSettings() {
  const [roleRestriction, setRoleRestriction] = useState("");
  const [suspendUserId, setSuspendUserId] = useState("");
  const [devMessage, setDevMessage] = useState("");

  const updateSetting = async (field, value) => {
    try {
      const res = await fetch("https://uninterested.onrender.com/api/admin/settings", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update setting");
      const data = await res.json();
      alert(`${field} updated successfully!`);
      console.log("✅ Updated:", data);

      // Optional: persist the new message locally
      if (field === "devMessage") {
        localStorage.setItem("devMessage", value);
      }
    } catch (err) {
      console.error("❌ Error updating setting:", err);
      alert("Failed to update setting.");
    }
  };

  return (
    <div className="p-4 w-full max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-pink-700 mb-4">Admin Settings</h1>

      {/* Role Restriction */}
      <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <ShieldCheck size={18} /> Restrict Role Access
        </label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="e.g. restrict 'user' from posting"
            value={roleRestriction}
            onChange={(e) => setRoleRestriction(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          <button
            onClick={() => updateSetting("roleRestriction", roleRestriction)}
            className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      {/* Suspend User */}
      <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Ban size={18} /> Suspend User Account
        </label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Enter user ID to suspend"
            value={suspendUserId}
            onChange={(e) => setSuspendUserId(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          <button
            onClick={() => updateSetting("suspendUserId", suspendUserId)}
            className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      {/* Developer Message */}
      <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <MessageSquare size={18} /> Homepage Developer Message
        </label>
        <textarea
          placeholder="Update the message shown on homepage"
          value={devMessage}
          onChange={(e) => setDevMessage(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          rows={4}
        />
        <button
          onClick={() => updateSetting("devMessage", devMessage)}
          className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
        >
          <Save size={16} /> Save
        </button>
      </div>
    </div>
  );
}
