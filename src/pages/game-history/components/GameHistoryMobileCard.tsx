import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import type { RecentGame } from "../../../hooks/useGames";
import "./styles/GameHistoryMobileCard.css";

interface GameHistoryMobileCardProps {
  game: RecentGame;
  onReplay?: (gameId: string) => void;
  onAnalyze: (gameId: string) => void;
}

const GameHistoryMobileCard: React.FC<GameHistoryMobileCardProps> = ({
  game,
  onReplay,
  onAnalyze,
}) => {
  const formatDate = (dateStr: string | Date) => {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string | Date) => {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOutcomeConfig = (outcome: string) => {
    const configs: Record<
      string,
      { label: string; icon: string; class: string }
    > = {
      win: { label: "Win", icon: "Trophy", class: "mobile-outcome-win" },
      lose: { label: "Lose", icon: "X", class: "mobile-outcome-lose" },
      draw: { label: "Draw", icon: "Minus", class: "mobile-outcome-draw" },
    };
    return configs[outcome] || configs.draw;
  };

  const extractDifficulty = (opponent: string): string => {
    if (opponent.includes("Easy")) return "easy";
    if (opponent.includes("Medium")) return "medium";
    if (opponent.includes("Hard")) return "hard";
    return "easy";
  };

  const getDifficultyBadge = (opponent: string) => {
    const difficulty = extractDifficulty(opponent);
    const badges: Record<string, { label: string; class: string }> = {
      easy: { label: "Easy", class: "mobile-difficulty-easy" },
      medium: { label: "Medium", class: "mobile-difficulty-medium" },
      hard: { label: "Hard", class: "mobile-difficulty-hard" },
    };
    return badges[difficulty] || badges.easy;
  };

  const outcomeConfig = getOutcomeConfig(game.result);
  const difficultyBadge = getDifficultyBadge(game.opponent);

  return (
    <div className="mobile-game-card">
      <div className="mobile-card-header">
        <div className="mobile-header-left">
          <div className="mobile-game-info">
            <span className="mobile-game-date">
              {formatDate(game.timestamp)}
            </span>
            <span className="mobile-game-time">
              {formatTime(game.timestamp)}
            </span>
          </div>
        </div>
        <div className={`mobile-outcome-indicator ${outcomeConfig.class}`}>
          <Icon name={outcomeConfig.icon as any} size={20} strokeWidth={2} />
          <span>{outcomeConfig.label}</span>
        </div>
      </div>

      <div className="mobile-card-body">
        <div className="mobile-game-stats">
          <div className="mobile-stat-item">
            <Icon name="Target" size={16} strokeWidth={2} />
            <span className="mobile-stat-label">Opponent:</span>
            <span
              className={`mobile-difficulty-badge ${difficultyBadge.class}`}
            >
              {difficultyBadge.label}
            </span>
          </div>

          <div className="mobile-stat-item">
            <Icon name="Move" size={16} strokeWidth={2} />
            <span className="mobile-stat-label">Moves:</span>
            <span className="mobile-stat-value">{game.moves}</span>
          </div>

          <div className="mobile-stat-item">
            <Icon name="Clock" size={16} strokeWidth={2} />
            <span className="mobile-stat-label">Duration:</span>
            <span className="mobile-stat-value">{game.duration}</span>
          </div>

          <div className="mobile-stat-item">
            <Icon
              name="Star"
              size={16}
              strokeWidth={2}
              fill="var(--color-warning)"
              color="var(--color-warning)"
            />
            <span className="mobile-stat-label">Rating:</span>
            <span className="mobile-stat-value">-</span>
          </div>
        </div>
      </div>

      <div className="mobile-card-footer">
        {onReplay && (
          <Button
            variant="outline"
            size="sm"
            iconName="Play"
            iconPosition="left"
            onClick={() => onReplay(game.id)}
            fullWidth
          >
            Replay
          </Button>
        )}
        <Button
          variant="primary"
          size="sm"
          iconName="BarChart3"
          iconPosition="left"
          onClick={() => onAnalyze(game.id)}
          fullWidth
        >
          Analyze
        </Button>
      </div>
    </div>
  );
};

export default GameHistoryMobileCard;
