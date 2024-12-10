import React, { useState, useEffect ,useRef} from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaPaperPlane } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';
// Style components using Tailwind CSS
import "./App.css";
import ChatHistory from "./component/ChatHistory";
import Loading from "./component/Loading";

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);

  // inislize your Gemeni Api
  const genAI = new GoogleGenerativeAI(
    "AIzaSyAJ_YKXP2LaKVDGssE4uX3HLPI0wDu28vk"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  // const inputRef = useRef(null);
  // const [inputWidth, setInputWidth] = useState(0);
  
  // Update input width on resize
  // useEffect(() => {
  //   if (inputRef.current) {
  //     setInputWidth(inputRef.current.offsetWidth);
  //   }
  // }, [userInput]); // This will update on each change to userInput
  // Function to handle user input
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
    console.log(e.target.value);
  };

  // Function to send user message to Gemini
  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    // setIsLoading(true);
    try {
      // call Gemini Api to get a response
      const result = await model.generateContent(userInput);
      const response = await result.response;
      console.log(response);
      // add Gemeni's response to the chat history
      setChatHistory([
        ...chatHistory,
        { type: "user", message: userInput },
        { type: "bot", message: response.text() },
      ]);
    } catch {
      console.error("Error sending message");
    } finally {
      setUserInput("");
      // setIsLoading(false);
    }
  };

  // Function to clear the chat history
  const clearChat = () => {
    setChatHistory([]);
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col h-screen">
      <h1 className="text-3xl font-bold text-center mb-4">GenAI</h1>

      <div className="chat-container rounded-lg shadow-md p-4 flex-grow overflow-auto">
        <ChatHistory chatHistory={chatHistory} />
        {/* <Loading isLoading={isLoading} /> */}
      </div>
      <div className="mt-4">
        <div className="flex mt-4 relative">
          <input 
            type="text"
            className="w-full
             px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            placeholder="Type your message..."
            value={userInput}
            onChange={handleUserInput} onKeyDown={handleKeyDown}
          />
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 focus:outline-none"
            onClick={sendMessage}
           
          >
            <MdSend className="h-6 w-6" />
          </button>
        </div>
        <button
          className="mt-4 block px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 focus:outline-none"
          onClick={clearChat}
        >
          Clear Chat
        </button>
      </div>
   </div>
  );
};

export default App;
