import { useAuthStore } from "@/context/AuthContext";
import React from "react";

interface UserMessageProps {
  text: string;
  timestamp: Date;
}

const UserMessage: React.FC<UserMessageProps> = ({ text, timestamp }) => {
  const { user } = useAuthStore();
  return (
    <div className="flex items-start gap-2 justify-end">
      <div className="max-w-[80%]">
        <div className="bg-[#3c3d37]/10 px-3 py-2 rounded-lg rounded-tr-none border border-[#3c3d37]/50">
          <p className="text-sm text-[#3c3d37]">{text}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1 mr-1 text-end">
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 bg-blue-600 text-white">
        {user?.name.charAt(0).toUpperCase()}
      </div>
    </div>
  );
};

export default UserMessage;
