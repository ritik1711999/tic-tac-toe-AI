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
        <div className="modal-content" onClick={(e) => e?.stopPropagation()}>
          <button
            className="close-button"
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

          <div className="game-stats">
            <div className="stat-item">
              <Icon name="Move" size={20} strokeWidth={2} />
              <div className="stat-content">
                <span className="stat-label">Total Moves</span>
                <span className="stat-value">{gameStats?.totalMoves}</span>
              </div>
            </div>

            <div className="stat-item">
              <Icon name="Clock" size={20} strokeWidth={2} />
              <div className="stat-content">
                <span className="stat-label">Game Time</span>
                <span className="stat-value">{gameStats?.gameTime}</span>
              </div>
            </div>

            <div className="stat-item">
              <Icon name="Target" size={20} strokeWidth={2} />
              <div className="stat-content">
                <span className="stat-label">Accuracy</span>
                <span className="stat-value">{gameStats?.accuracy}%</span>
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
