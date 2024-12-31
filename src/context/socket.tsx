import React, { createContext, useContext, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

// Define the type for the context
interface SocketContextType {
  socket: Socket;
}

// Create the socket context
const SocketContext = createContext<Socket | null>(null);

// Define props for the provider
interface SocketProviderProps {
  children: ReactNode;
}

const ENDPOINT = "http://localhost:3000/";

// Create the Socket Provider
const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = io(ENDPOINT);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Custom hook to access the socket
const useSocket = (): Socket => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export { SocketProvider, useSocket };
