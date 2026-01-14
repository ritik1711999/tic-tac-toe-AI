import { useMemo } from "react";
import Icon from "../../../components/AppIcon";
import type { Move } from "../types";
import "./styles/MoveHistory.css";

interface MoveHistoryProps {
  moves: Move[];
  onMoveClick: (index: number) => void;
  currentMoveIndex: number;
  maxAge?: number;
}

const MoveHistory = ({
  moves,
  onMoveClick,
  currentMoveIndex,
  maxAge = 5,
}: MoveHistoryProps) => {
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getPositionNotation = (position: number): string => {
    const row = Math.floor(position / 3) + 1;
    const col = (position % 3) + 1;
    return `${row}${col}`;
  };

  // Calculate expiration status dynamically for all moves
  const processedMoves = useMemo(() => {
    const totalMoves = moves.length;

    // Process all moves with expiration status
    const allProcessed = moves.map((move, index) => {
      // Calculate effective expiration point for this move
      const effExpiresOn =
        move.expiresOnMove ??
        (move.moveNumber ? move.moveNumber + maxAge : totalMoves + maxAge);

      // Check if move is expired (already marked or past expiration point)
      const isExpired =
        move.expiredOnMove != null || effExpiresOn <= totalMoves;

      return {
        ...move,
        originalIndex: index, // Store original position for move tracking
        isExpired,
        effExpiresOn,
        expiresIn: Math.max(0, effExpiresOn - totalMoves),
      };
    });

    // Filter out expired moves and reverse order (latest first)
    return allProcessed.filter((m) => !m.isExpired).reverse();
  }, [moves, maxAge]);

  return (
    <>
      <div className="move-history-container">
        <div className="history-header">
          <Icon name="History" size={20} strokeWidth={2} />
          <h3 className="history-title">Move History</h3>
          <span className="history-move-count">
            {processedMoves?.length} live
          </span>
        </div>

        <div className="history-content">
          {processedMoves?.length === 0 ? (
            <div className="history-empty-state">
              <Icon name="Clock" size={32} strokeWidth={1.5} />
              <p className="history-empty-text">
                {moves?.length === 0
                  ? "No moves yet. Start playing!"
                  : "All moves expired"}
              </p>
            </div>
          ) : (
            <div className="moves-list">
              {processedMoves?.map((processedMove, displayIndex) => (
                <button
                  key={processedMove.originalIndex}
                  className={`move-item ${
                    currentMoveIndex === processedMove.originalIndex
                      ? "active"
                      : ""
                  }`}
                  onClick={() => onMoveClick(processedMove.originalIndex)}
                >
                  <div className="history-move-number">
                    #
                    {processedMove.moveNumber ||
                      processedMove.originalIndex + 1}
                  </div>
                  <div className="history-move-details">
                    <div className="move-info">
                      <span className="player-marker">
                        {processedMove?.player}
                      </span>
                      <Icon name="ArrowRight" size={14} strokeWidth={2} />
                      <span className="position-notation">
                        {getPositionNotation(processedMove?.position)}
                      </span>
                    </div>
                    <span className="move-timestamp">
                      {formatTimestamp(processedMove?.timestamp)}
                      {processedMove.expiresIn > 0 &&
                        ` (expires in ${processedMove.expiresIn})`}
                    </span>
                  </div>
                  {processedMove?.isAiMove && (
                    <div className="ai-badge">
                      <Icon name="Bot" size={12} strokeWidth={2} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MoveHistory;
