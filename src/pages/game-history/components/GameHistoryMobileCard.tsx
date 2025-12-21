import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";

const GameHistoryMobileCard = ({
  game,
  isSelected,
  onSelect,
  onReplay,
  onAnalyze,
}) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    const d = new Date(date);
    return d?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, "0")}`;
  };

  const getOutcomeConfig = (outcome) => {
    const configs = {
      win: { label: "Win", icon: "Trophy", class: "outcome-win" },
      loss: { label: "Loss", icon: "X", class: "outcome-loss" },
      draw: { label: "Draw", icon: "Minus", class: "outcome-draw" },
    };
    return configs?.[outcome] || configs?.draw;
  };

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: { label: "Easy", class: "difficulty-easy" },
      medium: { label: "Medium", class: "difficulty-medium" },
      hard: { label: "Hard", class: "difficulty-hard" },
    };
    return badges?.[difficulty] || badges?.easy;
  };

  const outcomeConfig = getOutcomeConfig(game?.outcome);
  const difficultyBadge = getDifficultyBadge(game?.difficulty);

  return (
    <>
      <div className={`mobile-game-card ${isSelected ? "selected" : ""}`}>
        <div className="card-header">
          <div className="header-left">
            <Checkbox
              checked={isSelected}
              onChange={() => onSelect(game?.id)}
              aria-label={`Select game ${game?.id}`}
            />
            <div className="game-info">
              <span className="game-date">{formatDate(game?.date)}</span>
              <span className="game-time">{formatTime(game?.date)}</span>
            </div>
          </div>
          <div className={`outcome-indicator ${outcomeConfig?.class}`}>
            <Icon name={outcomeConfig?.icon} size={20} strokeWidth={2} />
            <span>{outcomeConfig?.label}</span>
          </div>
        </div>

        <div className="card-body">
          <div className="game-stats">
            <div className="stat-item">
              <Icon name="Target" size={16} strokeWidth={2} />
              <span className="stat-label">Opponent:</span>
              <span className={`difficulty-badge ${difficultyBadge?.class}`}>
                {difficultyBadge?.label}
              </span>
            </div>

            <div className="stat-item">
              <Icon name="Move" size={16} strokeWidth={2} />
              <span className="stat-label">Moves:</span>
              <span className="stat-value">{game?.moves}</span>
            </div>

            <div className="stat-item">
              <Icon name="Clock" size={16} strokeWidth={2} />
              <span className="stat-label">Duration:</span>
              <span className="stat-value">
                {formatDuration(game?.duration)}
              </span>
            </div>

            <div className="stat-item">
              <Icon
                name="Star"
                size={16}
                strokeWidth={2}
                fill="var(--color-warning)"
                color="var(--color-warning)"
              />
              <span className="stat-label">Rating:</span>
              <span className="stat-value">{game?.rating?.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="card-footer">
          <Button
            variant="outline"
            size="sm"
            iconName="Play"
            iconPosition="left"
            onClick={() => onReplay(game?.id)}
            fullWidth
          >
            Replay
          </Button>
          <Button
            variant="primary"
            size="sm"
            iconName="BarChart3"
            iconPosition="left"
            onClick={() => onAnalyze(game?.id)}
            fullWidth
          >
            Analyze
          </Button>
        </div>
      </div>
      <style jsx>{`
        .mobile-game-card {
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 16px;
          transition: all var(--transition-fast);
        }

        .mobile-game-card.selected {
          border-color: var(--color-primary);
          background: rgba(30, 64, 175, 0.05);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--color-border);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .game-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .game-date {
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-foreground);
        }

        .game-time {
          font-family: var(--font-data);
          font-size: 0.75rem;
          color: var(--color-muted-foreground);
        }

        .outcome-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .outcome-win {
          background: rgba(16, 185, 129, 0.1);
          color: var(--color-success);
        }

        .outcome-loss {
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-error);
        }

        .outcome-draw {
          background: rgba(107, 114, 128, 0.1);
          color: var(--color-muted-foreground);
        }

        .card-body {
          margin-bottom: 16px;
        }

        .game-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
        }

        .stat-label {
          color: var(--color-muted-foreground);
          font-weight: 500;
        }

        .stat-value {
          font-family: var(--font-data);
          font-weight: 600;
          color: var(--color-foreground);
          margin-left: auto;
        }

        .difficulty-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-left: auto;
        }

        .difficulty-easy {
          background: rgba(16, 185, 129, 0.1);
          color: var(--color-success);
        }

        .difficulty-medium {
          background: rgba(245, 158, 11, 0.1);
          color: var(--color-warning);
        }

        .difficulty-hard {
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-error);
        }

        .card-footer {
          display: flex;
          gap: 8px;
        }

        @media (prefers-reduced-motion: reduce) {
          .mobile-game-card {
            transition: none;
          }
        }
      `}</style>
    </>
  );
};

export default GameHistoryMobileCard;
