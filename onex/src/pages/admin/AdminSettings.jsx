import { useState } from 'react';
import {
  ShieldCheck,
  Ban,
  MessageSquare,
  Save
} from 'lucide-react';

export default function AdminSettings() {
  const [roleRestriction, setRoleRestriction] = useState('');
  const [suspendUserId, setSuspendUserId] = useState('');
  const [devMessage, setDevMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      roleRestriction,
      suspendUserId,
      devMessage
    };

    try {
      const res = await fetch('https://uninterested.onrender.com/admin/update-settings', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      const data = await res.json();
      alert('Settings updated successfully!');
      setRoleRestriction('');
      setSuspendUserId('');
      setDevMessage('');
    } catch (err) {
      console.error('Error updating settings:', err);
      alert('Failed to update settings.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-300 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl space-y-6 border border-white"
      >
        <h1 className="text-2xl font-bold text-pink-700 text-center mb-4">Admin Settings</h1>

        {/* Role Restriction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <ShieldCheck size={18} /> Restrict Role Access
          </label>
          <input
            type="text"
            placeholder="e.g. restrict 'user' from posting"
            value={roleRestriction}
            onChange={(e) => setRoleRestriction(e.target.value)}
            className="w-full border border-white rounded px-3 py-2"
            required
          />
        </div>

        {/* Suspend User */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Ban size={18} /> Suspend User Account
          </label>
          <input
            type="text"
            placeholder="Enter user ID to suspend"
            value={suspendUserId}
            onChange={(e) => setSuspendUserId(e.target.value)}
            className="w-full border border-white rounded px-3 py-2"
            required
          />
        </div>

        {/* Developer Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <MessageSquare size={18} /> Homepage Developer Message
          </label>
          <textarea
            placeholder="Update the message shown on homepage"
            value={devMessage}
            onChange={(e) => setDevMessage(e.target.value)}
            className="w-full border border-white rounded px-3 py-2"
            rows={4}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition flex items-center justify-center gap-2"
        >
          <Save size={18} /> Save Settings
        </button>
      </form>
    </div>
  );
}
