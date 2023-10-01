import React, { useState, useEffect, useContext } from 'react';
import { useSocket } from '../../messaging/SocketContext';

const Chat: React.FC = () => {
  const socket = useSocket();
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>(''); // Track the current message being typed

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message: string) => {
        // When a new message is received, add it to the beginning of the messages array
        setMessages((prevMessages) => [message, ...prevMessages]);
      });
    }

    return () => {
      if (socket) {
        socket.off('newMessage');
      }
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (socket && currentMessage.trim() !== '') {
      socket.emit('sendMessage', currentMessage, 'some-room-id');
      setCurrentMessage(''); // Clear the input field after sending
    }
  };

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)} // Update current message as the user types
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage();
          }
        }}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
