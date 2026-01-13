import { useEffect } from "react";
import confetti from "canvas-confetti";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import type { GameResult, GameStats } from "../types";
import "./styles/GameResultModal.css";

interface GameResultModalProps {
  isOpen: boolean;
  result: GameResult;
  onClose: () => void;
  onNewGame: () => void;
  onViewAnalysis: () => void;
  gameStats: GameStats;
}

const GameResultModal = ({
  isOpen,
  result,
  onClose,
  onNewGame,
  onViewAnalysis,
  gameStats,
}: GameResultModalProps) => {
  // Trigger confetti on win
  useEffect(() => {
    if (isOpen && result === "win") {
      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!prefersReducedMotion) {
        // Burst confetti from top of screen
        const confettiConfig = {
          particleCount: 150,
          spread: 70,
          origin: { x: 0.5, y: 0 },
          colors: ["#14b8a6", "#38bdf8", "#facc15", "#f87171", "#a78bfa"],
          zIndex: 1001,
        };

        // Initial burst
        confetti(confettiConfig);

        // Optional: Secondary smaller burst after 200ms for effect
        const timeoutId = setTimeout(() => {
          confetti({
            ...confettiConfig,
            particleCount: 75,
          });
        }, 200);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [isOpen, result]);

  if (!isOpen) return null;

  const getResultIcon = () => {
    if (result === "win") return "Trophy";
    if (result === "lose") return "X";
    return "Minus";
  };

  const getResultTitle = () => {
    if (result === "win") return "Victory!";
    if (result === "lose") return "Defeat";
    return "Draw";
  };

  const getResultMessage = () => {
    if (result === "win") return "Congratulations! You won the game.";
    if (result === "lose") return "Better luck next time!";
    return "Well played! The game ended in a draw.";
  };

  const getResultColor = () => {
    if (result === "win") return "var(--color-success)";
    if (result === "lose") return "var(--color-error)";
    return "var(--color-warning)";
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content"
          data-result={result}
          onClick={(e) => e?.stopPropagation()}
        >
          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <Icon name="X" size={20} strokeWidth={2} />
          </button>

          <div className="result-icon" style={{ color: getResultColor() }}>
            <Icon name={getResultIcon()} size={64} strokeWidth={2} />
          </div>

          <h2 className="result-title">{getResultTitle()}</h2>
          <p className="result-message">{getResultMessage()}</p>

          <div className="modal-game-stats">
            <div className="modal-stat-item">
              <Icon name="Move" size={20} strokeWidth={2} />
              <div className="modal-stat-content">
                <span className="modal-stat-label">Total Moves</span>
                <span className="modal-stat-value">
                  {gameStats?.totalMoves}
                </span>
              </div>
            </div>

            <div className="modal-stat-item">
              <Icon name="Clock" size={20} strokeWidth={2} />
              <div className="modal-stat-content">
                <span className="modal-stat-label">Game Time</span>
                <span className="modal-stat-value">{gameStats?.gameTime}</span>
              </div>
            </div>

            <div className="modal-stat-item">
              <Icon name="Target" size={20} strokeWidth={2} />
              <div className="modal-stat-content">
                <span className="modal-stat-label">Accuracy</span>
                <span className="modal-stat-value">{gameStats?.accuracy}%</span>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <Button
              variant="primary"
              iconName="Plus"
              iconPosition="left"
              onClick={onNewGame}
              fullWidth
            >
              New Game
            </Button>

            <Button
              variant="outline"
              iconName="LineChart"
              iconPosition="left"
              onClick={onViewAnalysis}
              fullWidth
            >
              View Analysis
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameResultModal;
