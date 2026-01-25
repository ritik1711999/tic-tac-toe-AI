export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
}

export interface Recommendation {
  id: number;
  type: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: string;
  priority: "high" | "medium" | "low";
}

export interface RecentGame {
  id: string;
  opponent: string;
  result: string;
  moves: number;
  duration: string;
  timestamp: Date;
  winningPattern: string;
}

export interface Stat {
  id: number;
  label: string;
  value: string | number;
  change: string;
  changeType: "positive" | "neutral" | "negative";
  icon: string;
  color: string;
}

// Backend dashboard stats response
export interface DashboardStatsGroup {
  totalGames: number;
  wins: number;
  loses: number;
  draws: number;
  totalMoves: number;
  totalDuration: number;
  winRate: number; // percentage
  avgMoves: number;
  avgDuration: number; // seconds
}

export interface DashboardDelta {
  abs: number;
  pct: number | null;
}

export interface DashboardStreak {
  count: number;
  outcome: string | null; // 'win' | 'lose' | 'draw' | null
}

export interface DashboardStatsResponse {
  current: DashboardStatsGroup;
  previous: DashboardStatsGroup;
  deltas: {
    totalGames: DashboardDelta;
    winRate: DashboardDelta;
    avgMoves: DashboardDelta;
    avgDuration: DashboardDelta;
  };
  streak: DashboardStreak;
}

// Progression API types
export interface SkillSnapshot {
  rank: string; // "beginner" | "intermediate" | "advanced" | "master"
  stage: number; // 1 | 2 | 3
  label: string; // e.g., "Beginner 2"
}

export interface ProgressionMeResponse {
  skillPoints: number;
  currentSkill: SkillSnapshot | null;
  currentSkillAchievedAt: string | null;
  lastSeenLevelUpAt: string | null;
  nextSkill: SkillSnapshot | null;
  pointsToNextLevel: number;
  progressPercent: number; // 0..100
}
