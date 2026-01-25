import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/api/client";
import type { ProgressionMeResponse } from "../pages/game-dashboard/types";
import { useSocket } from "../lib/socket/SocketContext";

export const useProgression = () => {
  return useQuery({
    queryKey: ["progression", "me"],
    queryFn: async () => {
      const { data } =
        await apiClient.get<ProgressionMeResponse>("/progression/me");
      return data;
    },
    staleTime: 60_000,
  });
};

export const useProgressionRefetchOnGameEnd = () => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;
    const handler = () => {
      // Invalidate and refetch progression after any game ends
      queryClient.invalidateQueries({ queryKey: ["progression", "me"] });
    };
    socket.on("game-end", handler);
    return () => {
      socket.off("game-end", handler);
    };
  }, [socket, queryClient]);
};
