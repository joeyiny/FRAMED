import React, { ReactNode } from 'react';

export const ChatContext = React.createContext<{
  chatsOpenState: { [roomId: string]: boolean };
  toggleChat: (roomId: string) => void;
} | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [chatsOpenState, setChatsOpenState] = React.useState<{ [roomId: string]: boolean }>({});

    const toggleChat = (roomId: string) => {
      setChatsOpenState(prevState => ({
        ...prevState,
        [roomId]: !prevState[roomId]
      }));
    };
  
    return (
      <ChatContext.Provider value={{ chatsOpenState, toggleChat }}>
        {children}
      </ChatContext.Provider>
    );
};
