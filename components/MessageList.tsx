"use client";
import React, { useEffect, useRef } from "react";
import type { Candidate } from "@/lib/types";
import { MessageBubble } from "./MessageBubble";
import { FaRobot } from "react-icons/fa";
import type { MessagesListProps } from "@/types";

export function MessagesList({
  messages,
  onCandidateSelect,
}: MessagesListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-4 flex-1 overflow-y-auto mb-20 p-4">
      {messages.map((msg, idx) => {
        if (msg.role === "assistant" && "tableData" in msg) {
          const data = msg.tableData as Candidate[];
          if (data.length > 0) {
            return (
              <div key={idx} className="flex items-start">
                <FaRobot
                  size={24}
                  className="text-gray-500 mr-2 mt-1 flex-shrink-0"
                />
                <div className="overflow-x-auto p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Location
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Experience
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Skills
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {data.map((c, j) => (
                        <tr
                          onClick={() => onCandidateSelect(c)}
                          key={j}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {c.full_name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {c.location}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {c.years_experience}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {c.skills.join(", ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          } else {
            return (
              <div key={idx}>
                <MessageBubble
                  message={{ ...msg, content: "No matching records found." }}
                />
              </div>
            );
          }
        }

        if (msg.content) {
          return <MessageBubble key={idx} message={msg} />;
        }

        return null;
      })}
      <div ref={endRef} />
    </div>
  );
}
