import React, { useEffect, useRef,useState } from "react";
import ReactMarkdown from "react-markdown";
import { FaRobot } from "react-icons/fa";
import "./chatHistory.css"; // Import the CSS file for animations
import Popup from '../../Popup'; // Import your Popup component
import { TiThumbsUp } from "react-icons/ti";
import { TiThumbsDown } from "react-icons/ti";

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
                <div className="p-2 mb-1 mt-1" style={{ border: message.message.Message.includes('\n') ? '1px solid black' : 'none' }}>
                   {/* {message.message.Message.includes('\n') ? (
                    message.message.Message.split('\n').map((line, i) => (
                      <p key={i}><strong>{line}</strong></p>
                    )) */}
                  {message.message.Message.includes('\n') ? (
                  message.message.Message.split('\n').map((line, i) => {
                    const [key, ...value] = line.split(':');
                    return (
                      <p key={i}>
                        <strong> <span>{key}:</span> </strong>
                       {value.join(':')}
                      </p>
                    );
                  })
                  ) : (
                    <p>{message.message.Message}</p>
                  )}
                  {message.message.QueryMessage.length===0 && message.message.Message.toLowerCase().includes("are these details correct?")?(
                      <div>
                        <button
                            className="ml-2 px-2 py-1 border border-blue-500 bg-white text-blue-500 rounded hover:bg-blue-100 focus:outline-none  "
                            onClick={() => onResponse('Yes')}
                          ><div className="flex items-center">
                          <TiThumbsUp className="h-6 w-6 mr-1" />
                          Yes
                        </div>
                          </button>
                          <button
                            className="ml-2 px-2 py-1 border border-gray-500 bg-white text-gray-500 rounded hover:bg-gray-100 focus:outline-none"
                            onClick={() => onResponse('No')}
                          ><div className="flex items-center">
                          <TiThumbsDown className="h-6 w-6 mr-1" />
                          No
                        </div>
                          </button>
                        </div>
                    ):(message.message.QueryMessage.length===0 && message.message.Message?(
                      <ReactMarkdown>{message.message.message}</ReactMarkdown>
                    ):( <button
                      className="mt-1 px-4 py-2 w-full bg-white text-blue-500 rounded hover:bg-gray-600 focus:outline-none border border-blue-500 inline-block"
                      onClick={() => handleButtonClick(message.message.Query)}
                    >
                      {message.message.QueryMessage}
                    </button>)
                  )}     
                </div>
              ) : (
                <ReactMarkdown>{message.message}</ReactMarkdown>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-2">{message.timestamp}</div> {/* Display timestamp below the message */}
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
 