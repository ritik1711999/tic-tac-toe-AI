import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { useRecentGames } from "../../../hooks/useGames";
import type { RecentGame } from "../types";
import "./styles/RecentGamesList.css";

const RecentGamesList = () => {
  const navigate = useNavigate();
  const { data: recentGamesData, isLoading, error } = useRecentGames(20);

  const recentGames: RecentGame[] = recentGamesData?.games || [];

  const getResultIcon = (result: string) => {
    switch (result) {
      case "win":
        return { name: "Trophy", color: "var(--color-success)" };
      case "lose":
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

  const formatGameTitle = (game: RecentGame) => {
    const dateObj = new Date(game.timestamp);
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const yyyy = dateObj.getFullYear();
    const vsType = game.opponent?.toLowerCase().includes("ai")
      ? "vsAI"
      : "vsHuman";
    const idSuffix = game.id?.slice(-4) || "0000";
    return `${dd}${mm}${yyyy}-${vsType}-${idSuffix}`;
  };

  const formatTimestamp = (date: Date | string) => {
    const dateObj = new Date(date);
    const now = new Date().getTime();
    const dateTime = dateObj.getTime();
    const diffMs = now - dateTime;
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
      return dateObj?.toLocaleDateString("en-US", {
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
          {isLoading && (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--color-muted-foreground)",
              }}
            >
              Loading your recent games...
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--color-error)",
              }}
            >
              Failed to load recent games. Please try again.
            </div>
          )}

          {!isLoading && !error && recentGames.length === 0 && (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--color-muted-foreground)",
              }}
            >
              No games yet. Start by creating a new game!
            </div>
          )}

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
                    <h4 className="recent-game-id">{formatGameTitle(game)}</h4>
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
