import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/ui/Header";
import GameStatusIndicator from "../../components/ui/GameStatusIndicator";
import QuickActionsMenu from "../../components/ui/QuickActionsMenu";
import BreadcrumbContext from "../../components/ui/BreadcrumbContext";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import GameBoard from "./components/GameBoard";
import MoveTimeline from "./components/MoveTimeline";
import AnalysisPanel from "./components/AnalysisPanel";
import ReplayControls from "./components/ReplayControls";
import PerformanceMetrics from "./components/PerformanceMetrics";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import { useGameAnalysis } from "../../hooks/useGames";
import type { Move } from "./types";
import "./gameAnalysis.css";

const GameAnalysis = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("board");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch game analysis
  const { data: gameData, isLoading, error } = useGameAnalysis(gameId);

  // Move useEffect BEFORE any conditional returns to follow React Rules of Hooks
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Guard clause: only set up interval if we have data and are not loading
    if (!gameData || isLoading) return;

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
  }, [isPlaying, currentMoveIndex, gameData, isLoading]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="game-analysis-page">
        <Header />
        <GameStatusIndicator
          currentTurn="Loading"
          moveCount={0}
          gameTime="00:00:00"
          isGameActive={false}
        />
        <main className="page-analysis-main">
          <div className="page-analysis-container">
            <div className="analysis-loading-state">
              <LoadingSpinner size="large" message="Generating analysis with AI..." />
              <p className="loading-subtext">This may take a moment</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error || !gameData) {
    return (
      <div className="game-analysis-page">
        <Header />
        <main className="page-analysis-main">
          <div className="page-analysis-container">
            <div className="analysis-error-state">
              <Icon name="AlertTriangle" size={48} strokeWidth={2} />
              <p className="error-text">Failed to load analysis</p>
              <p className="error-subtext">
                {(error as any)?.message || "Please try again"}
              </p>
              <div className="error-actions">
                <Button
                  variant="primary"
                  iconName="RotateCcw"
                  iconPosition="left"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
                <Button
                  variant="outline"
                  iconName="ArrowLeft"
                  iconPosition="left"
                  onClick={() => navigate("/dashboard")}
                >
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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

  const handleNewGame = () => {
    navigate("/dashboard");
  };

  const currentMove: Move | undefined = gameData.moves[currentMoveIndex];
  const winningLine: number[] | null =
    currentMoveIndex === gameData.moves.length - 1
      ? gameData.winningLine || null
      : null;

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

        <main className="page-analysis-main">
          <div className="page-analysis-container">
            <div className="page-analysis-header">
              <div className="page-analysis-header-content">
                <div className="page-analysis-title-row">
                  <h1 className="page-analysis-title">Game Analysis</h1>
                  {gameData?.cached && (
                    <span className="analysis-cached-badge">
                      <Icon name="CheckCircle2" size={14} strokeWidth={2.5} />
                      Cached
                    </span>
                  )}
                </div>
                <div className="page-analysis-game-info">
                  <div className="page-analysis-info-item">
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
                  <div className="page-analysis-info-item">
                    <Icon name="Clock" size={16} strokeWidth={2} />
                    <span>{gameData?.duration}</span>
                  </div>
                  <div
                    className={`page-analysis-info-item result ${gameData?.result}`}
                  >
                    <Icon
                      name={gameData?.result === "win" ? "Trophy" : "Award"}
                      size={16}
                      strokeWidth={2}
                    />
                    <span>{gameData?.result?.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <div className="page-analysis-header-actions">
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

            <div className="page-analysis-mobile-tabs">
              <button
                className={`page-analysis-tab-button ${
                  activeTab === "board" ? "active" : ""
                }`}
                onClick={() => setActiveTab("board")}
              >
                <Icon name="Grid3x3" size={18} strokeWidth={2} />
                <span>Board</span>
              </button>
              <button
                className={`page-analysis-tab-button ${
                  activeTab === "timeline" ? "active" : ""
                }`}
                onClick={() => setActiveTab("timeline")}
              >
                <Icon name="List" size={18} strokeWidth={2} />
                <span>Timeline</span>
              </button>
              <button
                className={`page-analysis-tab-button ${
                  activeTab === "analysis" ? "active" : ""
                }`}
                onClick={() => setActiveTab("analysis")}
              >
                <Icon name="BarChart3" size={18} strokeWidth={2} />
                <span>Analysis</span>
              </button>
            </div>

            <div className="page-analysis-content">
              <div
                className={`page-analysis-content-section page-analysis-board-section ${
                  activeTab === "board" ? "active" : ""
                }`}
              >
                <GameBoard
                  boardState={currentMove?.boardState}
                  currentMoveIndex={currentMoveIndex}
                  winningLine={winningLine}
                  allMoves={gameData?.moves}
                  maxMoveAge={gameData?.agingMetrics?.maxAge}
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
                className={`page-analysis-content-section timeline-section ${
                  activeTab === "timeline" ? "active" : ""
                }`}
              >
                <MoveTimeline
                  moves={gameData?.moves}
                  currentMoveIndex={currentMoveIndex}
                  onMoveSelect={handleMoveSelect}
                  maxAge={gameData?.agingMetrics?.maxAge}
                />
              </div>

              <div
                className={`page-analysis-analysis-section ${
                  activeTab === "analysis" ? "active" : ""
                }`}
              >
                <AnalysisPanel currentMove={currentMove} />
              </div>

              <div
                className={`metrics-section ${
                  activeTab === "analysis" ? "active" : ""
                }`}
              >
                <PerformanceMetrics metrics={gameData?.performanceMetrics} />
              </div>
            </div>
          </div>
        </main>

        <QuickActionsMenu onNewGame={handleNewGame} isGameActive={false} />
      </div>
    </>
  );
};

export default GameAnalysis;
