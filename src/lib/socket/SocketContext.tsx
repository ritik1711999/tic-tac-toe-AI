import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../../store/authStore";
import type { ClientToServerEvents, ServerToClientEvents } from "./types";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

interface LevelUpData {
  leveledUp: boolean;
  newSkill: string | null;
  previousSkill: string | null;
  skillPoints: number;
}

interface NewAchievement {
  achievementId: string;
  unlockedAt: Date;
}

interface SocketContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
  connectionError: string | null;
  consumeLevelUp: () => LevelUpData | null;
  consumeNewAchievements: () => NewAchievement[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectionError: null,
  consumeLevelUp: () => null,
  consumeNewAchievements: () => [],
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
  const { token, isAuthenticated, user } = useAuthStore();
  const levelUpRef = useRef<LevelUpData | null>(null);
  const achievementsRef = useRef<NewAchievement[]>([]);

  useEffect(() => {
    // Only connect if user is authenticated
    if (!isAuthenticated || !token || !user?._id) {
      return;
    }

    console.log("🔌 Connecting to socket server...");

    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      SOCKET_URL,
      {
        auth: {
          token, // Backend authMiddleware will validate
          userId: user._id,
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      },
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

    // Listen for level-up events and achievements, buffer them
    newSocket.on("game-end", (data: any) => {
      if (data?.leveledUp && data?.newSkill) {
        levelUpRef.current = {
          leveledUp: true,
          newSkill: data.newSkill,
          previousSkill: data.previousSkill ?? null,
          skillPoints: data.skillPoints ?? 0,
        };
      }
      if (data?.newAchievements && Array.isArray(data.newAchievements)) {
        // Append new achievements to buffer (avoiding duplicates)
        const existingIds = new Set(
          achievementsRef.current.map((a) => a.achievementId),
        );
        const uniqueNewAchievements = data.newAchievements.filter(
          (a: NewAchievement) => !existingIds.has(a.achievementId),
        );
        achievementsRef.current = [
          ...achievementsRef.current,
          ...uniqueNewAchievements,
        ];
      }
    });

    setSocket(newSocket);

    // Cleanup on unmount or token change
    return () => {
      console.log("🔌 Disconnecting socket...");
      newSocket.close();
      setSocket(null);
      setIsConnected(false);
    };
  }, [token, isAuthenticated, user?._id]);

  const consumeLevelUp = () => {
    const val = levelUpRef.current;
    levelUpRef.current = null;
    return val;
  };

  const consumeNewAchievements = () => {
    const val = achievementsRef.current;
    achievementsRef.current = [];
    return val;
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        connectionError,
        consumeLevelUp,
        consumeNewAchievements,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
