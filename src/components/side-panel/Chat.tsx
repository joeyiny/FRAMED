import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../messaging/SocketContext";

type ChatProps = {
  roomId: string;
  username?: string;
  hasJoined: boolean;
};

const Chat: React.FC<ChatProps> = ({ roomId, username, hasJoined }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState<Array<{ sender: string; content: string; username?: string }>>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasJoined && socket) {
      console.log("Trying to request room join");
      socket.emit("joinRoom", { roomId: roomId, username: username });
      socket.emit("requestInitialMessage", { roomId: roomId, username: username });
      console.log("request done");
    }
  }, [hasJoined, socket]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message: { sender: string; content: string; username?: string }) => {
        console.log("Received new message:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.emit(
        "requestChatHistory",
        roomId,
        (chatHistory: Array<{ username?: string; role: string; content: string }>) => {
          const formattedHistory = chatHistory.map((message) => ({
            ...message,
            sender: message.role,
          }));
          setMessages(formattedHistory);
        }
      );

      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }

    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (socket && currentMessage.trim() !== "") {
      setMessages((prevMessages) => [...prevMessages, { sender: "user", content: currentMessage, username: username }]);
      socket.emit("sendMessage", roomId, { username: username, sender: "user", content: currentMessage });
      setCurrentMessage("");
      inputRef.current?.focus();

      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }
  };

  return (
    <div className="chat flex flex-col p-5 overflow-y-auto max-h-screen">
      <div ref={chatBoxRef} className="messages flex-grow overflow-y-auto flex flex-col items-start space-y-2">
        {messages.map(
          (message, index) =>
            message.sender !== "assistant" && (
              <div
                key={index}
                className={`text-right ${message.sender === "assistant" ? "text-gray-500" : "text-black"}`}>
                {message.username && message.sender === "user" ? `${message.username}: ` : ""}
                {message.content}
              </div>
            )
        )}
      </div>

      <div className="input-container flex-none flex items-center">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
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
