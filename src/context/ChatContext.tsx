import React, { ReactNode } from 'react';

export const ChatContext = React.createContext<{
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [isChatOpen, setIsChatOpen] = React.useState(true);
  
    return (
      <ChatContext.Provider value={{ isChatOpen, setIsChatOpen }}>
        {children}
      </ChatContext.Provider>
    );
};
