import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const GameResultModal = ({
  isOpen,
  result,
  onClose,
  onNewGame,
  onViewAnalysis,
  gameStats,
}) => {
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
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
          animation: fadeIn var(--transition-fast);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-content {
          position: relative;
          width: 100%;
          max-width: 480px;
          background: var(--color-card);
          border-radius: var(--radius-xl);
          padding: 32px;
          box-shadow: var(--shadow-lg);
          animation: slideUp var(--transition-base);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .close-button {
          position: absolute;
          top: 16px;
          right: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: var(--color-muted-foreground);
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .close-button:hover {
          background: var(--color-muted);
          color: var(--color-foreground);
        }

        .result-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }

        .result-title {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-foreground);
          text-align: center;
          margin: 0 0 12px 0;
        }

        .result-message {
          font-family: var(--font-body);
          font-size: 1rem;
          color: var(--color-muted-foreground);
          text-align: center;
          margin: 0 0 32px 0;
        }

        .game-stats {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
          padding: 20px;
          background: var(--color-muted);
          border-radius: var(--radius-lg);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stat-content {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-label {
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--color-muted-foreground);
        }

        .stat-value {
          font-family: var(--font-data);
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-foreground);
        }

        .modal-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (max-width: 767px) {
          .modal-content {
            padding: 24px;
          }

          .result-title {
            font-size: 1.5rem;
          }

          .game-stats {
            padding: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .modal-overlay,
          .modal-content {
            animation: none;
          }
        }
      `}</style>
    </>
  );
};

export default GameResultModal;
