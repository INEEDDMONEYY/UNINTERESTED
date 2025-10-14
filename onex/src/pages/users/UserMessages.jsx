import { useEffect, useState } from "react";
import { MessageSquareText, Plus, RefreshCw, Menu } from "lucide-react";
import MessageInput from "../../components/Messages/MessageInput";
import MessageList from "../../components/Messages/MessageList";
import ConversationList from "../../components/Messages/ConversationList";
import NewConversationModal from "../../components/Messages/NewConversationModal";

export default function UserMessages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch mock conversations
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setConversations([
        {
          id: "1",
          name: "Admin Support",
          lastMessage: "How can I assist you today?",
          timestamp: Date.now() - 30000,
        },
        {
          id: "2",
          name: "Moderator",
          lastMessage: "Please review your recent report.",
          timestamp: Date.now() - 120000,
        },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const fetchMessages = (conversationId) => {
    setLoading(true);
    setSelectedConversation(conversations.find((c) => c.id === conversationId));

    setTimeout(() => {
      setMessages([
        {
          sender: "user",
          text: "Hello Admin, I have a question about my account.",
          timestamp: Date.now() - 60000,
        },
        {
          sender: "admin",
          text: "Of course! What can I help you with?",
          timestamp: Date.now() - 30000,
        },
      ]);
      setLoading(false);
      setSidebarOpen(false); // auto-close sidebar on mobile
    }, 400);
  };

  const handleSend = (messageData) => {
    setMessages((prev) => [...prev, messageData]);
  };

  const handleRefresh = () => {
    if (selectedConversation) fetchMessages(selectedConversation.id);
  };

  return (
    <div className="relative min-h-screen flex bg-gradient-to-br from-black via-gray-900 to-pink-700 text-white">
      {/* Sidebar (Conversations) */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:static top-0 left-0 h-full w-72 bg-black/30 border-r border-pink-500/40 flex flex-col z-30 transform transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-pink-500/40 bg-black/40">
          <h2 className="text-lg font-semibold tracking-wide">Messages</h2>
          <button
            onClick={() => setShowNewModal(true)}
            className="p-1.5 bg-pink-600 rounded-lg hover:bg-pink-500 transition"
            title="Start New Conversation"
          >
            <Plus size={18} />
          </button>
        </div>

        <ConversationList
          conversations={conversations}
          selectedId={selectedConversation?.id}
          onSelect={(id) => fetchMessages(id)}
          loading={loading}
        />
      </aside>

      {/* Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col md:ml-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-pink-500/40 bg-black/40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-1 rounded hover:bg-pink-600/30 transition"
            >
              <Menu size={22} className="text-pink-400" />
            </button>
            <MessageSquareText className="text-pink-400" size={20} />
            <h1 className="text-lg font-semibold truncate max-w-[150px] sm:max-w-none">
              {selectedConversation ? selectedConversation.name : "Messages"}
            </h1>
          </div>

          {selectedConversation && (
            <button
              onClick={handleRefresh}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-sm font-medium"
            >
              <RefreshCw size={16} /> Refresh
            </button>
          )}
        </div>

        {/* Messages Section */}
        <div className="flex-1 overflow-y-auto bg-white/10 backdrop-blur-sm">
          {selectedConversation ? (
            <MessageList
              messages={messages}
              currentRole="user"
              className="bg-transparent text-white"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300 text-center p-6">
              <p>Select a conversation or start a new one to begin chatting.</p>
            </div>
          )}
        </div>

        {/* Message Input */}
        {selectedConversation && (
          <div className="border-t border-pink-500/30 bg-black/30">
            <MessageInput
              onSend={handleSend}
              senderRole="user"
              placeholder={`Message ${selectedConversation.name}...`}
            />
          </div>
        )}
      </main>

      {/* New Conversation Modal */}
      {showNewModal && (
        <NewConversationModal
          onClose={() => setShowNewModal(false)}
          onCreate={(newConversation) => {
            setConversations((prev) => [newConversation, ...prev]);
            setShowNewModal(false);
            fetchMessages(newConversation.id);
          }}
          users={[
            { id: "admin1", name: "Admin" },
            { id: "moderator1", name: "Moderator" },
          ]}
        />
      )}
    </div>
  );
}
