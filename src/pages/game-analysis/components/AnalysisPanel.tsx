import Icon from "../../../components/AppIcon";
import "./styles/AnalysisPanel.css";
import { type Move } from "../types";

const AnalysisPanel = ({ currentMove }: { currentMove: Move | undefined }) => {
  if (!currentMove) {
    return (
      <div className="analysis-panel-container">
        <div className="analysis-panel-empty-state">
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
        <div className="analysis-panel-header">
          <h3 className="analysis-panel-title">Move Analysis</h3>
          <div className="analysis-panel-move-badge">
            Move {currentMove?.moveNumber}
          </div>
        </div>

        <div className="analysis-panel-content">
          <div className="analysis-panel-quality-section">
            <div className="analysis-panel-quality-header">
              <span className="analysis-panel-section-label">Move Quality</span>
              <div
                className="analysis-panel-quality-indicator"
                style={{ color: getQualityColor(currentMove?.quality) }}
              >
                <Icon name="TrendingUp" size={20} strokeWidth={2} />
                <span className="analysis-panel-quality-text">
                  {currentMove?.quality}
                </span>
              </div>
            </div>
            <div className="analysis-panel-quality-score">
              <div className="analysis-panel-score-bar">
                <div
                  className="analysis-panel-score-fill"
                  style={{
                    width: `${currentMove?.score}%`,
                    background: getQualityColor(currentMove?.quality),
                  }}
                />
              </div>
              <span className="analysis-panel-score-value">
                {currentMove?.score}%
              </span>
            </div>
          </div>

          <div className="analysis-panel-recommendation-section">
            <div className="analysis-panel-section-header">
              <Icon name="Lightbulb" size={20} strokeWidth={2} />
              <span className="analysis-panel-section-label">
                AI Recommendation
              </span>
            </div>
            <div className="analysis-panel-recommendation-content">
              <p className="analysis-panel-recommendation-text">
                {currentMove?.aiRecommendation}
              </p>
              {currentMove?.alternativeMove && (
                <div className="analysis-panel-alternative-move">
                  <span className="analysis-panel-alternative-label">
                    Better move:
                  </span>
                  <span className="analysis-panel-alternative-value">
                    {currentMove?.alternativeMove}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="analysis-panel-reasoning-section">
            <div className="analysis-panel-section-header">
              <Icon name="Brain" size={20} strokeWidth={2} />
              <span className="analysis-panel-section-label">
                Strategic Reasoning
              </span>
            </div>
            <p className="analysis-panel-reasoning-text">
              {currentMove?.reasoning}
            </p>
          </div>

          <div className="analysis-panel-outcome-section">
            <div className="analysis-panel-section-header">
              <Icon name="Target" size={20} strokeWidth={2} />
              <span className="analysis-panel-section-label">
                Outcome Probability
              </span>
            </div>
            <div className="analysis-panel-outcome-grid">
              <div className="analysis-panel-outcome-item">
                <span className="analysis-panel-outcome-label">Win</span>
                <div className="analysis-panel-outcome-bar">
                  <div
                    className="analysis-panel-outcome-fill win"
                    style={{ width: `${currentMove?.outcomes?.win}%` }}
                  />
                </div>
                <span className="analysis-panel-outcome-value">
                  {currentMove?.outcomes?.win}%
                </span>
              </div>
              <div className="analysis-panel-outcome-item">
                <span className="analysis-panel-outcome-label">Draw</span>
                <div className="analysis-panel-outcome-bar">
                  <div
                    className="analysis-panel-outcome-fill draw"
                    style={{ width: `${currentMove?.outcomes?.draw}%` }}
                  />
                </div>
                <span className="analysis-panel-outcome-value">
                  {currentMove?.outcomes?.draw}%
                </span>
              </div>
              <div className="analysis-panel-outcome-item">
                <span className="analysis-panel-outcome-label">Loss</span>
                <div className="analysis-panel-outcome-bar">
                  <div
                    className="analysis-panel-outcome-fill loss"
                    style={{ width: `${currentMove?.outcomes?.loss}%` }}
                  />
                </div>
                <span className="analysis-panel-outcome-value">
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
