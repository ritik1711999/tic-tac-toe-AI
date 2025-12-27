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
