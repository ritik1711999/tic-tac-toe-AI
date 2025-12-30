import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import GameStatusIndicator from "../../components/ui/GameStatusIndicator";
import QuickActionsMenu from "../../components/ui/QuickActionsMenu";
import GameGrid from "./components/GameGrid";
import AiSuggestionPanel from "./components/AiSuggestionPanel";
import MoveHistory from "./components/MoveHistory";
import GameControls from "./components/GameControls";
import GameResultModal from "./components/GameResultModal";
import type {
  Player,
  GameResult,
  Move,
  Suggestion,
  GameStats,
  CheckWinnerResult,
} from "./types";
import "./GameBoard.css";

const GameBoard = () => {
  const navigate = useNavigate();

  const [board, setBoard] = useState<(Player | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [isGameActive, setIsGameActive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const [moves, setMoves] = useState<Move[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
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

  useEffect(() => {
    let timer: number;
    if (isGameActive && !isPaused) {
      timer = setInterval(() => {
        setGameTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameActive, isPaused]);

  const formatGameTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const checkWinner = (boardState: (Player | null)[]): CheckWinnerResult => {
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

    for (let line of lines) {
      const [a, b, c] = line;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        return { winner: boardState[a] as Player, line };
      }
    }

    if (boardState.every((cell) => cell !== null)) {
      return { winner: "draw", line: null };
    }

    return { winner: null, line: null };
  };

  const generateAiSuggestions = (
    boardState: (Player | null)[]
  ): Suggestion[] => {
    const emptyCells = boardState
      .map((cell, index) => (cell === null ? index : null))
      .filter((i) => i !== null) as number[];

    if (emptyCells.length === 0) return [];

    const newSuggestions = emptyCells.slice(0, 3).map((position) => {
      const confidence = Math.floor(Math.random() * 30) + 60;
      const strategies = [
        "This move blocks opponent's winning path while creating your own opportunity.",
        "Strategic positioning that maximizes future winning combinations.",
        "Defensive play that prevents immediate loss while maintaining offensive pressure.",
        "Creates a fork opportunity with multiple winning paths.",
      ];
      const moveTypes = [
        "Defensive Block",
        "Strategic Fork",
        "Winning Setup",
        "Counter Attack",
      ];

      return {
        position,
        confidence,
        strategy: strategies[Math.floor(Math.random() * strategies.length)],
        moveType: moveTypes[Math.floor(Math.random() * moveTypes.length)],
      };
    });

    return newSuggestions.sort((a, b) => b.confidence - a.confidence);
  };

  const makeAiMove = useCallback((boardState: (Player | null)[]) => {
    setIsAiThinking(true);

    setTimeout(() => {
      const emptyCells = boardState
        .map((cell, index) => (cell === null ? index : null))
        .filter((i) => i !== null) as number[];

      if (emptyCells.length > 0) {
        const randomIndex =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const newBoard = [...boardState];
        newBoard[randomIndex] = "O";

        const newMove: Move = {
          player: "O",
          position: randomIndex,
          timestamp: new Date().toISOString(),
          isAiMove: true,
        };

        setBoard(newBoard);
        setMoves((prev) => [...prev, newMove]);
        setMoveCount((prev) => prev + 1);
        setCurrentPlayer("X");
        setIsAiThinking(false);

        const result = checkWinner(newBoard);
        if (result.winner) {
          handleGameEnd(result);
        } else {
          setSuggestions(generateAiSuggestions(newBoard));
        }
      }
    }, 1000);
  }, []);

  const handleCellClick = (index: number) => {
    if (
      board[index] ||
      !isGameActive ||
      isPaused ||
      isAiThinking ||
      currentPlayer !== "X"
    )
      return;

    const newBoard = [...board];
    newBoard[index] = "X";

    const newMove: Move = {
      player: "X",
      position: index,
      timestamp: new Date().toISOString(),
      isAiMove: false,
    };

    setBoard(newBoard);
    setMoves((prev) => [...prev, newMove]);
    setMoveCount((prev) => prev + 1);
    setCurrentPlayer("O");

    const result = checkWinner(newBoard);
    if (result.winner) {
      handleGameEnd(result);
    } else {
      makeAiMove(newBoard);
    }
  };

  const handleGameEnd = (result: CheckWinnerResult) => {
    setIsGameActive(false);
    setWinningLine(result.line);

    if (result.winner === "X") {
      setGameResult("win");
    } else if (result.winner === "O") {
      setGameResult("lose");
    } else if (result.winner === "draw") {
      setGameResult("draw");
    }

    setTimeout(() => {
      setShowResultModal(true);
    }, 500);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setIsGameActive(true);
    setIsPaused(false);
    setIsAiThinking(false);
    setMoveCount(0);
    setGameTime(0);
    setHintsRemaining(3);
    setWinningLine(null);
    setGameResult(null);
    setShowResultModal(false);
    setMoves([]);
    setCurrentMoveIndex(-1);
    setSuggestions(generateAiSuggestions(Array(9).fill(null)));
  };

  const handleNewGame = () => {
    handleRestart();
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
    navigate("/game-analysis");
  };

  const gameStats: GameStats = {
    totalMoves: moveCount,
    gameTime: formatGameTime(gameTime),
    accuracy: Math.floor(Math.random() * 20) + 75,
  };

  return (
    <>
      <div className="game-board-page">
        <Header />

        <div className="game-board-page-header">
          <div className="page-header-content">
            <GameStatusIndicator
              currentTurn={currentPlayer}
              moveCount={moveCount}
              gameTime={formatGameTime(gameTime)}
              isGameActive={isGameActive}
            />
            <QuickActionsMenu
              onPauseGame={handlePause}
              onResumeGame={handleResume}
              onRestartGame={handleRestart}
              onNewGame={handleNewGame}
              isGameActive={isGameActive}
              isGamePaused={isPaused}
            />
          </div>
        </div>

        <main className="game-content">
          <div className="game-main">
            <GameGrid
              board={board}
              onCellClick={handleCellClick}
              winningLine={winningLine}
              isGameOver={!isGameActive}
              isAiThinking={isAiThinking}
            />

            <GameControls
              onPause={handlePause}
              onResume={handleResume}
              onRestart={handleRestart}
              onHint={handleHint}
              onNewGame={handleNewGame}
              isPaused={isPaused}
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
