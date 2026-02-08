// Types for the game board

export type Player = "X" | "O";

export type GameResult = "win" | "lose" | "draw" | null;

export interface Move {
  moveNumber?: number;
  player: Player;
  position: number;
  timestamp: string;
  isAiMove: boolean;
  expiresOnMove?: number | null;
  expiredOnMove?: number | null;
  expiredAt?: string | null;
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

export interface GameInfo {
  status: string;
  outcome?: GameResult;
  agingEnabled?: boolean;
  maxAge?: number;
  createdAt?: string;
  // Timer fields
  timerEnabled?: boolean;
  turnDuration?: number;
  playerXTimeRemaining?: number;
  playerOTimeRemaining?: number;
  timerLastStartedAt?: string | null;
  timeoutLoser?: "X" | "O";
  // Hints field
  hintsUsed?: number;
}

export interface TimerState {
  enabled: boolean;
  turnDuration: number; // total budget in seconds
  playerXTimeRemaining: number;
  playerOTimeRemaining: number;
  activePlayer: "X" | "O" | null;
}
