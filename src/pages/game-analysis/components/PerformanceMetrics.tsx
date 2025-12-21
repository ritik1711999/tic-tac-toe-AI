import Icon from "../../../components/AppIcon";
import "./styles/PerformanceMetrics.css";
import type { PerformanceMetricsData, MetricType } from "../types";

const PerformanceMetrics = ({
  metrics,
}: {
  metrics: PerformanceMetricsData;
}) => {
  const getMetricIcon = (type: MetricType) => {
    const icons = {
      excellent: "Award",
      good: "ThumbsUp",
      suboptimal: "AlertCircle",
      mistakes: "XCircle",
    };
    return icons[type] || "BarChart3";
  };

  const getMetricColor = (type: MetricType) => {
    const colors = {
      excellent: "var(--color-success)",
      good: "var(--color-primary)",
      suboptimal: "var(--color-warning)",
      mistakes: "var(--color-error)",
    };
    return colors[type] || "var(--color-foreground)";
  };

  return (
    <>
      <div className="performance-metrics-container">
        <div className="metrics-header">
          <h3 className="metrics-title">Performance Summary</h3>
          <div className="overall-score">
            <Icon name="TrendingUp" size={16} strokeWidth={2} />
            <span>{metrics?.overallScore}%</span>
          </div>
        </div>

        <div className="metrics-grid">
          {Object.entries(metrics?.breakdown)?.map(([key, value]) => (
            <div key={key} className="metric-card">
              <div
                className="metric-icon"
                style={{ color: getMetricColor(key as MetricType) }}
              >
                <Icon
                  name={getMetricIcon(key as MetricType)}
                  size={24}
                  strokeWidth={2}
                />
              </div>
              <div className="metric-content">
                <span className="metric-value">{value}</span>
                <span className="metric-label">{key}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="key-moments">
          <div className="section-header">
            <Icon name="Star" size={18} strokeWidth={2} />
            <span className="section-title">Key Moments</span>
          </div>
          <div className="moments-list">
            {metrics?.keyMoments?.map((moment, index) => (
              <div key={index} className="moment-item">
                <div className="moment-badge">
                  <Icon name="Zap" size={14} strokeWidth={2} />
                </div>
                <div className="moment-content">
                  <span className="moment-move">Move {moment?.moveNumber}</span>
                  <span className="moment-description">
                    {moment?.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PerformanceMetrics;
