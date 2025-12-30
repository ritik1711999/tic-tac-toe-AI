import Icon from "../../../components/AppIcon";
import type { Move } from "../types";
import "./styles/MoveHistory.css";

interface MoveHistoryProps {
  moves: Move[];
  onMoveClick: (index: number) => void;
  currentMoveIndex: number;
}

const MoveHistory = ({
  moves,
  onMoveClick,
  currentMoveIndex,
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

  return (
    <>
      <div className="move-history-container">
        <div className="history-header">
          <Icon name="History" size={20} strokeWidth={2} />
          <h3 className="history-title">Move History</h3>
          <span className="history-move-count">{moves?.length} moves</span>
        </div>

        <div className="history-content">
          {moves?.length === 0 ? (
            <div className="history-empty-state">
              <Icon name="Clock" size={32} strokeWidth={1.5} />
              <p className="history-empty-text">No moves yet. Start playing!</p>
            </div>
          ) : (
            <div className="moves-list">
              {moves?.map((move, index) => (
                <button
                  key={index}
                  className={`move-item ${
                    currentMoveIndex === index ? "active" : ""
                  }`}
                  onClick={() => onMoveClick(index)}
                >
                  <div className="history-move-number">#{index + 1}</div>
                  <div className="history-move-details">
                    <div className="move-info">
                      <span className="player-marker">{move?.player}</span>
                      <Icon name="ArrowRight" size={14} strokeWidth={2} />
                      <span className="position-notation">
                        {getPositionNotation(move?.position)}
                      </span>
                    </div>
                    <span className="move-timestamp">
                      {formatTimestamp(move?.timestamp)}
                    </span>
                  </div>
                  {move?.isAiMove && (
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
