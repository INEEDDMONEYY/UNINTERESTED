import { useState } from "react";
import { MessageSquare, Save } from "lucide-react";
import { useDevMessage } from "../../../context/DevMessageContext";

export default function DeveloperMessageSetting() {
  const { devMessage, updateDevMessage } = useDevMessage();
  const [message, setMessage] = useState(devMessage || "");
  const [saving, setSaving] = useState(false);

  const saveMessage = async () => {
    if (!message.trim()) return alert("Message cannot be empty");
    setSaving(true);
    const success = await updateDevMessage(message.trim());
    setSaving(false);
    if (success) alert("Message updated");
    else alert("Failed to update message");
  };

  return (
    <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
      <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
        <MessageSquare size={18} /> Homepage Developer Message
      </label>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
      />

      <button
        onClick={saveMessage}
        disabled={saving}
        className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition disabled:opacity-50"
      >
        <Save size={16} /> {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}