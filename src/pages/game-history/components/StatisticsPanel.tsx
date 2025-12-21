import React from "react";
import Icon from "../../../components/AppIcon";

const StatisticsPanel = ({ stats }) => {
  const winRate =
    stats?.totalGames > 0
      ? ((stats?.wins / stats?.totalGames) * 100)?.toFixed(1)
      : 0;

  const avgMoves =
    stats?.totalGames > 0
      ? (stats?.totalMoves / stats?.totalGames)?.toFixed(1)
      : 0;

  const avgDuration =
    stats?.totalGames > 0
      ? Math.floor(stats?.totalDuration / stats?.totalGames)
      : 0;

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, "0")}`;
  };

  const statCards = [
    {
      label: "Total Games",
      value: stats?.totalGames,
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
      value: stats?.wins,
      percentage:
        stats?.totalGames > 0
          ? ((stats?.wins / stats?.totalGames) * 100)?.toFixed(0)
          : 0,
      color: "var(--color-success)",
    },
    {
      label: "Losses",
      value: stats?.losses,
      percentage:
        stats?.totalGames > 0
          ? ((stats?.losses / stats?.totalGames) * 100)?.toFixed(0)
          : 0,
      color: "var(--color-error)",
    },
    {
      label: "Draws",
      value: stats?.draws,
      percentage:
        stats?.totalGames > 0
          ? ((stats?.draws / stats?.totalGames) * 100)?.toFixed(0)
          : 0,
      color: "var(--color-muted-foreground)",
    },
  ];

  return (
    <>
      <div className="statistics-panel">
        <div className="panel-header">
          <Icon name="BarChart3" size={20} strokeWidth={2} />
          <h3 className="panel-title">Performance Statistics</h3>
        </div>

        <div className="stats-grid">
          {statCards?.map((stat, index) => (
            <div key={index} className="stat-card">
              <div
                className="stat-icon"
                style={{ backgroundColor: stat?.bgColor }}
              >
                <Icon
                  name={stat?.icon}
                  size={24}
                  strokeWidth={2}
                  color={stat?.color}
                />
              </div>
              <div className="stat-content">
                <span className="stat-label">{stat?.label}</span>
                <span className="stat-value">{stat?.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="outcome-breakdown">
          <h4 className="breakdown-title">Outcome Breakdown</h4>
          <div className="outcome-bars">
            {outcomeStats?.map((outcome, index) => (
              <div key={index} className="outcome-item">
                <div className="outcome-header">
                  <span className="outcome-label">{outcome?.label}</span>
                  <span className="outcome-value">
                    {outcome?.value} ({outcome?.percentage}%)
                  </span>
                </div>
                <div className="outcome-bar">
                  <div
                    className="outcome-fill"
                    style={{
                      width: `${outcome?.percentage}%`,
                      backgroundColor: outcome?.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="difficulty-stats">
          <h4 className="breakdown-title">Performance by Difficulty</h4>
          <div className="difficulty-grid">
            {stats?.byDifficulty?.map((diff, index) => (
              <div key={index} className="difficulty-card">
                <div className="difficulty-header">
                  <span
                    className={`difficulty-label difficulty-${diff?.level}`}
                  >
                    {diff?.level?.charAt(0)?.toUpperCase() +
                      diff?.level?.slice(1)}
                  </span>
                  <span className="difficulty-games">{diff?.games} games</span>
                </div>
                <div className="difficulty-stats-row">
                  <div className="difficulty-stat">
                    <Icon
                      name="Trophy"
                      size={14}
                      strokeWidth={2}
                      color="var(--color-success)"
                    />
                    <span>{diff?.wins}W</span>
                  </div>
                  <div className="difficulty-stat">
                    <Icon
                      name="X"
                      size={14}
                      strokeWidth={2}
                      color="var(--color-error)"
                    />
                    <span>{diff?.losses}L</span>
                  </div>
                  <div className="difficulty-stat">
                    <Icon
                      name="Minus"
                      size={14}
                      strokeWidth={2}
                      color="var(--color-muted-foreground)"
                    />
                    <span>{diff?.draws}D</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .statistics-panel {
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 20px;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .panel-title {
          font-family: var(--font-heading);
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-foreground);
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: var(--color-muted);
          border-radius: var(--radius-lg);
        }

        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--color-muted-foreground);
          font-weight: 500;
        }

        .stat-value {
          font-family: var(--font-data);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-foreground);
        }

        .outcome-breakdown,
        .difficulty-stats {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--color-border);
        }

        .breakdown-title {
          font-family: var(--font-heading);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-foreground);
          margin: 0 0 16px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .outcome-bars {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .outcome-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .outcome-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .outcome-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-foreground);
        }

        .outcome-value {
          font-family: var(--font-data);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-muted-foreground);
        }

        .outcome-bar {
          height: 8px;
          background: var(--color-muted);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .outcome-fill {
          height: 100%;
          transition: width var(--transition-base);
          border-radius: var(--radius-md);
        }

        .difficulty-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }

        .difficulty-card {
          padding: 12px;
          background: var(--color-muted);
          border-radius: var(--radius-md);
        }

        .difficulty-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .difficulty-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
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

        .difficulty-games {
          font-size: 0.75rem;
          color: var(--color-muted-foreground);
        }

        .difficulty-stats-row {
          display: flex;
          gap: 12px;
        }

        .difficulty-stat {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-data);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-foreground);
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .stat-card {
            padding: 12px;
          }

          .stat-icon {
            width: 40px;
            height: 40px;
          }

          .stat-value {
            font-size: 1.25rem;
          }

          .difficulty-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .outcome-fill {
            transition: none;
          }
        }
      `}</style>
    </>
  );
};

export default StatisticsPanel;
