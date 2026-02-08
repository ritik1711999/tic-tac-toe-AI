import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import apiClient from "../lib/api/client";
import type { GameData } from "../pages/game-analysis/types";
import type { HistoryStatsResponse } from "../pages/game-history/types";

interface Game {
  _id: string;
  vs: "AI" | "Human";
  difficulty?: "easy" | "medium" | "hard";
  agingEnabled?: boolean;
  maxAge?: number;
  hintsUsed?: number;
  outcome?: "win" | "lose" | "draw";
  moves?: any[];
  duration: number;
  rating?: number;
  status: "in-progress" | "completed" | "abandoned" | "paused";
  // Timer fields
  timerEnabled?: boolean;
  turnDuration?: number;
  playerXTimeRemaining?: number;
  playerOTimeRemaining?: number;
  timerLastStartedAt?: string | null;
  timeoutLoser?: "X" | "O";
  // User info (populated)
  user?: {
    _id: string;
    name?: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateGamePayload {
  vs: "AI" | "Human";
  difficulty?: "easy" | "medium" | "hard";
  timerDuration?: number; // Duration in seconds for local multiplayer
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

export interface RecentGame {
  id: string;
  opponent: string;
  result: "win" | "lose" | "draw";
  moves: number;
  duration: string;
  timestamp: Date;
  winningPattern: string;
  durationSeconds: number;
}

interface RecentGamesResponse {
  games: RecentGame[];
  total: number;
}

export const useRecentGames = (limit = 20) => {
  return useQuery({
    queryKey: ["recent-games", limit],
    queryFn: async () => {
      const { data } = await apiClient.get<RecentGamesResponse>(
        "/games/recent",
        {
          params: { limit },
        },
      );
      return data;
    },
    retry: 1,
    gcTime: 2 * 60 * 1000, // Cache for 2 minutes
  });
};

export interface GameHistoryFilters {
  search: string;
  dateFrom: string;
  dateTo: string;
  outcome: string;
  difficulty: string;
  duration: string;
}

export interface PaginatedGameResponse {
  games: RecentGame[];
  pageInfo: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
  };
}

export const useGameHistory = (filters: GameHistoryFilters, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["game-history", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get<PaginatedGameResponse>(
        "/games/history",
        {
          params: {
            page: pageParam,
            limit,
            search: filters.search,
            outcome: filters.outcome,
            difficulty: filters.difficulty,
            duration: filters.duration,
            dateFrom: filters.dateFrom,
            dateTo: filters.dateTo,
          },
        },
      );
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pageInfo.hasNextPage) {
        return lastPage.pageInfo.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    retry: 1,
  });
};

export const useGameHistoryStats = (filters: GameHistoryFilters) => {
  return useQuery({
    queryKey: ["game-history", "stats", filters],
    queryFn: async () => {
      const { data } = await apiClient.get<HistoryStatsResponse>(
        "/games/history/stats",
        {
          params: {
            outcome: filters.outcome,
            difficulty: filters.difficulty,
            duration: filters.duration,
            dateFrom: filters.dateFrom,
            dateTo: filters.dateTo,
          },
        },
      );
      return data;
    },
    retry: 1,
    gcTime: 5 * 60 * 1000, // Cache for 5 minutes
    staleTime: 1 * 60 * 1000, // Fresh for 1 minute
  });
};
