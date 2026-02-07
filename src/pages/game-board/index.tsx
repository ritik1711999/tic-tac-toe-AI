import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Header from "../../components/ui/Header";
import GameStatusIndicator from "../../components/ui/GameStatusIndicator";
import QuickActionsMenu from "../../components/ui/QuickActionsMenu";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import GameGrid from "./components/GameGrid";
import AiSuggestionPanel from "./components/AiSuggestionPanel";
import MoveHistory from "./components/MoveHistory";
import GameControls from "./components/GameControls";
import GameResultModal from "./components/GameResultModal";
import LeaveGameConfirmationModal from "./components/LeaveGameConfirmationModal";
import PlayerTimerAvatar from "./components/PlayerTimerAvatar";
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
  const queryClient = useQueryClient();

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

  // === Timer State (chess-clock) ===
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [turnDuration, setTurnDuration] = useState(0);
  const [playerXTime, setPlayerXTime] = useState(0);
  const [playerOTime, setPlayerOTime] = useState(0);
  const [timerActivePlayer, setTimerActivePlayer] = useState<"X" | "O" | null>(
    "X",
  );
  const [gameVs, setGameVs] = useState<"AI" | "Human">("AI");
  const [gameDifficulty, setGameDifficulty] = useState<string>("");
  const [playerAvatar, setPlayerAvatar] = useState<string | undefined>(
    undefined,
  );
  const [playerName, setPlayerName] = useState<string>("You");
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [timeoutLoser, setTimeoutLoser] = useState<"X" | "O" | null>(null);

  // === Leave Game Confirmation Modal ===
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null,
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
        cell === "" ? null : (cell as Player),
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
        // Calculate effective expiration point for this move
        const effExpiresOn =
          m.expiresOnMove ??
          (m.moveNumber ? m.moveNumber + maxAge : totalMoves + maxAge);

        // Check if move is expired based on current total moves
        const isExpired = m.expiredOnMove != null || effExpiresOn <= totalMoves;

        if (isExpired) {
          expired.add(m.position);
        } else {
          const age = Math.max(
            1,
            totalMoves - (m.moveNumber ?? totalMoves) + 1,
          );
          const expiresIn = Math.max(0, effExpiresOn - totalMoves);
          aging.set(m.position, { age, expiresIn });
        }
      });
      setCellAging(aging);
      setExpiredCells(expired);

      // Initialize timer state from game data
      setGameVs(gameData.game.vs || "AI");
      setGameDifficulty(gameData.game.difficulty || "");
      if (gameData.game.timerEnabled) {
        setTimerEnabled(true);
        setTurnDuration(gameData.game.turnDuration || 0);
        // Calculate remaining time accounting for elapsed turn time
        let pxTime = gameData.game.playerXTimeRemaining ?? 0;
        let poTime = gameData.game.playerOTimeRemaining ?? 0;
        if (
          gameData.game.timerLastStartedAt &&
          gameData.game.status === "in-progress"
        ) {
          const elapsed =
            (Date.now() -
              new Date(gameData.game.timerLastStartedAt).getTime()) /
            1000;
          if (gameData.currentPlayer === "X") {
            pxTime = Math.max(0, pxTime - elapsed);
          } else {
            poTime = Math.max(0, poTime - elapsed);
          }
        }
        setPlayerXTime(pxTime);
        setPlayerOTime(poTime);
        setTimerActivePlayer(
          gameData.game.status === "in-progress"
            ? gameData.currentPlayer
            : null,
        );
      }

      // Load player avatar/name from populated user
      if (gameData.game.user) {
        const gameUser = gameData.game.user as any;
        if (gameUser.avatar) setPlayerAvatar(gameUser.avatar);
        if (gameUser.name) setPlayerName(gameUser.name);
      }
      // Also use auth store user info as fallback
      if (user?.avatar) setPlayerAvatar(user.avatar);
      if (user?.name) setPlayerName(user.name || "You");

      // Check if game ended by timeout
      if (gameData.game.timeoutLoser) {
        setIsTimedOut(true);
        setTimeoutLoser(gameData.game.timeoutLoser as "X" | "O");
      }

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
        cell === "" ? null : (cell as Player),
      );

      // Find which position changed
      const placedBy: Player = data.currentPlayer === "X" ? "O" : "X";
      const placedPos = findPlacedPosition(board, newBoard, placedBy);

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
      setIsAiThinking(false);

      // Update move count and add move to history
      setMoveCount((prev) => {
        const newMoveCount = prev + 1;

        // Add move to history with proper tracking
        setMoves((prevMoves) => {
          // Check if this move already exists (prevent duplicates)
          const alreadyExists = prevMoves.some(
            (m) =>
              m.position === placedPos &&
              m.player === placedBy &&
              m.moveNumber === newMoveCount,
          );

          if (alreadyExists) {
            return prevMoves;
          }

          const lastMove: Move = {
            moveNumber: newMoveCount,
            player: placedBy,
            position: placedPos,
            timestamp: new Date().toISOString(),
            isAiMove: false, // Will be set by ai-move event
            expiresOnMove: agingEnabled ? newMoveCount + maxAge : null,
            expiredOnMove: null,
            expiredAt: null,
          };
          return [...prevMoves, lastMove];
        });

        return newMoveCount;
      });
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
      console.log("⏰ Cells expired:", payload);

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
        return prev.map((m) => {
          const expiredInfo = payload.expired.find(
            (e) => e.position === m.position && e.player === m.player,
          );
          if (expiredInfo) {
            return {
              ...m,
              expiredOnMove: moveCount,
              expiredAt: new Date().toISOString(),
            };
          }
          return m;
        });
      });

      // Reset currentMoveIndex if it points to an expired move
      setCurrentMoveIndex((prev) => {
        if (prev === -1) return prev;

        const currentMove = moves[prev];
        if (!currentMove) return -1;

        const isExpired = payload.expired.some(
          (exp) =>
            exp.position === currentMove.position &&
            exp.player === currentMove.player,
        );

        return isExpired ? -1 : prev;
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
        map.set(c.position, { age: c.age, expiresIn: c.expiresIn }),
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

    // Listen for timer updates
    const handleTimerUpdate = (data: {
      gameId: string;
      playerXTimeRemaining: number;
      playerOTimeRemaining: number;
      activePlayer: "X" | "O" | null;
    }) => {
      console.log("⏱️ Timer update:", data);
      setPlayerXTime(data.playerXTimeRemaining);
      setPlayerOTime(data.playerOTimeRemaining);
      setTimerActivePlayer(data.activePlayer);
    };

    // Listen for game timeout
    const handleGameTimeout = (data: {
      gameId: string;
      winner: "X" | "O";
      loser: "X" | "O";
      reason: "timeout";
    }) => {
      console.log("⏰ Game timeout:", data);
      setIsTimedOut(true);
      setTimeoutLoser(data.loser);
      setTimerActivePlayer(null);
      // The game-end event will also fire and handle the result modal
    };

    socket.on("game-update", handleGameUpdate);
    socket.on("ai-move", handleAiMove);
    socket.on("game-end", handleGameOver);
    socket.on("cell-expired", handleCellExpired);
    socket.on("aging-state", handleAgingState);
    socket.on("timer-update", handleTimerUpdate);
    socket.on("game-timeout", handleGameTimeout);
    socket.on("error", handleError);

    // Cleanup listeners on unmount
    return () => {
      socket.off("game-update", handleGameUpdate);
      socket.off("ai-move", handleAiMove);
      socket.off("game-end", handleGameOver);
      socket.off("cell-expired", handleCellExpired);
      socket.off("aging-state", handleAgingState);
      socket.off("timer-update", handleTimerUpdate);
      socket.off("game-timeout", handleGameTimeout);
      socket.off("error", handleError);
    };
  }, [
    socket,
    gameId,
    isConnected,
    user,
    board,
    moveCount,
    agingEnabled,
    maxAge,
    moves,
  ]);

  // Helper function to find which position changed
  const findChangedPosition = (
    oldBoard: (Player | null)[],
    newBoard: (Player | null)[],
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
    placedBy: Player,
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

  const invalidateDashboardCache = () => {
    // Invalidate all dashboard-related queries
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["progression"] });
    queryClient.invalidateQueries({ queryKey: ["games"] });
    queryClient.invalidateQueries({ queryKey: ["achievements"] });
  };

  const handleNewGame = () => {
    // Invalidate dashboard cache before navigating back
    invalidateDashboardCache();
    // Navigate back to dashboard to create a new game
    navigate("/dashboard");
  };

  const handleLeaveGame = () => {
    if (isGameActive) {
      // Show confirmation modal when game is active
      setShowLeaveModal(true);
      setPendingNavigation("/dashboard");
    } else {
      // Invalidate dashboard cache and navigate immediately if game is over
      invalidateDashboardCache();
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

    // Invalidate dashboard cache before navigating back
    if (pendingNavigation === "/dashboard") {
      invalidateDashboardCache();
    }

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
      // Invalidate dashboard cache if navigating to dashboard, then navigate
      if (path === "/dashboard") {
        invalidateDashboardCache();
      }
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
          <LoadingSpinner size="medium" message="Loading game..." />
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
            {/* Timer Players Row */}
            <div className="timer-players-row">
              <PlayerTimerAvatar
                label={playerName || "You"}
                shortLabel={playerName ? playerName.split(" ")[0] : "You"}
                avatar={playerAvatar}
                isAI={false}
                symbol="X"
                timeRemaining={playerXTime}
                totalBudget={turnDuration}
                isActive={timerActivePlayer === "X" && isGameActive}
                timerEnabled={timerEnabled}
                isCurrentUser
              />
              <div className="timer-vs-divider">VS</div>
              <PlayerTimerAvatar
                label={
                  gameVs === "AI"
                    ? `AI (${gameDifficulty || "easy"})`
                    : "Opponent"
                }
                shortLabel={gameVs === "AI" ? "AI" : "Opponent"}
                avatar={undefined}
                isAI={gameVs === "AI"}
                symbol="O"
                timeRemaining={playerOTime}
                totalBudget={turnDuration}
                isActive={timerActivePlayer === "O" && isGameActive}
                timerEnabled={timerEnabled}
                mirrored
              />
            </div>

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
              onViewAnalysis={handleViewAnalysis}
              isGameOver={!isGameActive}
              hintsRemaining={hintsRemaining}
            />
          </div>

          <div className="game-sidebar">
            <MoveHistory
              moves={moves}
              onMoveClick={handleMoveClick}
              currentMoveIndex={currentMoveIndex}
              maxAge={maxAge}
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
          isTimedOut={isTimedOut}
          timeoutLoser={timeoutLoser}
          userSymbol={userSymbol}
        />
      </div>
    </>
  );
};

export default GameBoard;
