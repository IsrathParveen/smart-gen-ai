import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaPaperPlane, FaUserCircle } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';
import "./App.css";
import ChatHistory from "./component/ChatHistory";
import Popup from "./Popup";
import Loading from "./component/Loading";
import { RiMessengerLine } from "react-icons/ri";
import Common from "./component/Common/common";
import { BiMessageRoundedAdd } from "react-icons/bi";

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showTextarea, setShowTextarea] = useState(true);
  const [showButtonContainer, setShowButtonContainer] = useState(false);
  const [showTaskButtonContainer, setShowTaskButtonContainer] = useState(false);
  const [counter, setCounter] = useState(0);
  const [initialMessageDisplayed, setInitialMessageDisplayed] = useState(false);

  const buttonContainerTexts = [
    { mainText: 'Great,Thanks!' },
    { mainText: 'Okay' },
    { mainText: 'Ok,Thank You!' },
  ];
  useEffect(() => {
    // Add initial chatbot message
    const initialMessage = {
      type: "bot",
      message: "Hello! How can I help you today? Choose from a topic below or type a specific question.",
      // timestamp: new Date().toLocaleString('en-US', {
      //   month: 'long',
      //   day: 'numeric',
      //   hour: 'numeric',
      //   minute: 'numeric',
      //   hour12: true
      // })
    };
    setChatHistory([initialMessage]);
    setInitialMessageDisplayed(true);
  }, []);

  const genAI = new GoogleGenerativeAI(
    "AIzaSyAJ_YKXP2LaKVDGssE4uX3HLPI0wDu28vk"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
    console.log(e.target.value);
  };

  const showCommonComponent = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const sendMessage = async (formData = null) => {
    setShowButtonContainer(false);
    console.log(formData, "in app.js");
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    if (userInput !== "") {
      setChatHistory([
        ...chatHistory,
        { type: "user", message: userInput, timestamp }
      ]);
    }

    setUserInput("");
    setIsBotTyping(true);
    const body = {
      query: formData ? formData : userInput,
    };

    if (counter === 1) {
      body.counter = 1;
    }

    
    try {
      // const response = await fetch("http://10.81.78.212:8001/v1/user/search", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ query: formData ? formData : userInput }),
      // });
      const response = await fetch("http://10.81.78.212:8001/v1/user/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      console.log(result);
      setCounter(0);

      const botMessages = [
        {
          type: "bot",
          message: {
            Message: result.message,
            Query: result.query,
            QueryMessage: result.query_message
          },
          timestamp
        }
      ];

      if (result.message.toLowerCase().includes("validated successfully")) {
        setShowButtonContainer(true);
        setShowTextarea(true);
      } else {
        setShowButtonContainer(false);
        setShowTextarea(false);
      }

      
      if (result.message.toLowerCase().includes("created successfully")) {
        setShowTaskButtonContainer(true);
        setShowTextarea(true);
      } else {
        setShowTaskButtonContainer(false);
        setShowTextarea(false);
      }
      setChatHistory(prevChatHistory => [
        ...prevChatHistory,
        ...botMessages
      ]);

      // Show or hide the textarea based on the bot's response
     if(result.query_message.length>0 || result.message.toLowerCase().includes("are these details correct?"))
      setShowTextarea(false);
    else
      setShowTextarea(true);
     
    } catch (err) {
      console.error("Error sending message", err);
    } finally {
      setUserInput("");
      setIsBotTyping(false);
    }
  };

  const buttonTexts = [
    { mainText: "Create New Job", subText: "Create a new job and assign it to a technician" },
    { mainText: "Priority Job Create", subText: "Create a priority job and assign it to a technician" },
    { mainText: "Priority Job Reassign", subText: "Reassign a priority job to a new technician" },
    
  ];

  const handleButtonClick = (text) => {
    setUserInput(text);
  };

  const clearChat = () => {
    setChatHistory([]);
    setCounter(1);
    setShowTaskButtonContainer(true)
  };

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

  const handleNewQuestionClick = () => {
    setShowTextarea(true);
    setShowTaskButtonContainer(true);
    setShowButtonContainer(false);
    setIsModalVisible(false);
    setCounter(prevCounter => (prevCounter === 0 ? 1 : 0));
  };

  const handleButtonContainer = (mainText) => {
    sendMessage(mainText);
    setShowButtonContainer(false);
  };

  return (
    <>
      <div id='top-id' className='flex flex-col h-screen'>
        <header className='w-full bg-[rgb(33,150,243)] text-white py-4 flex justify-between items-center px-4' style={{height:'3.5rem'}}>
          <div>
            <span>SMART GenAI</span>
          </div>
          <FaUserCircle className='h-6 w-6 ' />
        </header>
        <div className='flex-grow overflow-auto'>
          <div className='m-5 p-3'>
            <ChatHistory
              chatHistory={chatHistory}
              onHyperlinkClick={handleHyperlinkClick}
              isBotTyping={isBotTyping}
              sendMessage={sendMessage}
              onResponse={sendMessage}
            />
          </div>
          <Common show={isModalVisible} handleClose={handleCloseModal} onNewQuestionClick={handleNewQuestionClick} setCounter={setCounter}/>
        </div>
        <div className='mt-4 m-5 p-3'>
          {showButtonContainer && (
             <div className='button-container right-aligned'>
              {buttonContainerTexts.map((button, index) => (
                <button
                  key={index}
                  className='button'
                  onClick={() => handleButtonContainer(button.mainText)}
                >
                  <div className='main-text font-bold text-left'>
                    {button.mainText}
                  </div>
                </button>
              ))}
            </div>
          )}
            {(showTaskButtonContainer  || (chatHistory.length === 1 && initialMessageDisplayed)) && (
            <div className='button-container'>
              {buttonTexts.map((button, index) => (
                <button
                  key={index}
                  className='button'
                  onClick={() => handleButtonClick(button.mainText)}
                >
                  <div className='main-text font-bold text-left '>
                    {button.mainText}
                  </div>
                  <div className='sub-text text-left text-gray-600'>{button.subText}</div>
                </button>
              ))}
            </div>
          )}
          <div className='mt-4'>
            {showTextarea ? (
              <div className='flex mt-4 relative'>
                <button
                  className="mr-2 bg-[rgb(33,150,243)] text-white hover:bg-blue-600 focus:outline-none flex items-center justify-center transition-all duration-300"
                  onClick={clearChat}
                  style={{ textDecoration: 'none', border: 'none', borderRadius: '50%', width: '2.7rem', height: '2.7rem' }}
                >
                  <BiMessageRoundedAdd className="h-6 w-6" />
                </button>
                <textarea
                  className="w-full py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:border-blue-500 resize-none"
                  placeholder="Type your message..." value={userInput} onChange={handleUserInput} onKeyDown={handleKeyDown}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    const maxHeight = 5 * parseFloat(getComputedStyle(e.target).lineHeight);
                    if (e.target.value === '') {
                      e.target.style.height = 'auto';
                    } else {
                      e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
                    }
                    if (e.target.scrollHeight > maxHeight) {
                      e.target.style.overflowY = 'auto';
                    } else {
                      e.target.style.overflowY = 'hidden';
                    }
                  }}
                  style={{ maxHeight: '5em', overflowY: 'auto', paddingRight: '3.5rem', paddingLeft: '1.0rem' }}
                  rows={1}
                />
                <button
                  className={`absolute top-1/2 transform -translate-y-1/2 focus:outline-none ${userInput ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400 hover:text-gray-400'}`}
                  onClick={() => { let formdata = userInput; sendMessage(formdata) }} style={{ right: '1.5rem' }}
                >
                  <MdSend className='h-6 w-6' />
                </button>
              </div>
            ) : (
              <div className='flex mt-4 relative'>
                <RiMessengerLine className='h-6 w-6 text-blue-500' />
                <button
                  className="ml-0 px-2 text-blue bg-transparent focus:outline-none"
                  onClick={showCommonComponent}
                  style={{ textDecoration: 'none', border: 'none', color: 'rgb(33,150,243)' }}
                >New Question</button>
              </div>
            )}
          </div>
        </div>
        <footer className='w-full text-center bg-[rgb(33,150,243)] text-white flex justify-center items-center  custom-footer'>
          <p style={{paddingTop:'1rem'}}>
            Gen AI |{' '}
            <a
              href='mailto:contact@example.com'
              className='underline text-white hover:text-gray-200'
            >
              Contact Us
            </a>{' '}
          </p>
        </footer>
      </div>
    </>
  );
};

export default App;