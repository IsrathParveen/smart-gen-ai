import React, { useState, useEffect ,useRef} from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaPaperPlane,FaUserCircle } from 'react-icons/fa';
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
  const buttonTexts = [
    { mainText: "Cancel Job", subText: "Need Acc#, Job# and Tech Id" },
  { mainText: "Reassign Job", subText: "Need Acc#, Job#, Tech Id and New Tech Id" },
  { mainText: "Schedule Job", subText: "Need Acc#, Job#, Tech Id, Reschudle Date#" }
  ];
  
  // Function to handle the button click
  const handleButtonClick = (text) => {
      setUserInput(text);  // Set predefined text into the input
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
    <>
    <header className="w-full bg-[rgb(33,150,243)] text-white py-4 flex justify-between items-center px-4">
        {/* <img src="/path/to/logo.png" alt="Logo" className="h-12" />
      <h1 className="text-3xl font-bold text-center">GenAI</h1> */}
  <div>
    <span>SMART GenAI</span>
    {/* <img src="src/smartlogo.png" alt="Logo" className="h-6 w-6" /> */}
    </div>
         <FaUserCircle className="h-6 w-6 " />
      </header>
    <div className="container mx-auto px-4 py-8 flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <ChatHistory chatHistory={chatHistory} />
        {/* <Loading isLoading={isLoading} /> */}
      </div>
      {chatHistory.length === 0 && (
          <div className="button-container mt-4">
            {buttonTexts.map((button, index) => (
              <button
                key={index}
                className="button"
                onClick={() => handleButtonClick(button.mainText)} // Set main text to input on click
              >
                <div className="main-text font-bold text-left">{button.mainText}</div>
                <div className="sub-text text-left">{button.subText}</div>
              </button>
            ))}
          </div>
        )}
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
   <footer className="w-full text-center bg-[rgb(33,150,243)] text-white p-2">
        <p>Gen AI | <a href="mailto:contact@example.com" className="underline text-white hover:text-gray-200">
          Contact Us
        </a> </p>
    </footer>
    </>
  );
};

export default App;
