import React, { useState, useEffect ,useRef} from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaPaperPlane,FaUserCircle } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';
// Style components using Tailwind CSS
import "./App.css";
import ChatHistory from "./component/ChatHistory";
import Popup from "./Popup"
import Loading from "./component/Loading";

 
const App = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
 
  // const [isLoading, setIsLoading] = useState(false);
 
  // inislize your Gemeni Api
  const genAI = new GoogleGenerativeAI(
    "AIzaSyAJ_YKXP2LaKVDGssE4uX3HLPI0wDu28vk"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  // Function to handle user input
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
    console.log(e.target.value);
  };
 
  // Function to send user message to Gemini
  const sendMessage = async () => {
    if (userInput.trim() === "") 
      return;
    // setIsLoading(true);
    try {
      // call Gemini Api to get a response
      const result = await model.generateContent(userInput);
      const response = await result.response;
      console.log(response);
      // const response = await fetch("http://10.81.78.212:8001/v1/user/search", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ query: userInput }),
      // });
 
      // const result = await response.text();
      // console.log(result);
      // add Gemeni's response to the chat history
      setChatHistory([
        ...chatHistory,
        { type: "user", message: userInput},
        // { type: "bot", message: result },
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
  // const handleKeyDown = (event) => {
  //   if (event.key === 'Enter') {
  //     sendMessage();
  //   }
  // };
  const handleKeyDown = (e) => {

    if (e.key === 'Enter' && !e.shiftKey) {

      e.preventDefault();

      const { selectionStart, selectionEnd } = e.target;

      const newValue = userInput.slice(0, selectionStart) + '\n' + userInput.slice(selectionEnd);

      setUserInput(newValue);

      setTimeout(() => {

        e.target.selectionStart = e.target.selectionEnd = selectionStart + 1;

      }, 0);

    }

  };
  const handleHyperlinkClick = (event) => {
    event.preventDefault();
    setIsPopupVisible(true);
  };
  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };
  
  return (
    <>
    <header className='w-full bg-[rgb(33,150,243)] text-white py-4 flex justify-between items-center px-4'>
      <div>
        <span>SMART GenAI</span>
        {/* <img src="src/smartlogo.png" alt="Logo" className="h-6 w-6" /> */}
      </div>
      <FaUserCircle className='h-6 w-6 ' />
    </header>
    <div className='container mx-auto px-4 py-8 flex flex-col h-screen'>
      <div className='flex-grow over-flow:auto'>
        <ChatHistory
          chatHistory={chatHistory}
          onHyperlinkClick={handleHyperlinkClick}
        />
        <Popup show={isPopupVisible} handleClose={handleClosePopup} />
        {/* <Loading isLoading={isLoading} /> */}
      </div>
      <div className='mt-4'>
        {chatHistory.length === 0 && (
          <div className='button-container'>
            {buttonTexts.map((button, index) => (
              <button
                key={index}
                className='button'
                onClick={() => handleButtonClick(button.mainText)} // Set main text to input on click
              >
                <div className='main-text font-bold text-left'>
                  {button.mainText}
                </div>
                <div className='sub-text text-left'>{button.subText}</div>
              </button>
            ))}
          </div>
        )}
        <div className='mt-4'>
          <div className='flex mt-4 relative'>
          {/* <textarea
  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 pr-10 hover:border-gray-100 hover:ring-gray-100 resize-none"
  placeholder="Type your message..."
  value={userInput}
  onChange={handleUserInput}
  onKeyDown={handleKeyDown}
  onInput={(e) => {
    e.target.style.height = 'auto';
    const maxHeight = 5 * parseFloat(getComputedStyle(e.target).lineHeight); // Calculate max height for 5 rows
    e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
  }}
  rows={1} 
/> */}
 <textarea
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:border-blue-500 pr-10 resize-none"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
          onKeyDown={handleKeyDown}
          onInput={(e) => {
            e.target.style.height = 'auto';
            const maxHeight = 5 * parseFloat(getComputedStyle(e.target).lineHeight); // Calculate max height for 5 rows
            e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
          }}
          style={{ maxHeight: '5em', overflowY: 'auto' }} // Set maximum height to 5 rows and enable vertical scrolling
          rows={1} // Start with a single row
        />
            {/* <input
              type='text'
              className='w-full
           px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 pr-10 hover:border-gray-100 hover:ring-gray-100'
              placeholder='Type your message...'
              value={userInput}
              onChange={handleUserInput}
              onKeyDown={handleKeyDown}
            /> */}
            {/* <button
              className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-400 focus:outline-none'
              onClick={sendMessage}
            >
              <MdSend className='h-6 w-6' />
            </button> */}
            <button
  className={`absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none ${userInput ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400 hover:text-gray-400'}`}
  onClick={sendMessage}
>
  <MdSend className='h-6 w-6' />
</button>
          </div>
          {/* <button
        className="mt-4 block px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 focus:outline-none"
        onClick={clearChat}
      >
        Clear Chat
      </button> */}
        </div>
      </div>
    </div>
    <footer className='w-full text-center bg-[rgb(33,150,243)] text-white p-2'>
      <p>
        Gen AI |{' '}
        <a
          href='mailto:contact@example.com'
          className='underline text-white hover:text-gray-200'
        >
          Contact Us
        </a>{' '}
      </p>
    </footer>
  </>
  );
};
 
export default App;
 