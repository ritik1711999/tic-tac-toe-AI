import React from "react";
import Icon from "../../../components/AppIcon";

const MoveHistory = ({ moves, onMoveClick, currentMoveIndex }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getPositionNotation = (position) => {
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
          <span className="move-count">{moves?.length} moves</span>
        </div>

        <div className="history-content">
          {moves?.length === 0 ? (
            <div className="empty-state">
              <Icon name="Clock" size={32} strokeWidth={1.5} />
              <p className="empty-text">No moves yet. Start playing!</p>
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
                  <div className="move-number">#{index + 1}</div>
                  <div className="move-details">
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
      <style jsx>{`
        .move-history-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .history-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px;
          background: var(--color-muted);
          border-bottom: 1px solid var(--color-border);
        }

        .history-title {
          flex: 1;
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-foreground);
          margin: 0;
        }

        .move-count {
          font-family: var(--font-data);
          font-size: 0.75rem;
          color: var(--color-muted-foreground);
          padding: 4px 8px;
          background: var(--color-background);
          border-radius: var(--radius-sm);
        }

        .history-content {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 48px 24px;
          color: var(--color-muted-foreground);
        }

        .empty-text {
          font-family: var(--font-body);
          font-size: 0.875rem;
          text-align: center;
          margin: 0;
        }

        .moves-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .move-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid var(--color-border);
          background: var(--color-background);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
        }

        .move-item:hover {
          background: var(--color-muted);
          border-color: var(--color-primary);
        }

        .move-item.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: var(--color-primary-foreground);
        }

        .move-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: var(--color-muted);
          border-radius: var(--radius-sm);
          font-family: var(--font-data);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-foreground);
        }

        .move-item.active .move-number {
          background: var(--color-primary-foreground);
          color: var(--color-primary);
        }

        .move-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .move-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .player-marker {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: var(--color-primary);
          color: var(--color-primary-foreground);
          border-radius: var(--radius-sm);
          font-weight: 600;
        }

        .move-item.active .player-marker {
          background: var(--color-primary-foreground);
          color: var(--color-primary);
        }

        .position-notation {
          font-family: var(--font-data);
          font-weight: 600;
        }

        .move-timestamp {
          font-family: var(--font-data);
          font-size: 0.75rem;
          color: var(--color-muted-foreground);
        }

        .move-item.active .move-timestamp {
          color: var(--color-primary-foreground);
          opacity: 0.8;
        }

        .ai-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: var(--color-secondary);
          color: var(--color-secondary-foreground);
          border-radius: var(--radius-sm);
        }

        .move-item.active .ai-badge {
          background: var(--color-primary-foreground);
          color: var(--color-primary);
        }

        @media (max-width: 767px) {
          .history-header {
            padding: 12px;
          }

          .move-item {
            padding: 10px;
            gap: 8px;
          }

          .move-number {
            width: 28px;
            height: 28px;
            font-size: 0.7rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .move-item {
            transition: none;
          }
        }
      `}</style>
    </>
  );
};

export default MoveHistory;
