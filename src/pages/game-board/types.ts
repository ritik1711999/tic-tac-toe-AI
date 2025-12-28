// Types for the game board

export type Player = "X" | "O";

export type GameResult = "win" | "lose" | "draw" | null;

export interface Move {
  player: Player;
  position: number;
  timestamp: string;
  isAiMove: boolean;
}

export interface Suggestion {
  position: number;
  confidence: number;
  strategy: string;
  moveType: string;
}

export interface GameStats {
  totalMoves: number;
  gameTime: string;
  accuracy: number;
}

export interface CheckWinnerResult {
  winner: Player | "draw" | null;
  line: number[] | null;
}
