import React, { useState, useEffect ,useRef} from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaPaperPlane,FaUserCircle } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';
// Style components using Tailwind CSS
import "./App.css";
import ChatHistory from "./component/ChatHistory";
import Popup from "./Popup"
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
  const showCommonComponent = () => {
    setIsModalVisible(true);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };


  // Function to send user message to Gemini
  const sendMessage = async (formData = null) => {
    console.log(formData,"in app.js")
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    // if (userInput.trim() === "")
    //   return;
    if(userInput!==""){
    setChatHistory([
      ...chatHistory,
      { type: "user", message: userInput, timestamp }
    ]);
  }
 
    // setIsLoading(true);
    setUserInput("");
    setIsBotTyping(true);
    try {
      // call Gemini Api to get a response
      // const result = await model.generateContent(userInput);
      // const response = await result.response;
      // console.log(response);
      const response = await fetch("http://10.81.78.212:8001/v1/user/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: formData ? formData : userInput  }),
        // body: JSON.stringify(formData ? formData : { query: userInput }),
        // console.log(formData ? formData : JSON.stringify({ query: userInput }))
        //  body:  JSON.stringify({ query: userInput })
      });
 
      // const result = await response.text();
      // console.log(result);
      const result = await response.json();
      console.log(result);

      // const isBorderResponse = result.toLowerCase().includes("please")
      // console.log(isBorderResponse)
      // let details = null;
      // if (isBorderResponse) {
      //   const jsonMatch = result.match(/{[^}]*}/);
      //   if (jsonMatch) {
      //     details = JSON.parse(jsonMatch[0]);
      //   }
      // }
      // const combinedMessage = `${result.message}\n\n${result.query_message}`;
      
      const botMessages = [
        { type: "bot", message: {Message:result.message,Query:result.query,QueryMessage:
          result.query_message
        }, timestamp },
        // { type: "bot", message: result.query_message,timestamp }
      ];

      setChatHistory(prevChatHistory => [
        ...prevChatHistory,
        ...botMessages
      ]);
      setShowTextarea(!result.query_message);
       // Check if the response contains the specific keys
    // const isBorderResponse = result.account_number && result.department &&
    // result.phone && result.pid && result.email && result["Are these details correct? (yes/no)"];
    
      // add Gemeni's response to the chat history
      // Add the bot's response to the chat history
      
    // setChatHistory(prevChatHistory => [
    //   ...prevChatHistory,
    //   { type: "bot", message: result, isBorder: isBorderResponse,details, timestamp },
    //   { type: "bot", message: response.text(),timestamp },
    // ]);
 
      // setChatHistory([
      //   ...chatHistory,
      //   { type: "user", message: userInput,timestamp},
      //   // { type: "bot", message: result,timestamp },
      //   { type: "bot", message: response.text(),timestamp },
      // ]);
    } catch(err) {
      console.error("Error sending message",err);
    } finally {
      setUserInput("");
      setIsBotTyping(false);
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
  const handleNewQuestionClick = () => {
    setShowTextarea(true);
    setIsModalVisible(false)
  };

  // const handleResponse = async (response) => {
  //   console.log(`Response received: ${response}`);
  //   // Make API call with the response value
  //   try {
  //     const apiResponse = await fetch("http://10.81.78.212:8001/v1/user/search", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ query: response }),
  //     });

  //     const result = await apiResponse.text();
  //     console.log(result);
  //     // Handle the API response as needed
  //     setChatHistory(prevChatHistory => [
  //       ...prevChatHistory,
  //       { type: "bot", message: result },
  //       // { type: "bot", message: response.text(),timestamp },
  //     ]);
  //   } catch (error) {
  //     console.error("Error sending response", error);
  //   }
  // };
  return (
    <>
    <div id='top-id' className='flex flex-col h-screen'>
      <header className='w-full bg-[rgb(33,150,243)] text-white py-4 flex justify-between items-center px-4'>
        <div>
          <span>SMART GenAI</span>
          {/* <img src="src/smartlogo.png" alt="Logo" className="h-6 w-6" /> */}
        </div>
        <FaUserCircle className='h-6 w-6 ' />
      </header>
      <div className='flex-grow overflow-auto'>
        <div className='m-5 p-3'>
          <ChatHistory
            chatHistory={chatHistory}
            onHyperlinkClick={handleHyperlinkClick} isBotTyping={isBotTyping} sendMessage={sendMessage}
             onResponse={sendMessage} 
          />
        </div>
          {/* <Popup show={isPopupVisible} handleClose={handleClosePopup}  handleSubmit={sendMessage}/> */}
          <Common show={isModalVisible} handleClose={handleCloseModal}  onNewQuestionClick={handleNewQuestionClick} />
          {/* <Loading isLoading={isLoading} /> */}
      </div>
      <div className='mt-4 m-5 p-3'>
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
          {showTextarea ? (
            <div className='flex mt-4 relative'>
              <button
              className="mr-2 bg-[rgb(33,150,243)] text-white hover:bg-blue-600 focus:outline-none flex items-center justify-center transition-all duration-300"
              onClick={clearChat} style={{ textDecoration: 'none', border: 'none', borderRadius: '50%', width: '2.7rem', height: '2.7rem' }}
              // onMouseEnter={(e) => {
              //   e.currentTarget.style.width = '6rem'; // Change width to make it oval
              //   e.currentTarget.style.borderRadius = '25px';
              //   // Change border radius to make it oval
              // }}
              // onMouseLeave={(e) => {
              //   e.currentTarget.style.width = '2.7rem'; // Revert width to original
              //   e.currentTarget.style.borderRadius = '50%'; // Revert border radius to original
              // }}
            ><BiMessageRoundedAdd className="h-6 w-6" />
            </button>
              <textarea
                className="w-full  py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:border-blue-500 resize-none"
                placeholder="Type your message..." value={userInput} onChange={handleUserInput} onKeyDown={handleKeyDown}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  const maxHeight = 5 * parseFloat(getComputedStyle(e.target).lineHeight); // Calculate max height for 5 rows
                  if (e.target.value === '') {
                    e.target.style.height = 'auto'; // Reset height when content is removed
                  } else {
                    e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
                  }
                  if (e.target.scrollHeight > maxHeight) {
                    e.target.style.overflowY = 'auto'; // Enable vertical scrolling
                  } else {
                    e.target.style.overflowY = 'hidden'; // Disable vertical scrolling
                  }
                }}
                style={{ maxHeight: '5em', overflowY: 'auto', paddingRight: '3.5rem',paddingLeft:'1.0rem' }} // Set maximum height to 5 rows and enable vertical scrolling
                rows={1} // Start with a single row
              />
              <button
                className={`absolute top-1/2 transform -translate-y-1/2 focus:outline-none ${userInput ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400 hover:text-gray-400'}`}
                onClick={()=>{let formdata=userInput; sendMessage(formdata)}} style={{right: '1.5rem'}}
              >
                <MdSend className='h-6 w-6' />
              </button>
            </div>
          ):(
          
            <div className='flex mt-4 relative'>
            <RiMessengerLine className='h-6 w-6  text-blue-500'   />
            <button
                className="ml-0 px-2 text-blue bg-transparent focus:outline-none"
                onClick={showCommonComponent}
                style={{ textDecoration: 'none', border: 'none', color: 'rgb(33,150,243)' }}
              >New Question</button>
            </div>
          )}
         
            {/* <button
          className="mt-4 block px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 focus:outline-none"
          onClick={clearChat}
        >
          Clear Chat
        </button> */}
          </div>
      </div>
 
      <footer className='w-full text-center bg-[rgb(33,150,243)] text-white  flex justify-center items-center' >
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
    </div>
  </>
  );
};
 
export default App;
 
 