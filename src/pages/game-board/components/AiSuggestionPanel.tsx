import Icon from "../../../components/AppIcon";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import type { Suggestion } from "../types";
import "./styles/AiSuggestionPanel.css";

interface AiSuggestionPanelProps {
  suggestion: Suggestion | null;
  isAiThinking: boolean;
  hintsRemaining: number;
}

const AiSuggestionPanel = ({
  suggestion,
  isAiThinking,
  hintsRemaining,
}: AiSuggestionPanelProps) => {
  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 80) return "var(--color-success)";
    if (confidence >= 60) return "var(--color-warning)";
    return "var(--color-error)";
  };

  const getPositionLabel = (position: number): string => {
    const row = Math.floor(position / 3) + 1;
    const col = (position % 3) + 1;
    return `Row ${row}, Col ${col}`;
  };

  // Only show panel when there's a suggestion or AI is thinking
  if (!suggestion && !isAiThinking) {
    return null;
  }

  return (
    <div className="ai-suggestion-panel visible-hint">
      <div className="ai-panel-header">
        <div className="ai-panel-header-content">
          <Icon name="Lightbulb" size={20} strokeWidth={2} />
          <h3 className="ai-panel-title">Best Move</h3>
        </div>
      </div>

      <div className="panel-content">
        {isAiThinking ? (
          <div className="thinking-state">
            <LoadingSpinner
              size="small"
              message="AI is thinking..."
              variant="inline"
            />
          </div>
        ) : suggestion ? (
          <div className="suggestion-card expanded">
            <div className="suggestion-header-single">
              <div className="suggestion-info">
                <span className="position-label">
                  {getPositionLabel(suggestion.position)}
                </span>
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{
                      width: `${suggestion.confidence}%`,
                      background: getConfidenceColor(suggestion.confidence),
                    }}
                  />
                </div>
                <span className="confidence-value">
                  {suggestion.confidence}%
                </span>
              </div>
            </div>

            <div className="suggestion-details-single">
              <p className="strategy-text">{suggestion.strategy}</p>
              <div className="move-type">
                <Icon name="Target" size={14} strokeWidth={2} />
                <span>{suggestion.moveType}</span>
              </div>
            </div>

            <div className="hints-info">
              <span className="hints-remaining">Hints: {hintsRemaining}/3</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AiSuggestionPanel;
