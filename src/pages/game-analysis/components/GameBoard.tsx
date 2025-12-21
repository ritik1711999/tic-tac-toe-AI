import Icon from "../../../components/AppIcon";
import "./styles/GameBoard.css";

interface GameBoardProps {
  // boardState: string[];
  boardState: ("X" | "O" | "")[];
  currentMoveIndex: number;
  winningLine: number[] | null;
}

const GameBoard = ({
  boardState,
  currentMoveIndex,
  winningLine,
}: GameBoardProps) => {
  const getCellContent = (value: "X" | "O" | "") => {
    if (!value) return null;

    return (
      <div className={`cell-content ${value?.toLowerCase()}`}>
        {value === "X" ? (
          <Icon name="X" size={48} strokeWidth={3} />
        ) : (
          <Icon name="Circle" size={48} strokeWidth={3} />
        )}
      </div>
    );
  };

  const isWinningCell = (index: number) => {
    return winningLine && winningLine?.includes(index);
  };

  return (
    <>
      <div className="game-board-container">
        <div className="board-header">
          <h2 className="board-title">Game Board</h2>
          <span className="move-indicator">Move {currentMoveIndex + 1}</span>
        </div>

        <div className="game-board">
          {boardState?.map((cell, index) => (
            <div
              key={index}
              className={`board-cell ${cell ? "filled" : ""} ${
                isWinningCell(index) ? "winning" : ""
              }`}
            >
              {getCellContent(cell)}
            </div>
          ))}
        </div>

        <div className="board-legend">
          <div className="legend-item">
            <Icon name="X" size={20} strokeWidth={2.5} />
            <span>Player X</span>
          </div>
          <div className="legend-item">
            <Icon name="Circle" size={20} strokeWidth={2.5} />
            <span>Player O</span>
          </div>
        </div>
      </div>
      {/* <style jsx>{`
        .game-board-container {
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .board-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .board-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-foreground);
          margin: 0;
        }

        .move-indicator {
          font-family: var(--font-data);
          font-size: 0.875rem;
          color: var(--color-muted-foreground);
          padding: 4px 12px;
          background: var(--color-muted);
          border-radius: var(--radius-md);
        }

        .game-board {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          aspect-ratio: 1;
          max-width: 400px;
          margin: 0 auto;
          flex: 1;
        }

        .board-cell {
          background: var(--color-muted);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
          position: relative;
        }

        .board-cell.filled {
          background: var(--color-background);
        }

        .board-cell.winning {
          background: var(--color-success);
          background-opacity: 0.1;
          border-color: var(--color-success);
          animation: pulse 1s ease-in-out infinite;
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

        .cell-content {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .cell-content.x {
          color: var(--color-primary);
        }

        .cell-content.o {
          color: var(--color-secondary);
        }

        .board-legend {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--color-border);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--color-foreground);
        }

        .legend-item:first-child {
          color: var(--color-primary);
        }

        .legend-item:last-child {
          color: var(--color-secondary);
        }

        @media (max-width: 767px) {
          .game-board-container {
            padding: 16px;
          }

          .board-title {
            font-size: 1.125rem;
          }

          .game-board {
            gap: 8px;
            max-width: 100%;
          }

          .board-legend {
            gap: 24px;
            margin-top: 16px;
            padding-top: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .board-cell,
          .board-cell.winning {
            animation: none;
            transition: none;
          }
        }
      `}</style> */}
    </>
  );
};

export default GameBoard;
