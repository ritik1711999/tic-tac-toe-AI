import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../../store/authStore";
import type { ClientToServerEvents, ServerToClientEvents } from "./types";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

interface SocketContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
  connectionError: string | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectionError: null,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Only connect if user is authenticated
    if (!isAuthenticated || !token) {
      return;
    }

    console.log("🔌 Connecting to socket server...");

    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      SOCKET_URL,
      {
        auth: {
          token, // Backend authMiddleware will validate
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      }
    );

    // Connection events
    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      setIsConnected(true);
      setConnectionError(null);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("🔥 Socket connection error:", err.message);
      setConnectionError(err.message);
      setIsConnected(false);
    });

    newSocket.on("error", (error) => {
      console.error("🔥 Socket error:", error);
      setConnectionError(error);
    });

    setSocket(newSocket);

    // Cleanup on unmount or token change
    return () => {
      console.log("🔌 Disconnecting socket...");
      newSocket.close();
      setSocket(null);
      setIsConnected(false);
    };
  }, [token, isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, connectionError }}>
      {children}
    </SocketContext.Provider>
  );
};
