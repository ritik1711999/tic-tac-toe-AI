import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const RecentGamesList = () => {
  const navigate = useNavigate();

  const recentGames = [
    {
      id: "G2025127",
      opponent: "AI - Hard",
      result: "win",
      moves: 7,
      duration: "2m 34s",
      timestamp: new Date("2025-12-19T09:30:00"),
      winningPattern: "Diagonal",
    },
    {
      id: "G2025126",
      opponent: "AI - Medium",
      result: "win",
      moves: 9,
      duration: "3m 12s",
      timestamp: new Date("2025-12-19T08:15:00"),
      winningPattern: "Top Row",
    },
    {
      id: "G2025125",
      opponent: "AI - Hard",
      result: "loss",
      moves: 8,
      duration: "2m 48s",
      timestamp: new Date("2025-12-18T22:45:00"),
      winningPattern: "Middle Column",
    },
    {
      id: "G2025124",
      opponent: "AI - Expert",
      result: "draw",
      moves: 9,
      duration: "4m 05s",
      timestamp: new Date("2025-12-18T21:30:00"),
      winningPattern: "Draw",
    },
    {
      id: "G2025123",
      opponent: "AI - Medium",
      result: "win",
      moves: 6,
      duration: "2m 10s",
      timestamp: new Date("2025-12-18T20:15:00"),
      winningPattern: "Left Column",
    },
  ];

  const getResultIcon = (result) => {
    switch (result) {
      case "win":
        return { name: "Trophy", color: "var(--color-success)" };
      case "loss":
        return { name: "X", color: "var(--color-error)" };
      case "draw":
        return { name: "Minus", color: "var(--color-muted-foreground)" };
      default:
        return { name: "Circle", color: "var(--color-muted-foreground)" };
    }
  };

  const getResultLabel = (result) => {
    return result?.charAt(0)?.toUpperCase() + result?.slice(1);
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return date?.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const handleViewAnalysis = (gameId) => {
    navigate("/game-analysis", { state: { gameId } });
  };

  const handleViewAllGames = () => {
    navigate("/game-history");
  };

  return (
    <>
      <div className="recent-games-list">
        <div className="list-header">
          <div className="header-content">
            <h3 className="list-title">Recent Games</h3>
            <p className="list-subtitle">Your latest gaming sessions</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="History"
            iconPosition="left"
            onClick={handleViewAllGames}
          >
            View All
          </Button>
        </div>

        <div className="games-container">
          {recentGames?.map((game) => {
            const resultIcon = getResultIcon(game?.result);
            return (
              <div key={game?.id} className="game-item">
                <div
                  className="game-result-badge"
                  style={{ background: `${resultIcon?.color}15` }}
                >
                  <Icon
                    name={resultIcon?.name}
                    size={20}
                    color={resultIcon?.color}
                    strokeWidth={2.5}
                  />
                </div>
                <div className="game-details">
                  <div className="game-header-row">
                    <h4 className="game-id">{game?.id}</h4>
                    <span className={`result-label ${game?.result}`}>
                      {getResultLabel(game?.result)}
                    </span>
                  </div>

                  <div className="game-info-row">
                    <div className="info-item">
                      <Icon name="Bot" size={14} strokeWidth={2} />
                      <span>{game?.opponent}</span>
                    </div>
                    <div className="info-item">
                      <Icon name="Move" size={14} strokeWidth={2} />
                      <span>{game?.moves} moves</span>
                    </div>
                    <div className="info-item">
                      <Icon name="Clock" size={14} strokeWidth={2} />
                      <span>{game?.duration}</span>
                    </div>
                  </div>

                  <div className="game-meta-row">
                    <span className="timestamp">
                      {formatTimestamp(game?.timestamp)}
                    </span>
                    <span className="pattern-badge">
                      {game?.winningPattern}
                    </span>
                  </div>
                </div>
                <div className="game-actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="LineChart"
                    onClick={() => handleViewAnalysis(game?.id)}
                  >
                    Analyze
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        .recent-games-list {
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }

        .list-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }

        .header-content {
          flex: 1;
          min-width: 0;
        }

        .list-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-foreground);
          margin: 0 0 4px 0;
        }

        .list-subtitle {
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--color-muted-foreground);
          margin: 0;
        }

        .games-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .game-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          background: var(--color-muted);
          border-radius: var(--radius-lg);
          transition: transform var(--transition-fast),
            box-shadow var(--transition-fast);
        }

        .game-item:hover {
          transform: translateX(4px);
          box-shadow: var(--shadow-sm);
        }

        .game-result-badge {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          flex-shrink: 0;
        }

        .game-details {
          flex: 1;
          min-width: 0;
        }

        .game-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
        }

        .game-id {
          font-family: var(--font-data);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-foreground);
          margin: 0;
        }

        .result-label {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
        }

        .result-label.win {
          background: var(--color-success);
          background-opacity: 0.1;
          color: var(--color-success);
        }

        .result-label.loss {
          background: var(--color-error);
          background-opacity: 0.1;
          color: var(--color-error);
        }

        .result-label.draw {
          background: var(--color-muted);
          color: var(--color-muted-foreground);
        }

        .game-info-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-body);
          font-size: 0.75rem;
          color: var(--color-muted-foreground);
        }

        .game-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .timestamp {
          font-family: var(--font-body);
          font-size: 0.75rem;
          color: var(--color-muted-foreground);
        }

        .pattern-badge {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--color-primary);
          padding: 2px 8px;
          background: var(--color-primary);
          background-opacity: 0.1;
          border-radius: var(--radius-sm);
        }

        .game-actions {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        @media (max-width: 767px) {
          .recent-games-list {
            padding: 20px;
          }

          .list-header {
            flex-direction: column;
            align-items: stretch;
          }

          .game-item {
            flex-direction: column;
            gap: 12px;
          }

          .game-result-badge {
            align-self: flex-start;
          }

          .game-actions {
            align-self: stretch;
          }

          .game-info-row {
            gap: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .game-item {
            transition: none;
          }

          .game-item:hover {
            transform: none;
          }
        }
      `}</style>
    </>
  );
};

export default RecentGamesList;
