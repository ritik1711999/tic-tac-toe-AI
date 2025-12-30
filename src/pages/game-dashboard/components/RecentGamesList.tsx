import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import type { RecentGame } from "../types";
import "./styles/RecentGamesList.css";

const RecentGamesList = () => {
  const navigate = useNavigate();

  const recentGames: RecentGame[] = [
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

  const getResultIcon = (result: string) => {
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

  const getResultLabel = (result: string) => {
    return result?.charAt(0)?.toUpperCase() + result?.slice(1);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date().getTime();
    const dateObj = date.getTime();
    const diffMs = now - dateObj;
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

  const handleViewAnalysis = (gameId: string) => {
    navigate("/game-analysis", { state: { gameId } });
  };

  const handleViewAllGames = () => {
    navigate("/game-history");
  };

  return (
    <>
      <div className="recent-games-list">
        <div className="list-header">
          <div className="list-header-content">
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
                    <div className="game-info-item">
                      <Icon name="Bot" size={14} strokeWidth={2} />
                      <span>{game?.opponent}</span>
                    </div>
                    <div className="game-info-item">
                      <Icon name="Move" size={14} strokeWidth={2} />
                      <span>{game?.moves} moves</span>
                    </div>
                    <div className="game-info-item">
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
    </>
  );
};

export default RecentGamesList;
