// Events emitted by client to server
export interface ClientToServerEvents {
  "join-game": (data: { gameId: string }) => void;
  "make-move": (data: {
    gameId: string;
    position: number;
    userId: string;
  }) => void;
  "leave-game": (data: { gameId: string }) => void;
  "request-hint": (data: { gameId: string }) => void;
}

// Events received from server
export interface ServerToClientEvents {
  "game-update": (data: {
    gameId: string;
    board: string[];
    currentPlayer: "X" | "O";
    result?: "win" | "lose" | "draw";
  }) => void;

  "ai-move": (data: {
    gameId: string;
    position: number;
    reasoning: string;
  }) => void;

  "game-end": (data: {
    gameId: string;
    result: "win" | "lose" | "draw";
    stats: {
      moves: number;
      duration: number;
    };
    leveledUp?: boolean;
    newSkill?: string | null;
    previousSkill?: string | null;
    skillPoints?: number;
    newAchievements?: Array<{
      achievementId: string;
      unlockedAt: Date;
    }>;
  }) => void;

  "cell-expired": (data: {
    gameId: string;
    expired: Array<{ position: number; player: "X" | "O" }>;
  }) => void;

  "aging-state": (data: {
    gameId: string;
    cells: Array<{
      position: number;
      player: "X" | "O";
      age: number;
      expiresIn: number;
    }>;
  }) => void;

  "timer-update": (data: {
    gameId: string;
    playerXTimeRemaining: number;
    playerOTimeRemaining: number;
    activePlayer: "X" | "O" | null;
  }) => void;

  "game-timeout": (data: {
    gameId: string;
    winner: "X" | "O";
    loser: "X" | "O";
    reason: "timeout";
  }) => void;

  "hint-suggestion": (data: {
    gameId: string;
    position: number;
    confidence: number;
    strategy: string;
    moveType: string;
    hintsRemaining: number;
  }) => void;

  error: (data: string | { message: string }) => void;
}
