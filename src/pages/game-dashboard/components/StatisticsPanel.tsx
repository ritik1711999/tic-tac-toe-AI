import React from "react";
import Icon from "../../../components/AppIcon";

const StatisticsPanel = () => {
  const stats = [
    {
      id: 1,
      label: "Total Games",
      value: "127",
      change: "+12",
      changeType: "positive",
      icon: "Gamepad2",
      color: "var(--color-primary)",
    },
    {
      id: 2,
      label: "Win Rate",
      value: "68%",
      change: "+5%",
      changeType: "positive",
      icon: "Trophy",
      color: "var(--color-success)",
    },
    {
      id: 3,
      label: "Current Streak",
      value: "7",
      change: "Active",
      changeType: "neutral",
      icon: "Flame",
      color: "var(--color-warning)",
    },
    {
      id: 4,
      label: "Avg. Moves",
      value: "5.8",
      change: "-0.3",
      changeType: "positive",
      icon: "Move",
      color: "var(--color-secondary)",
    },
  ];

  return (
    <>
      <div className="statistics-panel">
        <div className="panel-header">
          <h3 className="panel-title">Performance Statistics</h3>
          <p className="panel-subtitle">Your gaming performance overview</p>
        </div>

        <div className="stats-grid">
          {stats?.map((stat) => (
            <div key={stat?.id} className="stat-card">
              <div
                className="stat-icon"
                style={{ background: `${stat?.color}15` }}
              >
                <Icon
                  name={stat?.icon}
                  size={24}
                  color={stat?.color}
                  strokeWidth={2}
                />
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat?.label}</p>
                <div className="stat-value-row">
                  <h4 className="stat-value">{stat?.value}</h4>
                  <span className={`stat-change ${stat?.changeType}`}>
                    {stat?.changeType === "positive" && (
                      <Icon name="TrendingUp" size={14} strokeWidth={2} />
                    )}
                    {stat?.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .statistics-panel {
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }

        .panel-header {
          margin-bottom: 24px;
        }

        .panel-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-foreground);
          margin: 0 0 4px 0;
        }

        .panel-subtitle {
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--color-muted-foreground);
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .stat-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          background: var(--color-muted);
          border-radius: var(--radius-lg);
          transition: transform var(--transition-fast),
            box-shadow var(--transition-fast);
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
          min-width: 0;
        }

        .stat-label {
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--color-muted-foreground);
          margin: 0 0 8px 0;
        }

        .stat-value-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stat-value {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-foreground);
          margin: 0;
        }

        .stat-change {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-data);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
        }

        .stat-change.positive {
          background: var(--color-success);
          background-opacity: 0.1;
          color: var(--color-success);
        }

        .stat-change.neutral {
          background: var(--color-muted);
          color: var(--color-muted-foreground);
        }

        @media (max-width: 767px) {
          .statistics-panel {
            padding: 20px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .stat-card {
            padding: 16px;
          }

          .stat-value {
            font-size: 1.5rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .stat-card {
            transition: none;
          }

          .stat-card:hover {
            transform: none;
          }
        }
      `}</style>
    </>
  );
};

export default StatisticsPanel;
