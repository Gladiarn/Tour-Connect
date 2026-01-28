import React from 'react';

interface AiMessageProps {
  text: string;
  timestamp: Date;
}

const AiMessage: React.FC<AiMessageProps> = ({ text, timestamp }) => {
  return (
    <div className="flex items-start gap-2">
      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 bg-gray-700 text-white">
        AI
      </div>
      <div className="max-w-[80%]">
        <div className="bg-gray-100 px-3 py-2 rounded-lg rounded-tl-none border border-gray-300">
          <p className="text-sm text-[#3c3d37]">{text}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1 ml-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default AiMessage;