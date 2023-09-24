import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Message {
  text: string;
  sender: string;
  color?: string;
}

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessages([...messages, { text: 'Who is the mafia man?', sender: 'Tomato Spider', color: 'red' }]);
    }, 3000);
    
    const timer2 = setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { text: 'I think it’s Larry!', sender: 'Ice Water Fren', color: 'blue' }]);
    }, 4000);
    
    const timer3 = setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { text: 'No way, it’s definitely Harry!', sender: 'Pumpkin Spice', color: 'orange' }]);
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: 'You', color: 'purple' }]);
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 z-10">
      {isOpen ? (
        <div className="w-64 h-96 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex flex-col h-full">
            <div id="messages-area" className="text-slate-700 px-4 overflow-y-auto flex-1">
              {messages.map((msg, index) => (
                <div key={index} className="border-b text-left">
                  <p className="text-sm py-3">
                    <span className="font-bold" style={{ color: msg.color }}>{msg.sender}: </span>
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
            <div id="input" className="w-full border-t p-2 flex items-center space-x-2">
              <Input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <Button size="sm" onClick={handleSendMessage}>Send</Button>
            </div>
            <Button className="absolute top-0 right-0 mt-[-50px] mr-2" onClick={() => setIsOpen(false)}>X</Button>
          </div>
        </div>
      ) : (
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center cursor-pointer" onClick={() => setIsOpen(true)}>
          <span className="text-sm font-semibold text-white">Chat</span>
        </div>
      )}
    </div>
  );
};

export default Chat;

