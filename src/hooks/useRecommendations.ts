import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/api/client";

export interface RecommendationAction {
  type: "play-game" | "view-analysis";
  label: string;
  difficulty?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  icon: "trending-up" | "target" | "lightbulb" | "shield";
  category: "difficulty" | "strategy" | "opening" | "defense" | "endgame";
  action: RecommendationAction;
}

interface RecommendationsResponse {
  success: boolean;
  data: Recommendation[];
}

export const useRecommendations = () => {
  return useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const { data } =
        await apiClient.get<RecommendationsResponse>("/recommendations");
      return data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - matches backend cache
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};
