import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import GameStatusIndicator from "../../components/ui/GameStatusIndicator";
import QuickActionsMenu from "../../components/ui/QuickActionsMenu";
import BreadcrumbContext from "../../components/ui/BreadcrumbContext";
import GameBoard from "./components/GameBoard";
import MoveTimeline from "./components/MoveTimeline";
import AnalysisPanel from "./components/AnalysisPanel";
import ReplayControls from "./components/ReplayControls";
import PerformanceMetrics from "./components/PerformanceMetrics";
import ExportOptions from "./components/ExportOptions";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import type { GameData, Move } from "./types";
import "./gameAnalysis.css";

const GameAnalysis = () => {
  const navigate = useNavigate();
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("board");
  // const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const gameData: GameData = {
    id: "GA-2025-001",
    title: "Player X vs AI (Hard)",
    date: "2025-12-19T10:30:00",
    result: "win",
    duration: "00:03:45",
    moves: [
      {
        moveNumber: 1,
        player: "X",
        position: "Center (5)",
        timestamp: "2025-12-19T10:30:15",
        quality: "excellent",
        score: 95,
        aiRecommendation:
          "Excellent opening move. Center control is optimal in tic-tac-toe strategy.",
        reasoning:
          "Taking the center position provides maximum flexibility for future moves and controls the most winning lines (4 possible lines through center).",
        alternativeMove: null,
        outcomes: { win: 65, draw: 30, loss: 5 },
        boardState: ["", "", "", "", "X", "", "", "", ""],
      },
      {
        moveNumber: 2,
        player: "O",
        position: "Top Left (1)",
        timestamp: "2025-12-19T10:30:22",
        quality: "good",
        score: 80,
        aiRecommendation:
          "Solid defensive move. Corner positions are strategically valuable.",
        reasoning:
          "Corner placement forces opponent to respond and maintains multiple winning possibilities. This move blocks potential X strategies while creating offensive opportunities.",
        alternativeMove: "Top Right (3) - 85% score",
        outcomes: { win: 45, draw: 40, loss: 15 },
        boardState: ["O", "", "", "", "X", "", "", "", ""],
      },
      {
        moveNumber: 3,
        player: "X",
        position: "Bottom Right (9)",
        timestamp: "2025-12-19T10:30:35",
        quality: "excellent",
        score: 92,
        aiRecommendation:
          "Perfect continuation. Creates diagonal threat while maintaining center control.",
        reasoning:
          "This move establishes a strong diagonal line from top-left to bottom-right, forcing O to defend while X maintains offensive pressure with multiple winning paths.",
        alternativeMove: null,
        outcomes: { win: 70, draw: 25, loss: 5 },
        boardState: ["O", "", "", "", "X", "", "", "", "X"],
      },
      {
        moveNumber: 4,
        player: "O",
        position: "Top Right (3)",
        timestamp: "2025-12-19T10:30:48",
        quality: "suboptimal",
        score: 55,
        aiRecommendation:
          "Defensive move needed. Should have blocked the diagonal threat.",
        reasoning:
          "While this move creates a potential winning line, it fails to address X's immediate diagonal threat. A more defensive approach would have been strategically superior.",
        alternativeMove: "Middle Left (4) - 75% score",
        outcomes: { win: 25, draw: 35, loss: 40 },
        boardState: ["O", "", "O", "", "X", "", "", "", "X"],
      },
      {
        moveNumber: 5,
        player: "X",
        position: "Top Middle (2)",
        timestamp: "2025-12-19T10:31:05",
        quality: "excellent",
        score: 98,
        aiRecommendation:
          "Game-winning move. Completes the diagonal and secures victory.",
        reasoning:
          "This move completes the diagonal line from top-left to bottom-right, creating an unstoppable winning position. O has no defensive response available.",
        alternativeMove: null,
        outcomes: { win: 100, draw: 0, loss: 0 },
        boardState: ["O", "X", "O", "", "X", "", "", "", "X"],
      },
    ],
    performanceMetrics: {
      overallScore: 84,
      breakdown: {
        excellent: 3,
        good: 1,
        suboptimal: 1,
        mistakes: 0,
      },
      keyMoments: [
        {
          moveNumber: 1,
          description:
            "Strong opening with center control establishing board dominance",
        },
        {
          moveNumber: 3,
          description:
            "Created winning diagonal threat forcing opponent into defensive position",
        },
        {
          moveNumber: 5,
          description:
            "Capitalized on opponent's defensive error to secure victory",
        },
      ],
    },
  };

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Start new interval if playing and not at the end
    if (isPlaying && currentMoveIndex < gameData.moves.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentMoveIndex((prev) => {
          if (prev >= gameData.moves.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, currentMoveIndex, gameData.moves.length]);

  const handleMoveSelect = (index: number) => {
    setCurrentMoveIndex(index);
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleFirst = () => {
    setCurrentMoveIndex(0);
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handlePrevious = () => {
    if (currentMoveIndex > 0) {
      setCurrentMoveIndex(currentMoveIndex - 1);
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const handleNext = () => {
    if (currentMoveIndex < gameData.moves.length - 1) {
      setCurrentMoveIndex(currentMoveIndex + 1);
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const handleLast = () => {
    setCurrentMoveIndex(gameData.moves.length - 1);
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting game analysis as ${format}`);
  };

  const handleNewGame = () => {
    navigate("/game-board");
  };

  const currentMove: Move | undefined = gameData.moves[currentMoveIndex];
  const winningLine: number[] | null =
    currentMoveIndex === gameData.moves.length - 1 ? [0, 4, 8] : null;

  return (
    <>
      <div className="game-analysis-page">
        <Header />
        <GameStatusIndicator
          currentTurn="Analysis"
          moveCount={gameData?.moves?.length}
          gameTime={gameData?.duration}
          isGameActive={false}
        />
        <BreadcrumbContext
          gameTitle={gameData?.title}
          gameDate={gameData?.date}
          gameId={gameData?.id}
          showBackButton={true}
        />

        <main className="analysis-main">
          <div className="analysis-container">
            <div className="analysis-header">
              <div className="header-content">
                <h1 className="page-title">Game Analysis</h1>
                <div className="game-info">
                  <div className="info-item">
                    <Icon name="Calendar" size={16} strokeWidth={2} />
                    <span>
                      {new Date(gameData.date)?.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="info-item">
                    <Icon name="Clock" size={16} strokeWidth={2} />
                    <span>{gameData?.duration}</span>
                  </div>
                  <div className={`info-item result ${gameData?.result}`}>
                    <Icon
                      name={gameData?.result === "win" ? "Trophy" : "Award"}
                      size={16}
                      strokeWidth={2}
                    />
                    <span>{gameData?.result?.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <div className="header-actions">
                <ExportOptions gameData={gameData} onExport={handleExport} />
                <Button
                  variant="primary"
                  onClick={handleNewGame}
                  iconName="Plus"
                  iconPosition="left"
                >
                  New Game
                </Button>
              </div>
            </div>

            <div className="mobile-tabs">
              <button
                className={`tab-button ${
                  activeTab === "board" ? "active" : ""
                }`}
                onClick={() => setActiveTab("board")}
              >
                <Icon name="Grid3x3" size={18} strokeWidth={2} />
                <span>Board</span>
              </button>
              <button
                className={`tab-button ${
                  activeTab === "timeline" ? "active" : ""
                }`}
                onClick={() => setActiveTab("timeline")}
              >
                <Icon name="List" size={18} strokeWidth={2} />
                <span>Timeline</span>
              </button>
              <button
                className={`tab-button ${
                  activeTab === "analysis" ? "active" : ""
                }`}
                onClick={() => setActiveTab("analysis")}
              >
                <Icon name="BarChart3" size={18} strokeWidth={2} />
                <span>Analysis</span>
              </button>
            </div>

            <div className="analysis-content">
              <div
                className={`content-section board-section ${
                  activeTab === "board" ? "active" : ""
                }`}
              >
                <GameBoard
                  boardState={currentMove?.boardState}
                  currentMoveIndex={currentMoveIndex}
                  winningLine={winningLine}
                />
                <ReplayControls
                  currentMoveIndex={currentMoveIndex}
                  totalMoves={gameData?.moves?.length}
                  onFirst={handleFirst}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onLast={handleLast}
                  isPlaying={isPlaying}
                  onPlayPause={handlePlayPause}
                />
              </div>

              <div
                className={`content-section timeline-section ${
                  activeTab === "timeline" ? "active" : ""
                }`}
              >
                <MoveTimeline
                  moves={gameData?.moves}
                  currentMoveIndex={currentMoveIndex}
                  onMoveSelect={handleMoveSelect}
                />
              </div>

              <div
                className={`content-section analysis-section ${
                  activeTab === "analysis" ? "active" : ""
                }`}
              >
                <AnalysisPanel currentMove={currentMove} />
                <PerformanceMetrics metrics={gameData?.performanceMetrics} />
              </div>
            </div>
          </div>
        </main>

        <QuickActionsMenu
          onNewGame={handleNewGame}
          isGameActive={false}
          onPauseGame={() => {}}
          onResumeGame={() => {}}
          onRestartGame={handleNewGame}
        />
      </div>
    </>
  );
};

export default GameAnalysis;
