import React from "react";
import Icon from "../../../components/AppIcon";

const GameGrid = ({
  board,
  onCellClick,
  winningLine,
  isGameOver,
  currentPlayer,
  isAiThinking,
}) => {
  const getCellContent = (value) => {
    if (!value) return null;

    return value === "X" ? (
      <Icon name="X" size={48} strokeWidth={3} color="var(--color-primary)" />
    ) : (
      <Icon
        name="Circle"
        size={48}
        strokeWidth={3}
        color="var(--color-secondary)"
      />
    );
  };

  const isCellInWinningLine = (index) => {
    return winningLine && winningLine?.includes(index);
  };

  const isCellClickable = (index) => {
    return !board?.[index] && !isGameOver && !isAiThinking;
  };

  return (
    <>
      <div className="game-grid-container">
        <div className="game-grid">
          {board?.map((cell, index) => (
            <button
              key={index}
              className={`grid-cell ${cell ? "filled" : ""} ${
                isCellInWinningLine(index) ? "winning" : ""
              } ${isCellClickable(index) ? "clickable" : ""}`}
              onClick={() => isCellClickable(index) && onCellClick(index)}
              disabled={!isCellClickable(index)}
              aria-label={`Cell ${index + 1}, ${cell || "empty"}`}
            >
              {getCellContent(cell)}
            </button>
          ))}
        </div>
      </div>
      <style jsx>{`
        .game-grid-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px;
        }

        .game-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          max-width: 480px;
          width: 100%;
          aspect-ratio: 1;
        }

        .grid-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-card);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-fast);
          position: relative;
          overflow: hidden;
        }

        .grid-cell::before {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--color-muted);
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .grid-cell.clickable:hover::before {
          opacity: 0.5;
        }

        .grid-cell.clickable:hover {
          border-color: var(--color-primary);
          transform: scale(1.02);
        }

        .grid-cell.filled {
          cursor: not-allowed;
        }

        .grid-cell.winning {
          background: var(--color-success);
          border-color: var(--color-success);
          animation: pulse 0.6s ease-in-out;
        }

        .grid-cell:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .grid-cell:focus-visible {
          outline: 3px solid var(--color-ring);
          outline-offset: 2px;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @media (max-width: 767px) {
          .game-grid-container {
            padding: 16px;
          }

          .game-grid {
            gap: 8px;
            max-width: 360px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .grid-cell,
          .grid-cell::before {
            transition: none;
            animation: none;
          }
        }
      `}</style>
    </>
  );
};

export default GameGrid;
