import Icon from "../../../components/AppIcon";
import "./styles/GameBoard.css";
import type { Move } from "../types";

interface GameBoardProps {
  boardState: ("X" | "O" | "")[];
  currentMoveIndex: number;
  winningLine: number[] | null;
  allMoves?: Move[];
  maxMoveAge?: number;
}

interface CellState {
  isActive: boolean;
  isExpired: boolean;
  isExpiring: boolean;
  moveNumber: number;
  moveAge: number;
  expiresAt: number | null;
}

const GameBoard = ({
  boardState,
  currentMoveIndex,
  winningLine,
  allMoves = [],
}: GameBoardProps) => {
  /**
   * Calculate the state of each cell based on move history
   * Tracks when moves were placed and when they expired
   *
   * Key insight: Each Move has a `position` field indicating which cell was played.
   * We need to find the move that placed a symbol in this specific cell and check
   * if that move has expired.
   */
  const calculateCellState = (cellIndex: number): CellState => {
    const state: CellState = {
      isActive: false,
      isExpired: false,
      isExpiring: false,
      moveNumber: 0,
      moveAge: 0,
      expiresAt: null,
    };

    if (!allMoves || allMoves.length === 0) return state;

    // Find the most recent move that placed a symbol in THIS specific cell
    // We need to check moves up to currentMoveIndex to find who placed in this cell
    for (let i = currentMoveIndex; i >= 0; i--) {
      const move = allMoves[i];

      // Check if this move placed a symbol in the target cell
      // The position field (converted to number) tells us which cell was played
      const movePosition =
        typeof move.position === "string"
          ? parseInt(move.position, 10)
          : move.position;

      if (movePosition === cellIndex) {
        // This move placed a symbol in this cell

        // Check if this move has already expired at the current move index
        if (
          move.expiredOnMove != null &&
          move.expiredOnMove <= currentMoveIndex
        ) {
          // Move has expired - cell is now empty, return default state
          return state;
        }

        // Move hasn't expired yet, this is a valid occupant
        state.moveNumber = move.moveNumber;
        state.moveAge = currentMoveIndex - i;

        // Check if it's expiring soon (warning state)
        if (move.expiresOnMove != null) {
          state.expiresAt = move.expiresOnMove;
          const movesUntilExpiry = move.expiresOnMove - currentMoveIndex;
          state.isExpiring = movesUntilExpiry <= 2 && movesUntilExpiry > 0;
        }

        // Cell is currently occupied with a non-expired move
        state.isActive = Boolean(boardState && boardState[cellIndex]);
        return state;
      }
    }

    // No move found that placed in this cell
    return state;
  };

  const getCellContent = (
    value: "X" | "O" | "",
    isWinningCell: boolean,
    cellState: CellState,
  ) => {
    if (!value) return null;

    return (
      <div
        className={`cell-content ${value?.toLowerCase()} ${
          cellState.isExpired ? "expired" : ""
        }`}
      >
        {value === "X" ? (
          <Icon
            name="X"
            size={30}
            strokeWidth={2.4}
            color={isWinningCell ? "white" : undefined}
          />
        ) : (
          <Icon
            name="Circle"
            size={30}
            strokeWidth={2.4}
            color={isWinningCell ? "white" : undefined}
          />
        )}
        {/* Show move age indicator on cells */}
        {cellState.moveAge > 0 && (
          <div
            className="cell-age-badge"
            title={`Move #${cellState.moveNumber}`}
          >
            {cellState.moveAge}
          </div>
        )}
      </div>
    );
  };

  const isWinningCell = (index: number) => {
    return winningLine ? winningLine.includes(index) : false;
  };

  return (
    <>
      <div className="game-board-container">
        <div className="board-header">
          <h2 className="board-title">Game Board</h2>
          <span className="move-indicator">Move {currentMoveIndex + 1}</span>
        </div>

        <div className="game-board">
          {boardState?.map((cell, index) => {
            const cellState = calculateCellState(index);
            const winning = isWinningCell(index);

            // Cell is visible if:
            // 1. There's content in boardState (cell)
            // 2. We found a valid move that placed it (cellState.moveNumber > 0)
            // 3. That move hasn't expired (!cellState.isExpired which is default false)
            // Note: If move expired, calculateCellState returns default state with moveNumber=0
            const hasValidMove = cellState.moveNumber > 0;
            const isCellVisible = cell && hasValidMove;
            const isCurrentMove =
              hasValidMove && cellState.moveNumber === currentMoveIndex + 1;

            return (
              <div
                key={index}
                className={`board-cell ${isCellVisible ? "filled" : ""} ${
                  winning && isCellVisible ? "winning" : ""
                } ${cellState.isExpiring && isCellVisible ? "expiring-cell" : ""} ${
                  hasValidMove && isCellVisible ? "active-cell" : ""
                } ${isCurrentMove ? "current-move" : ""}`}
                data-move-age={cellState.moveAge}
                data-move-number={cellState.moveNumber}
              >
                {isCellVisible && getCellContent(cell, winning, cellState)}
              </div>
            );
          })}
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
          <div className="legend-divider">•</div>
          <div className="legend-item lifecycle">
            <div className="lifecycle-badge active"></div>
            <span>Active</span>
          </div>
          <div className="legend-item lifecycle">
            <div className="lifecycle-badge expiring"></div>
            <span>Expiring</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameBoard;
