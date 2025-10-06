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
    <div className="min-h-screen flex bg-gradient-to-br from-black via-gray-900 to-pink-700 text-white">
      {/* 🧭 Sidebar */}
      <ConversationList
        conversations={conversations}
        selected={selectedConversation}
        onSelect={setSelectedConversation}
        onNewConversation={() => setShowNewConversation(true)}
      />

      {/* 📨 Main Message Panel */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-pink-500/40 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Shield className="text-pink-400" size={22} />
            <h1 className="text-xl font-semibold tracking-wide">Admin Messages</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 transition-colors text-sm font-medium"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={() => setShowNewConversation(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-400 transition-colors text-sm font-medium"
            >
              <PlusCircle size={16} />
              New Chat
            </button>
          </div>
        </div>

        {/* Message Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto my-6 bg-white/10 rounded-2xl backdrop-blur-sm overflow-hidden shadow-lg">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-black/20">
              <MessageSquareText className="text-pink-400" size={20} />
              <h2 className="text-lg font-medium">
                Chat with{" "}
                {
                  selectedConversation.participants
                    ?.filter((p) => p.role !== "admin")[0]?.username || "User"
                }
              </h2>
            </div>

            <MessageList
              messages={messages}
              currentRole="admin"
              className="bg-transparent text-white"
            />

            <MessageInput
              onSend={handleSend}
              senderRole="admin"
              placeholder="Send a message..."
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-300">
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
