import React, { createContext, useContext, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children: ReactNode;
}

const ENDPOINT = "http://localhost:8080/";

const SocketContext = createContext<Socket | null>(null);

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = io(ENDPOINT);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

const useSocket = (): Socket => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export { SocketProvider, useSocket };
