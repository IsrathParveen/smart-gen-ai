import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { FaRobot } from "react-icons/fa";
import "./chatHistory.css"; // Import the CSS file for animations

const ChatHistory = ({ chatHistory, onHyperlinkClick, isBotTyping }) => {
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isBotTyping]);

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
            style={{ maxWidth: '75%', wordWrap: 'break-word', wordBreak: 'break-word' }}
          >
            {/* Render the message using ReactMarkdown to handle any markdown */}
            <div key={index} className="custom-line-height">
            {message.type === "bot" && message.isBorder ? (
                <div className="bg-white border border-black p-4 mb-4 mt-2">
                   <p><strong>Please confirm the details below:</strong></p>
                  {Object.entries(message.details).map(([key, value]) => (
                    <p key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {value}</p>
                  ))}
                </div>
              ) : (
                <ReactMarkdown>{message.message}</ReactMarkdown>
              )}

            </div>
            <div className="text-xs text-gray-500 mt-1">{message.timestamp}</div> {/* Display timestamp below the message */}
          </div>
        </div>
      ))}
      {isBotTyping && (
        <div className="flex items-start py-1 rounded-lg justify-start">
          <div className="flex items-center mr-2">
            <FaRobot className="text-blue-800 h-6 w-6" />
          </div>
          <div className="py-1 px-2 rounded-lg bg-gray-100 text-gray-800 self-start" style={{ maxWidth: '75%' }}>
            <div className="typing-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatHistory;