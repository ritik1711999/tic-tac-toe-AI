import Icon from "../../../components/AppIcon";
import type { Stat } from "../types";
import "./styles/StatisticsPanel.css";

const StatisticsPanel = () => {
  const stats: Stat[] = [
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
      changeType: "negative",
      icon: "Move",
      color: "var(--color-secondary)",
    },
  ];

  return (
    <>
      <div className="page-dashboard-statistics-panel">
        <div className="page-dashboard-panel-header">
          <h3 className="page-dashboard-panel-title">Performance Statistics</h3>
          <p className="page-dashboard-panel-subtitle">
            Your gaming performance overview
          </p>
        </div>

        <div className="page-dashboard-stats-grid">
          {stats?.map((stat) => (
            <div key={stat?.id} className="page-dashboard-stat-card">
              <div
                className="page-dashboard-stat-icon"
                style={{ background: `${stat?.color}15` }}
              >
                <Icon
                  name={stat?.icon}
                  size={24}
                  color={stat?.color}
                  strokeWidth={2}
                />
              </div>
              <div className="page-dashboard-stat-content">
                <p className="page-dashboard-stat-label">{stat?.label}</p>
                <div className="page-dashboard-stat-value-row">
                  <h4 className="page-dashboard-stat-value">{stat?.value}</h4>
                  <span
                    className={`page-dashboard-stat-change ${stat?.changeType}`}
                  >
                    {stat?.changeType === "positive" && (
                      <Icon name="TrendingUp" size={14} strokeWidth={2} />
                    )}
                    {stat?.changeType === "negative" && (
                      <Icon name="TrendingDown" size={14} strokeWidth={2} />
                    )}
                    {stat?.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StatisticsPanel;
