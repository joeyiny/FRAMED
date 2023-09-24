import React, { useState, useEffect } from 'react';
import { Client } from '@xmtp/xmtp-js';
import { Wallet } from 'ethers'; // Assuming you're using ethers.js
import { Avatar } from './Avatar.tsx';
import { Message } from './Message.tsx';
import { MessageInput } from './MessageInput.tsx';
import type { CachedConversation } from "@xmtp/react-sdk";
import "@xmtp/react-components/styles.css";

type Player = {
  address: string;
  avatarUrl?: string;
};

type ChatProps = {
  players: Player[];
};

const Chat: React.FC<ChatProps> = ({ players }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [messages, setMessages] = useState<any[]>([]); // Adjust the type as needed
  const [xmtp, setXmtp] = useState<any | null>(null);
  const [currentConversation, setCurrentConversation] = useState<CachedConversation | null>(null);


  useEffect(() => {
    const initializeXMTP = async () => {
      const wallet = Wallet.createRandom(); // Replace with actual wallet
      const client = await Client.create(wallet);
      setXmtp(client);
    };

    initializeXMTP();
  }, []);

  const handlePlayerSelect = async (player: Player) => {
    setSelectedPlayer(player);
    if (xmtp) {
      const conversation = await xmtp.conversations.newConversation(player.address);
      setCurrentConversation(conversation);  // <-- Add this line
      const conversationMessages = await conversation.messages();
      setMessages(conversationMessages);
    }
};


  const handleSendMessage = async (msg: string) => {
    if (selectedPlayer && xmtp) {
      const conversation = await xmtp.conversations.newConversation(selectedPlayer.address);
      await conversation.send(msg);
      const updatedMessages = await conversation.messages();
      setMessages(updatedMessages);
    }
  };

  return (
    <div>
      <div className="player-list">
        {players.map(player => (
          <div key={player.address} onClick={() => handlePlayerSelect(player)}>
            <Avatar address={player.address} url={player.avatarUrl} />
          </div>
        ))}
      </div>

      {selectedPlayer && (
        <div className="chat-box">
          <div className="messages">
            {currentConversation && messages.map(message => (
              <Message 
              key={message.id} 
              message={message} 
              conversation={currentConversation}  // <-- Add this prop
          />
            ))}
          </div>
          <MessageInput onSubmit={handleSendMessage} placeholder="Type a message..." />
        </div>
      )}
    </div>
  );
};

export default Chat;
