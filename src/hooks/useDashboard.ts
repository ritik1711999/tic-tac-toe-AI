import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/api/client";
import type { DashboardStatsResponse } from "../pages/game-dashboard/types";

export interface Achievement {
  _id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
}

export interface RecentGame {
  _id: string;
  difficulty: "easy" | "medium" | "hard";
  outcome: "win" | "lose" | "draw";
  moves: any[];
  duration: number;
  createdAt: string;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const { data } =
        await apiClient.get<DashboardStatsResponse>("/dashboard/stats");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useAchievements = () => {
  return useQuery({
    queryKey: ["dashboard", "achievements"],
    queryFn: async () => {
      const { data } = await apiClient.get<Achievement[]>(
        "/dashboard/achievements",
      );
      return data;
    },
  });
};

export const useRecentGames = () => {
  return useQuery({
    queryKey: ["dashboard", "recent-games"],
    queryFn: async () => {
      const { data } = await apiClient.get<RecentGame[]>(
        "/dashboard/recent-games",
      );
      return data;
    },
    refetchInterval: 30000,
  });
};

export const useAISuggestions = (boardState: string[]) => {
  return useQuery({
    queryKey: ["ai", "suggestions", boardState],
    queryFn: async () => {
      const { data } = await apiClient.post("/ai/suggestions", {
        boardState,
        difficulty: "medium",
      });
      return data;
    },
    enabled: !!boardState,
  });
};

export const useAIMove = (boardState: string[], difficulty: string) => {
  return useQuery({
    queryKey: ["ai", "move", boardState, difficulty],
    queryFn: async () => {
      const { data } = await apiClient.post("/ai/move", {
        boardState,
        difficulty,
      });
      return data;
    },
    enabled: !!boardState && !!difficulty,
  });
};
