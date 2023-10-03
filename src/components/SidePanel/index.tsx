import React, { useState } from 'react';
import Chat from './Chat';


const SidePanel: React.FC= () => {
  const [isChatOpen, setIsChatOpen] = useState(true);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className={`fixed top-0 right-0 h-full w-1/3 bg-white text-black shadow-lg flex flex-col justify-between transform ${isChatOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform ease-in-out duration-300`}>
    <div className="bg-gray-900 text-white py-2 px-4">
      {isChatOpen && (
        <button className="bg-gray-900 text-white py-1 px-2 m-2 rounded-md" onClick={toggleChat}>
          Close Chat
        </button>
      )}
    </div>
    <Chat />
    {!isChatOpen && (
      <div className="absolute top-0 right-full h-full bg-gray-900 flex items-center">
        <button className="bg-gray-900 text-white py-1 px-2 m-2 rounded-md" onClick={toggleChat}>
          Open Chat
        </button>
      </div>
    )}
  </div>
  );
};

export default SidePanel;
