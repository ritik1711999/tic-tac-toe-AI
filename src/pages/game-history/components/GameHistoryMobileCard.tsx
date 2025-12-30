import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";
import type { Game } from "../types";
import "./styles/GameHistoryMobileCard.css";

interface GameHistoryMobileCardProps {
  game: Game;
  isSelected: boolean;
  onSelect: (gameId: string) => void;
  onReplay: (gameId: string) => void;
  onAnalyze: (gameId: string) => void;
}

const GameHistoryMobileCard: React.FC<GameHistoryMobileCardProps> = ({
  game,
  isSelected,
  onSelect,
  onReplay,
  onAnalyze,
}) => {
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getOutcomeConfig = (outcome: string) => {
    const configs: Record<string, { label: string; icon: string; class: string }> = {
      win: { label: "Win", icon: "Trophy", class: "mobile-outcome-win" },
      loss: { label: "Loss", icon: "X", class: "mobile-outcome-loss" },
      draw: { label: "Draw", icon: "Minus", class: "mobile-outcome-draw" },
    };
    return configs[outcome] || configs.draw;
  };

  const getDifficultyBadge = (difficulty: string) => {
    const badges: Record<string, { label: string; class: string }> = {
      easy: { label: "Easy", class: "mobile-difficulty-easy" },
      medium: { label: "Medium", class: "mobile-difficulty-medium" },
      hard: { label: "Hard", class: "mobile-difficulty-hard" },
    };
    return badges[difficulty] || badges.easy;
  };

  const outcomeConfig = getOutcomeConfig(game.outcome);
  const difficultyBadge = getDifficultyBadge(game.difficulty);

  return (
    <div className={`mobile-game-card ${isSelected ? "selected" : ""}`}>
      <div className="mobile-card-header">
        <div className="mobile-header-left">
          <Checkbox
            checked={isSelected}
            onChange={() => onSelect(game.id)}
            aria-label={`Select game ${game.id}`}
          />
          <div className="mobile-game-info">
            <span className="mobile-game-date">{formatDate(game.date)}</span>
            <span className="mobile-game-time">{formatTime(game.date)}</span>
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
            <span className={`mobile-difficulty-badge ${difficultyBadge.class}`}>
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
            <span className="mobile-stat-value">{formatDuration(game.duration)}</span>
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
            <span className="mobile-stat-value">{game.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="mobile-card-footer">
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
