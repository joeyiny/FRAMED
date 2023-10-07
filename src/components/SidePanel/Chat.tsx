import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../messaging/SocketContext';

const Chat: React.FC<{gameId: string}> = ({gameId}) => {
  const socket = useSocket();
  const [messages, setMessages] = useState<Array<{ sender: string, content: string }>>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message: { sender: string; content: string }) => {
        console.log("Received Message: ", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Join the room corresponding to the game ID
      socket.emit('joinRoom', gameId);

      // Request initial message from the server
      socket.emit('requestInitialMessage', gameId);
    }

    return () => {
      if (socket) {
        socket.off('newMessage');
      }
    };
  }, [socket]);


  const handleSendMessage = () => {
    if (socket && currentMessage.trim() !== '') {
      console.log("Sending Message: ", currentMessage);
      setMessages(prevMessages => [...prevMessages, { sender: 'user', content: currentMessage }]);
      socket.emit('sendMessage', gameId, { sender: 'user', content: currentMessage });  // Sending object
      setCurrentMessage('');
      inputRef.current?.focus();
    }
};


  return (
    <div className="chat flex flex-col p-5 overflow-y-auto max-h-screen">
      <div className="messages flex-grow overflow-y-auto flex flex-col items-start space-y-2">
        {messages.map((message, index) => (
          <div key={index} className={`text-right ${message.sender === 'assistant' ? 'text-gray-500' : 'text-black'}`}>
            {message.content}
          </div>
        ))}

      </div>
      <div className="input-container flex-none flex items-center">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
          ref={inputRef}
          className="flex-grow mr-2 p-2 rounded border"
        />
        <button onClick={handleSendMessage} className="p-2 rounded bg-blue-500 text-white cursor-pointer">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
