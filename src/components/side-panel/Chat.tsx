import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import { PLAYER_NAMES } from "@/screens/in-game";

type ChatProps = {
  roomId: string;
  player_id?: string;
  hasJoined: boolean;
};

const Chat: React.FC<ChatProps> = ({ roomId, player_id, hasJoined }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState<Array<{ sender: string; content: string; player_id?: string }>>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasJoined && socket) {
      console.log("Trying to request room join");
      socket.emit("joinRoom", { roomId: roomId, player_id: player_id });
      socket.emit("requestInitialMessage", { roomId: roomId, player_id: player_id });
      console.log("request done");
    }
  }, [hasJoined, socket]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message: { sender: string; content: string; player_id?: string }) => {
        console.log("Received new message:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.emit(
        "requestChatHistory",
        roomId,
        (chatHistory: Array<{ player_id?: string; role: string; content: string }>) => {
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

  // Auto-scrolling behavior
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (socket && currentMessage.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", content: currentMessage, player_id: player_id },
      ]);
      socket.emit("sendMessage", roomId, { player_id: player_id, sender: "user", content: currentMessage });
      setCurrentMessage("");
      inputRef.current?.focus();

      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }
  };

  return (
    <div className="chat flex flex-col p-5 overflow-y-auto max-h-screen">
      <p className="font-bold bg-red-200 mb-4">
        For best experience, we suggest players hop on a voice call with Discord/etc.
      </p>
      <div ref={chatBoxRef} className="messages flex-grow overflow-y-auto flex flex-col items-start space-y-2">
        {messages.map(
          (message, index) =>
            message.sender === "user" && (
              <div
                key={index}
                // className={`text-right ${message.sender === "assistant" ? "text-gray-500" : "text-black"}`}>
                className={`text-right text-black`}>
                <span className="font-bold">{`${PLAYER_NAMES[message.player_id]}: `}</span>
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
          placeholder="Send a message... "
        />
      </div>
    </div>
  );
};

export default Chat;
