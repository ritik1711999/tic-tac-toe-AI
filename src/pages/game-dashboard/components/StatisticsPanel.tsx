import Icon from "../../../components/AppIcon";
import type { Stat, DashboardStatsResponse } from "../types";
import { useDashboardStats } from "../../../hooks/useDashboard";
import "./styles/StatisticsPanel.css";

const StatisticsPanel = () => {
  const { data, isLoading, isError } = useDashboardStats();

  const formatDelta = (v: number) => {
    if (v === 0) return "0";
    const rounded = Math.round(v);
    return rounded > 0 ? `+${rounded}` : `${rounded}`;
  };

  const changeTypeOf = (v: number): Stat["changeType"] => {
    if (v === 0) return "neutral";
    return v > 0 ? "positive" : "negative";
  };

  const stats: Stat[] = (() => {
    const current = (data as DashboardStatsResponse | undefined)?.current;
    const deltas = (data as DashboardStatsResponse | undefined)?.deltas;
    const streak = (data as DashboardStatsResponse | undefined)?.streak;

    if (!current || !deltas) {
      return [
        {
          id: 1,
          label: "Total Games",
          value: isLoading ? "…" : 0,
          change: "",
          changeType: "neutral",
          icon: "Gamepad2",
          color: "var(--color-primary)",
        },
        {
          id: 2,
          label: "Win Rate",
          value: isLoading ? "…" : "0%",
          change: "",
          changeType: "neutral",
          icon: "Trophy",
          color: "var(--color-success)",
        },
        {
          id: 3,
          label: "Current Streak",
          value: isLoading ? "…" : 0,
          change: isLoading ? "" : "None",
          changeType: "neutral",
          icon: "Flame",
          color: "var(--color-warning)",
        },
        {
          id: 4,
          label: "Avg. Moves",
          value: isLoading ? "…" : 0,
          change: "",
          changeType: "neutral",
          icon: "Move",
          color: "var(--color-secondary)",
        },
      ];
    }

    return [
      {
        id: 1,
        label: "Total Games",
        value: current.totalGames,
        change: formatDelta(deltas.totalGames.abs),
        changeType: changeTypeOf(deltas.totalGames.abs),
        icon: "Gamepad2",
        color: "var(--color-primary)",
      },
      {
        id: 2,
        label: "Win Rate",
        value: `${Math.round(current.winRate)}%`,
        change: formatDelta(deltas.winRate.abs) + "%",
        changeType: changeTypeOf(deltas.winRate.abs),
        icon: "Trophy",
        color: "var(--color-success)",
      },
      {
        id: 3,
        label: "Current Streak",
        value: streak?.count ?? 0,
        change: streak?.count && streak.count > 0 ? "Active" : "None",
        changeType: "neutral",
        icon: "Flame",
        color: "var(--color-warning)",
      },
      {
        id: 4,
        label: "Avg. Moves",
        value: (current.avgMoves ?? 0).toFixed(1),
        change: formatDelta(deltas.avgMoves.abs),
        changeType: changeTypeOf(deltas.avgMoves.abs),
        icon: "Move",
        color: "var(--color-secondary)",
      },
    ];
  })();

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
          {isError && (
            <div className="page-dashboard-error">Failed to load stats.</div>
          )}
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
