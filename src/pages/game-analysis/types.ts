export interface Move {
  moveNumber: number;
  player: "X" | "O";
  position: number | string; // Numeric position (0-8) or string label
  positionLabel?: string; // Human-readable position label (e.g., "center", "top-left")
  timestamp: string;
  quality: "excellent" | "good" | "suboptimal" | "mistake";
  score: number;
  tacticalScore?: number;
  longevityScore?: number;
  volatilityRisk?: number;
  aiRecommendation: string;
  reasoning: string;
  alternativeMove: string | null;
  outcomes: {
    win: number;
    draw: number;
    lose: number;
  };
  boardState: ("X" | "O" | "")[];
  expiresOnMove?: number | null;
  expiredOnMove?: number | null;
  lifespan?: number;
}

export interface KeyMoment {
  moveNumber: number;
  description: string;
}

export interface PerformanceMetricsData {
  overallScore: number;
  breakdown: {
    excellent: number;
    good: number;
    suboptimal: number;
    mistakes: number;
  };
  keyMoments: KeyMoment[];
}

export type MetricType = keyof PerformanceMetricsData["breakdown"];

export interface GameData {
  id: string;
  title: string;
  date: string;
  result: string;
  duration: string;
  winningLine?: number[] | null;
  moves: Move[];
  performanceMetrics: PerformanceMetricsData;
  agingMetrics?: {
    maxAge: number;
    totalMoves: number;
    totalExpirations: number;
    avgLifespan: number;
    volatilityScore: number;
  };
  cached?: boolean; // Whether this analysis was retrieved from cache
}
