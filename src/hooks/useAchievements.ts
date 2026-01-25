import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/api/client";
import { useSocket } from "../lib/socket/SocketContext";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  progress: number;
  isUnlocked: boolean;
  unlockedAt: Date | null;
  seenByUser: boolean;
  seenAt: Date | null;
}

interface AchievementsResponse {
  achievements: Achievement[];
}

export const useAchievements = () => {
  return useQuery({
    queryKey: ["achievements", "me"],
    queryFn: async () => {
      const { data } =
        await apiClient.get<AchievementsResponse>("/achievements/me");
      return data.achievements;
    },
    staleTime: 60_000,
  });
};

export const useAchievementsRefetchOnGameEnd = () => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handler = () => {
      queryClient.invalidateQueries({ queryKey: ["achievements", "me"] });
    };

    socket.on("game-end", handler);

    return () => {
      socket.off("game-end", handler);
    };
  }, [socket, queryClient]);
};

export const useMarkAchievementSeen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (achievementId: string) => {
      const { data } = await apiClient.patch(
        `/achievements/${achievementId}/seen`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements", "me"] });
    },
  });
};
