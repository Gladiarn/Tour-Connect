import React, { useState, useRef, useEffect } from "react";
import AiMessage from "./AiMessage";
import UserMessage from "./UserMessage";
import LoadingMessage from "./LoadingMessage";

interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const HybridChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Hello! How can I help with your travel plans today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const reqOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      };

      const response = await fetch(
        "http://localhost:5000/api/ai/chat",
        reqOptions,
      );

      if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const aiResponse: ChatMessage = {
          id: messages.length + 2,
          text: data.response,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false)
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const PRIMARY_COLOR = "#3C3D37";

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isOpen ? "rotate-90" : "hover:scale-105"
        }`}
        style={{
          backgroundColor: PRIMARY_COLOR,
          color: "white",
        }}
        aria-label="Open chat"
      >
        {isOpen ? (
          <span className="text-xl">✕</span>
        ) : (
          <span className="text-2xl">💬</span>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white rounded-xl shadow-xl flex flex-col animate-slide-up">
          <div
            className="p-4 border-b flex-shrink-0 rounded-t-md"
            style={{ backgroundColor: PRIMARY_COLOR, color: "white" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-lg">✈️</span>
              </div>
              <div>
                <h3 className="font-medium">Travel Assistant</h3>
                <p className="text-xs opacity-80">Online • Ready to help</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.sender === "ai" ? (
                    <AiMessage text={msg.text} timestamp={msg.timestamp} />
                  ) : (
                    <UserMessage text={msg.text} timestamp={msg.timestamp} />
                  )}
                </div>
              ))}

              {/*LOADING ANIMATION */}
              {isLoading && <LoadingMessage />}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 border-t flex-shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 text-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-offset-1"
                style={{
                  borderColor: PRIMARY_COLOR,
                  color: PRIMARY_COLOR,
                }}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: PRIMARY_COLOR,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#55564F")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = PRIMARY_COLOR)
                }
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.2s ease-out;
        }

        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
      `}</style>
    </>
  );
};

export default HybridChatbot;
