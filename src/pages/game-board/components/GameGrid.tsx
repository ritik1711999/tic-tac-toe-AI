import Icon from "../../../components/AppIcon";
import type { Player } from "../types";
import "./styles/GameGrid.css";

interface GameGridProps {
  board: (Player | null)[];
  onCellClick: (index: number) => void;
  winningLine: number[] | null;
  isGameOver: boolean;
  isAiThinking: boolean;
}

const GameGrid = ({
  board,
  onCellClick,
  winningLine,
  isGameOver,
  isAiThinking,
}: GameGridProps) => {
  const getCellContent = (value: Player | null, isWinningCell: boolean) => {
    if (!value) return null;

    return value === "X" ? (
      <Icon
        name="X"
        size={48}
        strokeWidth={3}
        color={`${isWinningCell ? "white" : "var(--color-secondary)"}`}
      />
    ) : (
      <Icon
        name="Circle"
        size={48}
        strokeWidth={3}
        color={`${isWinningCell ? "white" : "var(--color-secondary)"}`}
      />
    );
  };

  const isCellInWinningLine = (index: number): boolean => {
    return winningLine ? winningLine.includes(index) : false;
  };

  const isCellClickable = (index: number): boolean => {
    return !board[index] && !isGameOver && !isAiThinking;
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
              {getCellContent(cell, isCellInWinningLine(index))}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default GameGrid;
