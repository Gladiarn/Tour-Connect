import React from "react";

interface LoadingMessageProps {
  color?: string;
}

const LoadingMessage: React.FC<LoadingMessageProps> = ({ color = "#3C3D37" }) => {
  return (
    <div className="flex items-start gap-2">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
        style={{ backgroundColor: color, color: "white" }}
      >
        AI
      </div>
      <div className="max-w-[80%]">
        <div
          className="bg-white px-3 py-2 rounded-lg rounded-tl-none border"
          style={{ borderColor: color }}
        >
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;