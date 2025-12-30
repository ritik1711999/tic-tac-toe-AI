export type GameOutcome = "win" | "loss" | "draw";
export type GameDifficulty = "easy" | "medium" | "hard";
export type ExportFormat = "json" | "csv" | "pdf";

export interface Game {
  id: string;
  date: Date;
  difficulty: GameDifficulty;
  outcome: GameOutcome;
  moves: number;
  duration: number; // in seconds
  rating: number;
}

export interface GameFilters {
  search: string;
  dateFrom: string;
  dateTo: string;
  outcome: string;
  difficulty: string;
  duration: string;
}

export interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  totalMoves: number;
  totalDuration: number;
  byDifficulty: DifficultyStats[];
}

export interface DifficultyStats {
  level: GameDifficulty;
  games: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface SortConfig {
  key: "date" | "duration" | "moves" | "rating";
  direction: "asc" | "desc";
}

