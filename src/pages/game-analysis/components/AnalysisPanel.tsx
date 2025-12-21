import Icon from "../../../components/AppIcon";
import "./styles/AnalysisPanel.css";
import { type Move } from "../types";

const AnalysisPanel = ({ currentMove }: { currentMove: Move | undefined }) => {
  if (!currentMove) {
    return (
      <div className="analysis-panel-container">
        <div className="empty-state">
          <Icon name="BarChart3" size={48} strokeWidth={1.5} />
          <p>Select a move to view analysis</p>
        </div>
      </div>
    );
  }

  const getQualityColor = (
    quality: "excellent" | "good" | "suboptimal" | "mistake"
  ) => {
    const colors = {
      excellent: "var(--color-success)",
      good: "var(--color-primary)",
      suboptimal: "var(--color-warning)",
      mistake: "var(--color-error)",
    };
    return colors?.[quality] || colors?.good;
  };

  return (
    <>
      <div className="analysis-panel-container">
        <div className="panel-header">
          <h3 className="panel-title">Move Analysis</h3>
          <div className="move-badge">Move {currentMove?.moveNumber}</div>
        </div>

        <div className="analysis-content">
          <div className="quality-section">
            <div className="quality-header">
              <span className="section-label">Move Quality</span>
              <div
                className="quality-indicator"
                style={{ color: getQualityColor(currentMove?.quality) }}
              >
                <Icon name="TrendingUp" size={20} strokeWidth={2} />
                <span className="quality-text">{currentMove?.quality}</span>
              </div>
            </div>
            <div className="quality-score">
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${currentMove?.score}%`,
                    background: getQualityColor(currentMove?.quality),
                  }}
                />
              </div>
              <span className="score-value">{currentMove?.score}%</span>
            </div>
          </div>

          <div className="recommendation-section">
            <div className="section-header">
              <Icon name="Lightbulb" size={20} strokeWidth={2} />
              <span className="section-label">AI Recommendation</span>
            </div>
            <div className="recommendation-content">
              <p className="recommendation-text">
                {currentMove?.aiRecommendation}
              </p>
              {currentMove?.alternativeMove && (
                <div className="alternative-move">
                  <span className="alternative-label">Better move:</span>
                  <span className="alternative-value">
                    {currentMove?.alternativeMove}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="reasoning-section">
            <div className="section-header">
              <Icon name="Brain" size={20} strokeWidth={2} />
              <span className="section-label">Strategic Reasoning</span>
            </div>
            <p className="reasoning-text">{currentMove?.reasoning}</p>
          </div>

          <div className="outcome-section">
            <div className="section-header">
              <Icon name="Target" size={20} strokeWidth={2} />
              <span className="section-label">Outcome Probability</span>
            </div>
            <div className="outcome-grid">
              <div className="outcome-item">
                <span className="outcome-label">Win</span>
                <div className="outcome-bar">
                  <div
                    className="outcome-fill win"
                    style={{ width: `${currentMove?.outcomes?.win}%` }}
                  />
                </div>
                <span className="outcome-value">
                  {currentMove?.outcomes?.win}%
                </span>
              </div>
              <div className="outcome-item">
                <span className="outcome-label">Draw</span>
                <div className="outcome-bar">
                  <div
                    className="outcome-fill draw"
                    style={{ width: `${currentMove?.outcomes?.draw}%` }}
                  />
                </div>
                <span className="outcome-value">
                  {currentMove?.outcomes?.draw}%
                </span>
              </div>
              <div className="outcome-item">
                <span className="outcome-label">Loss</span>
                <div className="outcome-bar">
                  <div
                    className="outcome-fill loss"
                    style={{ width: `${currentMove?.outcomes?.loss}%` }}
                  />
                </div>
                <span className="outcome-value">
                  {currentMove?.outcomes?.loss}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalysisPanel;
