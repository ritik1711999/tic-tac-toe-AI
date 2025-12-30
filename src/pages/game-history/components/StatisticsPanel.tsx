import React from "react";
import Icon from "../../../components/AppIcon";
import type { GameStats } from "../types";
import "./styles/StatisticsPanel.css";

interface StatisticsPanelProps {
  stats: GameStats;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ stats }) => {
  const winRate =
    stats.totalGames > 0
      ? ((stats.wins / stats.totalGames) * 100).toFixed(1)
      : "0";

  const avgMoves =
    stats.totalGames > 0
      ? (stats.totalMoves / stats.totalGames).toFixed(1)
      : "0";

  const avgDuration =
    stats.totalGames > 0
      ? Math.floor(stats.totalDuration / stats.totalGames)
      : 0;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const statCards = [
    {
      label: "Total Games",
      value: stats.totalGames,
      icon: "Gamepad2",
      color: "var(--color-primary)",
      bgColor: "rgba(30, 64, 175, 0.1)",
    },
    {
      label: "Win Rate",
      value: `${winRate}%`,
      icon: "Trophy",
      color: "var(--color-success)",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      label: "Avg Moves",
      value: avgMoves,
      icon: "Move",
      color: "var(--color-secondary)",
      bgColor: "rgba(15, 118, 110, 0.1)",
    },
    {
      label: "Avg Duration",
      value: formatDuration(avgDuration),
      icon: "Clock",
      color: "var(--color-accent)",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
  ];

  const outcomeStats = [
    {
      label: "Wins",
      value: stats.wins,
      percentage:
        stats.totalGames > 0
          ? ((stats.wins / stats.totalGames) * 100).toFixed(0)
          : "0",
      color: "var(--color-success)",
    },
    {
      label: "Losses",
      value: stats.losses,
      percentage:
        stats.totalGames > 0
          ? ((stats.losses / stats.totalGames) * 100).toFixed(0)
          : "0",
      color: "var(--color-error)",
    },
    {
      label: "Draws",
      value: stats.draws,
      percentage:
        stats.totalGames > 0
          ? ((stats.draws / stats.totalGames) * 100).toFixed(0)
          : "0",
      color: "var(--color-muted-foreground)",
    },
  ];

  return (
    <>
      <div className="history-statistics-panel">
        <div className="history-panel-header">
          <Icon name="BarChart3" size={20} strokeWidth={2} />
          <h3 className="history-panel-title">Performance Statistics</h3>
        </div>

        <div className="history-stats-grid">
          {statCards.map((stat, index) => (
            <div key={index} className="history-stat-card">
              <div
                className="history-stat-icon"
                style={{ backgroundColor: stat.bgColor }}
              >
                <Icon
                  name={stat.icon as any}
                  size={24}
                  strokeWidth={2}
                  color={stat.color}
                />
              </div>
              <div className="history-stat-content">
                <span className="history-stat-label">{stat.label}</span>
                <span className="history-stat-value">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="outcome-breakdown">
          <h4 className="history-breakdown-title">Outcome Breakdown</h4>
          <div className="history-outcome-bars">
            {outcomeStats.map((outcome, index) => (
              <div key={index} className="history-outcome-item">
                <div className="history-outcome-header">
                  <span className="history-outcome-label">{outcome.label}</span>
                  <span className="history-outcome-value">
                    {outcome.value} ({outcome.percentage}%)
                  </span>
                </div>
                <div className="history-outcome-bar">
                  <div
                    className="history-outcome-fill"
                    style={{
                      width: `${outcome.percentage}%`,
                      backgroundColor: outcome.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="difficulty-stats">
          <h4 className="history-breakdown-title">Performance by Difficulty</h4>
          <div className="history-difficulty-grid">
            {stats.byDifficulty.map((diff, index) => (
              <div key={index} className="history-difficulty-card">
                <div className="history-difficulty-header">
                  <span
                    className={`history-difficulty-label history-difficulty-${diff.level}`}
                  >
                    {diff.level.charAt(0).toUpperCase() + diff.level.slice(1)}
                  </span>
                  <span className="history-difficulty-games">{diff.games} games</span>
                </div>
                <div className="history-difficulty-stats-row">
                  <div className="history-difficulty-stat">
                    <Icon
                      name="Trophy"
                      size={14}
                      strokeWidth={2}
                      color="var(--color-success)"
                    />
                    <span>{diff.wins}W</span>
                  </div>
                  <div className="history-difficulty-stat">
                    <Icon
                      name="X"
                      size={14}
                      strokeWidth={2}
                      color="var(--color-error)"
                    />
                    <span>{diff.losses}L</span>
                  </div>
                  <div className="history-difficulty-stat">
                    <Icon
                      name="Minus"
                      size={14}
                      strokeWidth={2}
                      color="var(--color-muted-foreground)"
                    />
                    <span>{diff.draws}D</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default StatisticsPanel;
