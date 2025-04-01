import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useLanguage } from './LanguageContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { sourceLanguage, targetLanguage } = useLanguage();
  
  // Initialize socket connection
  useEffect(() => {
    // In development, connect to the local server
    // In production, this would connect to the deployed backend
    const socketInstance = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000');
    
    socketInstance.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });
    
    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });
    
    setSocket(socketInstance);
    
    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);
  
  const value = {
    socket,
    isConnected
  };
  
  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
