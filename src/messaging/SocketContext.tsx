import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_REACT_APP_SOCKET_SERVER_URL as string);
    console.log("Socket Context");
    console.log(import.meta.env.VITE_REACT_APP_SOCKET_SERVER_URL);
  
    newSocket.on('connect', () => {
      console.log('Connected to the server');
    });
  
    newSocket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
  
    setSocket(newSocket);
  
    return () => {
      newSocket.close();
    };
  }, []);
  

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
