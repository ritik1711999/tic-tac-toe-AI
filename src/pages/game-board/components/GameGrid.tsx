import Icon from "../../../components/AppIcon";
import type { Player } from "../types";
import "./styles/GameGrid.css";

interface GameGridProps {
  board: (Player | null)[];
  onCellClick: (index: number) => void;
  winningLine: number[] | null;
  isGameOver: boolean;
  isAiThinking: boolean;
  cellAging?: Map<number, { age: number; expiresIn: number }>;
  expiredCells?: Set<number>;
  highlightedHintCell?: number | null;
}

const GameGrid = ({
  board,
  onCellClick,
  winningLine,
  isGameOver,
  isAiThinking,
  cellAging,
  expiredCells,
  highlightedHintCell,
}: GameGridProps) => {
  const getCellContent = (value: Player | null, isWinningCell: boolean) => {
    if (!value) return null;

    if (value === "X") {
      return (
        <Icon
          name="X"
          size={36}
          strokeWidth={2.5}
          color={`${isWinningCell ? "white" : "var(--color-secondary)"}`}
        />
      );
    }
    return (
      <Icon
        name="Circle"
        size={36}
        strokeWidth={2.5}
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
          {board?.map((cell, index) => {
            const agingInfo = cellAging?.get(index);
            const isExpired = !!(expiredCells?.has(index) && !cell);
            const isAging = !!agingInfo && agingInfo.expiresIn > 1;
            const isExpiring = !!agingInfo && agingInfo.expiresIn <= 1;
            return (
              <button
                key={index}
                className={`grid-cell ${cell ? "filled" : ""} ${
                  isCellInWinningLine(index) ? "winning" : ""
                } ${isCellClickable(index) ? "clickable" : ""} ${
                  isAging ? "aging" : ""
                } ${isExpiring ? "expiring" : ""} ${
                  isExpired ? "expired" : ""
                } ${index === highlightedHintCell ? "hint-highlight" : ""}`}
                onClick={() => isCellClickable(index) && onCellClick(index)}
                disabled={!isCellClickable(index)}
                aria-label={`Cell ${index + 1}, ${cell || "empty"}`}
              >
                {getCellContent(cell, isCellInWinningLine(index))}
                {agingInfo && cell && !isExpired && (
                  <span className="age-badge">{agingInfo.expiresIn}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default GameGrid;
