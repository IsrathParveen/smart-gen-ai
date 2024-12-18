import React from "react";
import ReactMarkdown from "react-markdown";
import { AiOutlineRobot } from "react-icons/ai";
import { FaRobot } from "react-icons/fa";

const ChatHistory = ({ chatHistory, onHyperlinkClick }) => {
  return (
    <div className="space-y-2"> {/* Reduce the vertical spacing */}
      {chatHistory.map((message, index) => (
        <div
          key={index}
          className={`flex items-start py-1 rounded-lg ${message.type === "user" ? "justify-end" : "justify-start"}`} // Adjust padding
        >
          {message.type === "bot" && (
            <div className="flex items-center mr-2">
              {/* Icon for bot */}
              <FaRobot className="text-blue-800 h-6 w-6" />
            </div>
          )}
          <div
            className={`py-1 px-2 rounded-lg ${message.type === "user" ? "bg-blue-100 text-blue-800 self-end" : "bg-gray-100 text-gray-800 self-start"}`} // Adjust padding
          >
            {/* Render the message using ReactMarkdown to handle any markdown */}
            <div key={index}>
              {message.type === 'bot' ? (
                <div>
                  <ReactMarkdown>{message.message}</ReactMarkdown>
                  {/* <a href="#" onClick={onHyperlinkClick}>Click here</a> */}
                </div>
              ) : (
                <ReactMarkdown>{message.message}</ReactMarkdown>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;