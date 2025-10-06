import { useState, useEffect } from "react";
import { MessageSquareText, Shield, RefreshCw, PlusCircle } from "lucide-react";
import MessageInput from "../../components/Messages/MessageInput";
import MessageList from "../../components/Messages/MessageList";
import ConversationList from "../../components/Messages/ConversationList";
import NewConversationModal from "../../components/Messages/NewConversationModal";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showNewConversation, setShowNewConversation] = useState(false);

  // 🧠 Fetch conversations for sidebar
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/conversations`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to load conversations");
        const data = await res.json();
        setConversations(data);
      } catch (err) {
        console.error("Error loading conversations:", err);
      }
    };
    fetchConversations();
  }, []);

  // 💬 Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/messages/${selectedConversation._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };
    fetchMessages();
  }, [selectedConversation]);

  // ✉️ Send message
  const handleSend = async (messageData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...messageData,
          conversationId: selectedConversation._id,
        }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      const newMsg = await res.json();
      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const handleRefresh = async () => {
    if (selectedConversation) {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/${selectedConversation._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      setMessages(data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-black via-gray-900 to-pink-700 text-white overflow-hidden">
      {/* 🧭 Sidebar */}
      <div className="md:w-1/3 lg:w-1/4 w-full md:flex-shrink-0 border-b md:border-b-0 md:border-r border-pink-500/20 bg-black/30 backdrop-blur-sm">
        <ConversationList
          conversations={conversations}
          selected={selectedConversation}
          onSelect={setSelectedConversation}
          onNewConversation={() => setShowNewConversation(true)}
        />
      </div>

      {/* 📨 Main Message Panel */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-4 border-b border-pink-500/40 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2 sm:mb-0">
            <Shield className="text-pink-400" size={22} />
            <h1 className="text-lg sm:text-xl font-semibold tracking-wide">
              Admin Messages
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 transition-colors text-xs sm:text-sm font-medium"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={() => setShowNewConversation(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-400 transition-colors text-xs sm:text-sm font-medium"
            >
              <PlusCircle size={16} />
              New Chat
            </button>
          </div>
        </div>

        {/* Message Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col mx-auto w-full max-w-5xl my-4 sm:my-6 px-2 sm:px-0">
            <div className="flex flex-col flex-1 bg-white/10 rounded-2xl backdrop-blur-sm overflow-hidden shadow-lg">
              <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-white/10 bg-black/20">
                <MessageSquareText className="text-pink-400" size={20} />
                <h2 className="text-base sm:text-lg font-medium">
                  Chat with{" "}
                  {
                    selectedConversation.participants?.filter(
                      (p) => p.role !== "admin"
                    )[0]?.username || "User"
                  }
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto">
                <MessageList
                  messages={messages}
                  currentRole="admin"
                  className="bg-transparent text-white"
                />
              </div>

              <div className="border-t border-white/10 bg-black/20">
                <MessageInput
                  onSend={handleSend}
                  senderRole="admin"
                  placeholder="Send a message..."
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-300 text-sm sm:text-base p-4">
            Select or start a conversation to begin messaging.
          </div>
        )}
      </div>

      {/* 🆕 Create Conversation Modal */}
      {showNewConversation && (
        <NewConversationModal
          onClose={() => setShowNewConversation(false)}
          onCreated={(newConv) => setConversations((prev) => [newConv, ...prev])}
        />
      )}
    </div>
  );
}
