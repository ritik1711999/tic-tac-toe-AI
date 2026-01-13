// Events emitted by client to server
export interface ClientToServerEvents {
  "join-game": (data: { gameId: string }) => void;
  "make-move": (data: {
    gameId: string;
    position: number;
    userId: string;
  }) => void;
  "leave-game": (data: { gameId: string }) => void;
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

  error: (data: string) => void;
}
