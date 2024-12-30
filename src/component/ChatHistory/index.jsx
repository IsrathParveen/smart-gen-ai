import React, { useEffect, useRef,useState } from "react";
import ReactMarkdown from "react-markdown";
import { FaRobot } from "react-icons/fa";
import "./chatHistory.css"; // Import the CSS file for animations
import Popup from '../../Popup'; // Import your Popup component
const ChatHistory = ({ chatHistory, onHyperlinkClick, isBotTyping, onResponse,sendMessage }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
   const [query, setQuery] = useState([]);
 
  const handleClose = () => {
    setIsPopupOpen(false);
  };
 
  const handleButtonClick = (query) => {
   
       console.log(query)
       setQuery(query);
       setIsPopupOpen(true);
     };
  const handleSubmit = (formData) => {
    console.log(formData,"popup string in chat component")
    sendMessage(formData);
  };
  console.log(chatHistory)
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
              {message.type === "bot" && message.message.Message ? (
                <div className="p-4 mb-4 mt-2">
                  <p><strong>{message.message.Message}</strong></p>
                  {message.message.QueryMessage && message.message.Message.includes("Are these details correct?") ? (
                  <div>
                    {/* <button
                      className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                      onClick={() => handleButtonClick({ query: "yes" })}
                    >
                      Yes
                    </button>
                    <button
                      className="mt-2 ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                      onClick={() => handleButtonClick({query: "no" })}
                    >
                      No
                    </button> */}
                    <button
                            className="ml-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                            onClick={() => onResponse('Yes')}
                          >
                            Yes
                          </button>
                          <button
                            className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                            onClick={() => onResponse('No')}
                          >
                            No
                          </button>
                  </div>
                ) :(
                    <button
                    className="mt-2 px-4 py-2 w-full bg-white text-blue-500 rounded hover:bg-gray-600 focus:outline-none border border-blue-500"
                    onClick={() => handleButtonClick(message.message.Query)}
                  >
                    {message.message.QueryMessage}
                  </button>
                  )}
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
      <Popup show={isPopupOpen} handleClose={handleClose} query={query} onSubmit={handleSubmit}/>
    </div>
  );
};
 
export default ChatHistory;
 