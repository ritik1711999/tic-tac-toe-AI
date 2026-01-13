import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/ui/Header";
import GameStatusIndicator from "../../components/ui/GameStatusIndicator";
import QuickActionsMenu from "../../components/ui/QuickActionsMenu";
import GameGrid from "./components/GameGrid";
import AiSuggestionPanel from "./components/AiSuggestionPanel";
import MoveHistory from "./components/MoveHistory";
import GameControls from "./components/GameControls";
import GameResultModal from "./components/GameResultModal";
import LeaveGameConfirmationModal from "./components/LeaveGameConfirmationModal";
import ConnectionStatus from "../../components/ConnectionStatus";
import { useSocket } from "../../lib/socket/SocketContext";
import { useGameById } from "../../hooks/useGames";
import { useAuthStore } from "../../store/authStore";
import type { Player, GameResult, Move, Suggestion, GameStats } from "./types";
import "./GameBoard.css";

const GameBoard = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { socket, isConnected } = useSocket();
  const user = useAuthStore((state) => state.user);

  // Fetch initial game state
  const { data: gameData, isLoading, error: fetchError } = useGameById(gameId);

  // === Backend-driven state (will be updated from socket events) ===
  const [board, setBoard] = useState<(Player | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [isGameActive, setIsGameActive] = useState(true);
  const [moveCount, setMoveCount] = useState(0);
  const [moves, setMoves] = useState<Move[]>([]);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const [userSymbol] = useState<Player>("X"); // User is always X
  // Aging state
  const [cellAging, setCellAging] = useState<
    Map<number, { age: number; expiresIn: number }>
  >(new Map());
  const [expiredCells, setExpiredCells] = useState<Set<number>>(new Set());

  // === UI-only state (managed client-side) ===
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [showResultModal, setShowResultModal] = useState(false);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agingEnabled, setAgingEnabled] = useState(true);
  const [maxAge, setMaxAge] = useState(5);

  // === Leave Game Confirmation Modal ===
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );

  // === AI Suggestions (mock for now, will integrate later) ===
  const [suggestions] = useState<Suggestion[]>([
    {
      position: 4,
      confidence: 85,
      strategy:
        "Center control is crucial in tic-tac-toe. This move gives you the most strategic options for future plays.",
      moveType: "Strategic Opening",
    },
    {
      position: 0,
      confidence: 72,
      strategy:
        "Corner positions provide strong control and multiple winning paths. This is a solid alternative opening.",
      moveType: "Corner Control",
    },
    {
      position: 2,
      confidence: 68,
      strategy:
        "Another corner option that maintains flexibility while establishing board presence.",
      moveType: "Corner Control",
    },
  ]);

  // Browser navigation blocking (back/forward buttons)
  useEffect(() => {
    const handlePopstate = () => {
      if (isGameActive) {
        // Prevent default navigation
        window.history.pushState(null, "", window.location.href);
        // Show confirmation modal for browser back/forward
        setShowLeaveModal(true);
        setPendingNavigation("/dashboard"); // Always navigate to dashboard when user tries browser back/forward
      }
    };

    if (isGameActive) {
      // Push a history entry to intercept back button
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handlePopstate);
    }

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [isGameActive]);

  // Browser beforeunload warning for page close/reload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isGameActive) {
        // Modern browsers display their own message
        e.preventDefault();
        e.returnValue = "";
      }
    };

    if (isGameActive) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isGameActive]);

  // Load initial game state from REST API
  useEffect(() => {
    if (gameData) {
      // Convert board strings to Player | null
      const initialBoard = gameData.board.map((cell) =>
        cell === "" ? null : (cell as Player)
      );
      setBoard(initialBoard);
      setCurrentPlayer(gameData.currentPlayer);
      const totalMoves = gameData.moves.length;
      setMoveCount(totalMoves);

      // Initialize timer from backend duration
      if (gameData.game.duration) {
        setGameTime(gameData.game.duration);
      }

      // Store aging settings
      setAgingEnabled(gameData.game.agingEnabled !== false);
      setMaxAge(gameData.game.maxAge || 5);

      // Convert moves to UI format
      const uiMoves: Move[] = gameData.moves.map((move) => ({
        moveNumber: move.moveNumber,
        player: move.player,
        position: move.position,
        timestamp: move.timestamp,
        isAiMove: move.isAiMove,
        expiresOnMove: move.expiresOnMove ?? null,
        expiredOnMove: move.expiredOnMove ?? null,
        expiredAt: move.expiredAt ?? null,
      }));
      setMoves(uiMoves);

      // Initialize aging state locally for initial render
      const aging = new Map<number, { age: number; expiresIn: number }>();
      const expired = new Set<number>();
      const maxAge = gameData.game.maxAge ?? 5;
      uiMoves.forEach((m) => {
        const isExpired =
          m.expiredOnMove != null && m.expiredOnMove <= totalMoves;
        if (isExpired) {
          expired.add(m.position);
        } else {
          const age = Math.max(
            1,
            totalMoves - (m.moveNumber ?? totalMoves) + 1
          );
          const effExpiresOn =
            m.expiresOnMove ??
            (m.moveNumber ? m.moveNumber + maxAge : totalMoves + maxAge);
          const expiresIn = Math.max(0, effExpiresOn - totalMoves);
          aging.set(m.position, { age, expiresIn });
        }
      });
      setCellAging(aging);
      setExpiredCells(expired);

      // Check if game is already completed
      if (gameData.game.status === "completed") {
        setIsGameActive(false);
        if (gameData.game.outcome) {
          setGameResult(gameData.game.outcome as GameResult);
        }
      }
    }
  }, [gameData]);

  // Handle fetch errors
  useEffect(() => {
    if (fetchError) {
      setError("Failed to load game. Please try again.");
      console.error("Game fetch error:", fetchError);
    }
  }, [fetchError]);

  // Socket connection and event listeners
  useEffect(() => {
    if (!socket || !gameId || !isConnected || !user) return;

    console.log("🎮 Joining game room:", gameId);
    socket.emit("join-game", { gameId });

    // Listen for game updates
    const handleGameUpdate = (data: {
      gameId: string;
      board: string[];
      currentPlayer: "X" | "O";
      result?: "win" | "lose" | "draw";
      duration?: number;
    }) => {
      console.log("📡 Game update received:", data);

      // Sync duration from backend
      if (data.duration !== undefined) {
        setGameTime(data.duration);
      }

      // Update board
      const newBoard = data.board.map((cell) =>
        cell === "" ? null : (cell as Player)
      );
      setBoard(newBoard);
      // If a cell is now filled, ensure it is not marked expired
      setExpiredCells((prev) => {
        const next = new Set(prev);
        newBoard.forEach((cell, idx) => {
          if (cell !== null) {
            next.delete(idx);
          }
        });
        return next;
      });
      setCurrentPlayer(data.currentPlayer);
      setMoveCount((prev) => prev + 1); // authoritative move count
      setIsAiThinking(false);

      // Add move to history
      const placedBy: Player = data.currentPlayer === "X" ? "O" : "X";
      const placedPos = findPlacedPosition(board, newBoard, placedBy);
      const lastMove: Move = {
        player: placedBy,
        position: placedPos,
        timestamp: new Date().toISOString(),
        isAiMove: false, // Will be set by ai-move event
      };
      setMoves((prev) => [...prev, lastMove]);
    };

    // Listen for AI move indicator
    const handleAiMove = (data: {
      gameId: string;
      position: number;
      reasoning: string;
    }) => {
      console.log("🤖 AI is thinking...", data);
      setIsAiThinking(true);

      // Update last move to mark as AI move
      setMoves((prev) => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[updated.length - 1].isAiMove = true;
        }
        return updated;
      });
    };

    // Listen for game over
    const handleGameOver = (data: {
      gameId: string;
      result: "win" | "lose" | "draw";
      stats: { moves: number; duration: number };
    }) => {
      console.log("🏁 Game over:", data);
      setGameResult(data.result as GameResult);
      setIsGameActive(false);
      setShowResultModal(true);
      // Sync final duration from backend
      setGameTime(data.stats.duration);
      // Don't calculate winning line here - let useEffect handle it with proper board state
    };

    // Listen for aging events
    const handleCellExpired = (payload: {
      gameId: string;
      expired: Array<{ position: number; player: "X" | "O" }>;
    }) => {
      // Clear cells on the board and mark in sets
      setBoard((prev) => {
        const next = [...prev];
        payload.expired.forEach(({ position }) => {
          next[position] = null;
        });
        return next;
      });
      setExpiredCells((prev) => {
        const next = new Set(prev);
        payload.expired.forEach(({ position }) => next.add(position));
        return next;
      });
      // Annotate the original move as expired
      setMoves((prev) => {
        const next = prev.map((m) => ({ ...m }));
        payload.expired.forEach(({ position }) => {
          const idx = next.findIndex((m) => m.position === position);
          if (idx >= 0) {
            next[idx].expiredOnMove = moveCount + 1; // this expiration coincides with the current move being processed
            next[idx].expiredAt = new Date().toISOString();
          }
        });
        return next;
      });
    };

    const handleAgingState = (payload: {
      gameId: string;
      cells: Array<{
        position: number;
        player: "X" | "O";
        age: number;
        expiresIn: number;
      }>;
    }) => {
      const map = new Map<number, { age: number; expiresIn: number }>();
      payload.cells.forEach((c) =>
        map.set(c.position, { age: c.age, expiresIn: c.expiresIn })
      );
      setCellAging(map);
    };

    // Listen for errors
    const handleError = (errorData: string | { message: string }) => {
      const errorMessage =
        typeof errorData === "string" ? errorData : errorData.message;
      console.error("❌ Socket error:", errorMessage);
      setError(errorMessage);
      setIsAiThinking(false);

      // Auto-dismiss error after 5 seconds
      setTimeout(() => setError(null), 5000);
    };

    socket.on("game-update", handleGameUpdate);
    socket.on("ai-move", handleAiMove);
    socket.on("game-end", handleGameOver);
    socket.on("cell-expired", handleCellExpired);
    socket.on("aging-state", handleAgingState);
    socket.on("error", handleError);

    // Cleanup listeners on unmount
    return () => {
      socket.off("game-update", handleGameUpdate);
      socket.off("ai-move", handleAiMove);
      socket.off("game-end", handleGameOver);
      socket.off("cell-expired", handleCellExpired);
      socket.off("aging-state", handleAgingState);
      socket.off("error", handleError);
    };
  }, [socket, gameId, isConnected, user, board]);

  // Helper function to find which position changed
  const findChangedPosition = (
    oldBoard: (Player | null)[],
    newBoard: (Player | null)[]
  ): number => {
    for (let i = 0; i < 9; i++) {
      if (oldBoard[i] !== newBoard[i]) {
        return i;
      }
    }
    return 0;
  };

  // Find the newly placed position by a specific player
  const findPlacedPosition = (
    oldBoard: (Player | null)[],
    newBoard: (Player | null)[],
    placedBy: Player
  ): number => {
    for (let i = 0; i < 9; i++) {
      const was = oldBoard[i];
      const now = newBoard[i];
      if (now === placedBy && was !== placedBy) {
        return i;
      }
    }
    return findChangedPosition(oldBoard, newBoard);
  };

  // Calculate winning line
  const calculateWinningLine = (boardState: (Player | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        setWinningLine(line);
        return;
      }
    }
  };

  useEffect(() => {
    let timer: number;
    if (isGameActive) {
      timer = setInterval(() => {
        setGameTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameActive]);

  // Calculate winning line when game ends (watch for board state + game result changes)
  useEffect(() => {
    if (
      !isGameActive &&
      gameResult &&
      (gameResult === "win" || gameResult === "lose")
    ) {
      console.log("🎯 Calculating winning line with board state:", board);
      calculateWinningLine(board);
    }
  }, [isGameActive, gameResult, board]);

  const formatGameTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleCellClick = (index: number) => {
    // Client-side validation
    if (board[index]) return; // Cell already occupied
    if (!isGameActive) return; // Game is over
    if (isAiThinking) return; // AI is currently thinking
    if (!socket || !isConnected) {
      setError("Not connected to server");
      return;
    }
    if (!user) {
      setError("User not authenticated");
      return;
    }

    // For AI games, only allow moves when it's the user's turn
    if (gameData?.game.vs === "AI" && currentPlayer !== userSymbol) {
      return;
    }

    console.log("🎯 Making move:", index);

    // Emit make-move event to server
    socket.emit("make-move", {
      gameId: gameId!,
      position: index,
      userId: user._id,
    });
  };

  const handleNewGame = () => {
    // Navigate back to dashboard to create a new game
    navigate("/dashboard");
  };

  const handleLeaveGame = () => {
    if (isGameActive) {
      // Show confirmation modal when game is active
      setShowLeaveModal(true);
      setPendingNavigation("/dashboard");
    } else {
      // Navigate immediately if game is over
      navigate("/dashboard");
    }
  };

  const handleConfirmLeave = () => {
    // Emit socket event to leave game
    if (socket && gameId) {
      socket.emit("leave-game", { gameId });
    }

    // Reset modal state
    setShowLeaveModal(false);

    // Navigate to pending route (always set, no null case)
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
    setPendingNavigation(null);
  };

  const handleCancelLeave = () => {
    setShowLeaveModal(false);
    setPendingNavigation(null);
  };

  const handleHeaderNavigation = (path: string) => {
    if (isGameActive) {
      // Show confirmation modal when game is active
      setShowLeaveModal(true);
      setPendingNavigation(path);
    } else {
      // Navigate immediately if game is over
      navigate(path);
    }
  };

  const handleHint = () => {
    if (hintsRemaining > 0 && suggestions.length > 0) {
      setHintsRemaining((prev) => prev - 1);
      setShowSuggestions(true);
    }
  };

  const handleMoveClick = (index: number) => {
    setCurrentMoveIndex(index);
  };

  const handleViewAnalysis = () => {
    navigate(`/analysis/${gameId}`);
  };

  const gameStats: GameStats = {
    totalMoves: moveCount,
    gameTime: formatGameTime(gameTime),
    accuracy: Math.floor(Math.random() * 20) + 75,
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="game-board-page">
        <Header />
        <div className="game-loading">
          <p>Loading game...</p>
        </div>
      </div>
    );
  }

  // Show error if game not found
  if (fetchError) {
    return (
      <div className="game-board-page">
        <Header />
        <div className="game-error">
          <p>Failed to load game. Please try again.</p>
          <button onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="game-board-page">
        <Header onNavigationAttempt={handleHeaderNavigation} />
        <ConnectionStatus />

        <div className="game-board-page-header">
          <div className="page-header-content">
            <GameStatusIndicator
              currentTurn={currentPlayer}
              moveCount={moveCount}
              gameTime={formatGameTime(gameTime)}
              isGameActive={isGameActive}
              agingEnabled={agingEnabled}
              maxAge={maxAge}
            />
            <QuickActionsMenu
              onNewGame={handleNewGame}
              isGameActive={isGameActive}
            />
          </div>
        </div>

        <main className="game-content">
          {error && (
            <div className="game-error-message">
              <span>{error}</span>
            </div>
          )}

          <div className="game-main">
            <GameGrid
              board={board}
              onCellClick={handleCellClick}
              winningLine={winningLine}
              isGameOver={!isGameActive}
              isAiThinking={isAiThinking}
              cellAging={cellAging}
              expiredCells={expiredCells}
            />

            <GameControls
              onHint={handleHint}
              onNewGame={handleNewGame}
              onLeaveGame={handleLeaveGame}
              isGameOver={!isGameActive}
              hintsRemaining={hintsRemaining}
            />
          </div>

          <div className="game-sidebar">
            <MoveHistory
              moves={moves}
              onMoveClick={handleMoveClick}
              currentMoveIndex={currentMoveIndex}
            />
          </div>
        </main>

        <AiSuggestionPanel
          suggestions={suggestions}
          isVisible={showSuggestions}
          onToggle={() => setShowSuggestions(!showSuggestions)}
          isAiThinking={isAiThinking}
        />

        <LeaveGameConfirmationModal
          isOpen={showLeaveModal}
          targetRoute={pendingNavigation}
          isAiThinking={isAiThinking}
          onConfirm={handleConfirmLeave}
          onCancel={handleCancelLeave}
        />

        <GameResultModal
          isOpen={showResultModal}
          result={gameResult}
          onClose={() => setShowResultModal(false)}
          onNewGame={handleNewGame}
          onViewAnalysis={handleViewAnalysis}
          gameStats={gameStats}
        />
      </div>
    </>
  );
};

export default GameBoard;
