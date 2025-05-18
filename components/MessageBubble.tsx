import React from "react";
import type { ChatMessage } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import { FaUserCircle, FaRobot } from "react-icons/fa";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  const hasContent = message.content && message.content.trim() !== "";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      {!isUser && (
        <div className="flex flex-col items-center mr-2">
          <FaRobot className="text-gray-500" size={30} />
        </div>
      )}
      {hasContent && (
        <div
          className={`${
            isUser
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-800 text-white border border-gray-800"
          } p-3 rounded-lg max-w-[70%]`}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      )}
      {isUser && (
        <div className="flex flex-col items-center ml-2">
          <FaUserCircle className="text-blue-500" size={30} />
          <span className="text-blue-500 text-xs mt-1">You</span>
        </div>
      )}
    </div>
  );
}
