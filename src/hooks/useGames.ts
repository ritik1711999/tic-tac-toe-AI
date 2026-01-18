import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/api/client";
import type { GameData } from "../pages/game-analysis/types";

interface Game {
  _id: string;
  vs: "AI" | "Human";
  difficulty?: "easy" | "medium" | "hard";
  agingEnabled?: boolean;
  maxAge?: number;
  outcome?: "win" | "lose" | "draw";
  moves?: any[];
  duration: number;
  rating?: number;
  status: "in-progress" | "completed" | "abandoned" | "paused";
  createdAt: string;
  updatedAt: string;
}

export interface CreateGamePayload {
  vs: "AI" | "Human";
  difficulty?: "easy" | "medium" | "hard";
  opponentId?: string;
}

interface GamesResponse {
  games: Game[];
  total: number;
  page: number;
  pages: number;
}

interface GameMove {
  _id: string;
  gameId: string;
  moveNumber: number;
  position: number;
  isAiMove: boolean;
  player: "X" | "O";
  expiresOnMove?: number | null;
  expiredOnMove?: number | null;
  expiredAt?: string | null;
  timestamp: string;
}

interface GameDetailResponse {
  game: Game;
  board: string[];
  currentPlayer: "X" | "O";
  moves: GameMove[];
  userSymbol: "X" | "O";
}

export const useGames = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["games", page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get<GamesResponse>("/games", {
        params: { page, limit },
      });
      return data;
    },
  });
};

export const useGameById = (gameId: string | undefined) => {
  return useQuery({
    queryKey: ["game", gameId],
    queryFn: async () => {
      if (!gameId) throw new Error("Game ID is required");
      const { data } = await apiClient.get<GameDetailResponse>(
        `/games/${gameId}`,
      );
      return data;
    },
    enabled: !!gameId,
  });
};

export const useCreateGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateGamePayload) => {
      const { data } = await apiClient.post<Game>("/games", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
};

export const useMakeMove = (gameId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (position: number) => {
      const { data } = await apiClient.put<Game>(`/games/${gameId}/move`, {
        position,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
};

export const useDeleteGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameId: string) => {
      await apiClient.delete(`/games/${gameId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
};
export const useGameAnalysis = (gameId: string | undefined) => {
  return useQuery({
    queryKey: ["game-analysis", gameId],
    queryFn: async () => {
      if (!gameId) throw new Error("Game ID is required");
      const { data } = await apiClient.get<GameData>(
        `/games/${gameId}/analysis`,
      );
      return data;
    },
    enabled: !!gameId,
    retry: 1,
    gcTime: 60 * 60 * 1000, // Cache for 1 hour (increased from 5 minutes)
    staleTime: 60 * 60 * 1000, // Data considered fresh for 1 hour
  });
};
