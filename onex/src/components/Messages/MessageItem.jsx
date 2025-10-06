import React from "react";

/**
 * Reusable message item for both admin and user dashboards.
 *
 * Props:
 * - message: { sender: "admin" | "user", text: string, timestamp?: string, avatarUrl?: string }
 * - currentRole: "admin" | "user" (used to determine alignment)
 */
export default function MessageItem({ message, currentRole = "user" }) {
  const isOwnMessage = message.sender === currentRole;

  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className={`flex items-end mb-3 ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar for other side */}
      {!isOwnMessage && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold mr-2">
          {message.avatarUrl ? (
            <img
              src={message.avatarUrl}
              alt={`${message.sender} avatar`}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            message.sender.charAt(0).toUpperCase()
          )}
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`max-w-xs sm:max-w-md px-3 py-2 rounded-2xl shadow-sm ${
          isOwnMessage
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
      >
        <p className="text-sm break-words">{message.text}</p>
        {formattedTime && (
          <span className="block text-[10px] mt-1 opacity-70 text-right">
            {formattedTime}
          </span>
        )}
      </div>

      {/* Avatar for own messages */}
      {isOwnMessage && (
        <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-sm font-semibold ml-2">
          {message.avatarUrl ? (
            <img
              src={message.avatarUrl}
              alt={`${message.sender} avatar`}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            message.sender.charAt(0).toUpperCase()
          )}
        </div>
      )}
    </div>
  );
}
