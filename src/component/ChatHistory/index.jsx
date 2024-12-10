import React from "react";
import ReactMarkdown from "react-markdown";
import { AiOutlineRobot } from "react-icons/ai"; 
import { FaRobot } from "react-icons/fa";

const ChatHistory = ({ chatHistory }) => {
  return (
    <div className="space-y-4">
      {chatHistory.map((message, index) => (
        <div
          key={index}
          className={`flex items-start py-2 px-4 rounded-lg ${
            message.type === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.type === "bot" && (
            <div className="flex items-center mr-2">
              {/* Icon for bot */}
              <FaRobot className="text-blue-800 h-6 w-6" />
            </div>
          )}
          <div
            className={`p-3 rounded-lg ${
              message.type === "user"
                ? "bg-gray-100 text-gray-800 self-end"
                : "bg-blue-100 text-blue-800 self-start"
            }`}
            // style={{ width: `${inputWidth}px` }} // Dynamically set the width based on input field width
          >
            {/* Render the message using ReactMarkdown to handle any markdown */}
            <ReactMarkdown>{message.message}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
