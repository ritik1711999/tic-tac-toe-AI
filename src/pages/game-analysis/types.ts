export interface Move {
  moveNumber: number;
  player: "X" | "O";
  position: string;
  timestamp: string;
  quality: "excellent" | "good" | "suboptimal" | "mistake";
  score: number;
  aiRecommendation: string;
  reasoning: string;
  alternativeMove: string | null;
  outcomes: {
    win: number;
    draw: number;
    loss: number;
  };
  boardState: ("X" | "O" | "")[];
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
  moves: Move[];
  performanceMetrics: PerformanceMetricsData;
}
