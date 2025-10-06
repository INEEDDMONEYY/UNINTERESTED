import { MessageSquare, Users, PlusCircle } from "lucide-react";

export default function ConversationList({
  conversations = [],
  selected,
  onSelect,
  onNewConversation,
}) {
  return (
    <aside className="w-72 bg-black/30 backdrop-blur-lg border-r border-pink-600/30 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Users className="text-pink-400" size={20} />
          <h2 className="text-lg font-semibold text-white">Conversations</h2>
        </div>
        <button
          onClick={onNewConversation}
          className="text-pink-400 hover:text-pink-300 transition"
          title="Start a new conversation"
        >
          <PlusCircle size={20} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.map((conv) => {
            const other =
              conv.participants?.find((p) => p.role !== "admin") || {};
            const isActive = selected?._id === conv._id;

            return (
              <button
                key={conv._id}
                onClick={() => onSelect(conv)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-pink-700/40 transition ${
                  isActive ? "bg-pink-700/50" : ""
                }`}
              >
                <MessageSquare className="text-pink-400" size={18} />
                <div className="flex-1">
                  <p className="font-medium text-white text-sm truncate">
                    {other.username || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {conv.lastMessage?.text || "No messages yet"}
                  </p>
                </div>
              </button>
            );
          })
        ) : (
          <p className="text-gray-400 text-center mt-10 text-sm">
            No conversations yet.
          </p>
        )}
      </div>
    </aside>
  );
}
