import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { useScreenSize } from "../hooks/useScreenSize";

interface Message {
  id: string;
  text: string;
  sender: "me" | "stranger";
  timestamp: string;
}

interface ChatScreenProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onEndChat: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  messages,
  onSendMessage,
  onEndChat,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { viewportHeight } = useScreenSize();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="flex flex-col bg-gray-50"
      style={{ height: viewportHeight }}
    >
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-800 text-sm sm:text-base">
                StrangeChat
              </h1>
              <p className="text-xs text-green-500 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Connected to stranger
              </p>
            </div>
          </div>
          <button
            onClick={onEndChat}
            className="bg-red-500 text-white px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm font-medium hover:bg-red-600 transition-colors duration-200 flex items-center space-x-1"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">End Chat</span>
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 max-w-4xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">
              Start the conversation! Say hello 👋
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[280px] sm:max-w-xs lg:max-w-md px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-sm ${
                message.sender === "me"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              <p className="text-sm sm:text-base leading-relaxed break-words">
                {message.text}
              </p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === "me" ? "text-blue-100" : "text-gray-400"
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-3 sm:p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-2 sm:space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-full px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              maxLength={500}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 sm:p-3 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 flex-shrink-0"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center px-2">
            This is an StrangeChat. Be respectful and enjoy the conversation!
          </p>
        </div>
      </div>
    </div>
  );
};
