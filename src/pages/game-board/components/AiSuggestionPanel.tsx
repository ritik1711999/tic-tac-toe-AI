import { useState } from "react";
import Icon from "../../../components/AppIcon";
import type { Suggestion } from "../types";
import "./styles/AiSuggestionPanel.css";

interface AiSuggestionPanelProps {
  suggestions: Suggestion[];
  isVisible: boolean;
  onToggle: () => void;
  isAiThinking: boolean;
}

const AiSuggestionPanel = ({
  suggestions,
  isVisible,
  onToggle,
  isAiThinking,
}: AiSuggestionPanelProps) => {
  const [expandedSuggestion, setExpandedSuggestion] = useState<number | null>(
    null
  );

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

  return (
    <>
      <div
        className={`ai-suggestion-panel ${isVisible ? "visible" : "collapsed"}`}
      >
        <div className="panel-header">
          <div className="header-content">
            <Icon name="Lightbulb" size={20} strokeWidth={2} />
            <h3 className="panel-title">AI Suggestions</h3>
            {isAiThinking && (
              <div className="thinking-indicator">
                <Icon
                  name="Loader2"
                  size={16}
                  strokeWidth={2}
                  className="animate-spin"
                />
              </div>
            )}
          </div>
          <button
            className="toggle-button"
            onClick={onToggle}
            aria-label={isVisible ? "Collapse panel" : "Expand panel"}
          >
            <Icon
              name={isVisible ? "ChevronRight" : "ChevronLeft"}
              size={20}
              strokeWidth={2}
            />
          </button>
        </div>

        {isVisible && (
          <div className="panel-content">
            {suggestions?.length === 0 ? (
              <div className="empty-state">
                <Icon name="Info" size={32} strokeWidth={1.5} />
                <p className="empty-text">No suggestions available yet</p>
              </div>
            ) : (
              <div className="suggestions-list">
                {suggestions?.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`suggestion-card ${
                      expandedSuggestion === index ? "expanded" : ""
                    }`}
                  >
                    <div
                      className="suggestion-header"
                      onClick={() =>
                        setExpandedSuggestion(
                          expandedSuggestion === index ? null : index
                        )
                      }
                    >
                      <div className="suggestion-info">
                        <span className="position-label">
                          {getPositionLabel(suggestion?.position)}
                        </span>
                        <div className="confidence-bar">
                          <div
                            className="confidence-fill"
                            style={{
                              width: `${suggestion?.confidence}%`,
                              background: getConfidenceColor(
                                suggestion?.confidence
                              ),
                            }}
                          />
                        </div>
                        <span className="confidence-value">
                          {suggestion?.confidence}%
                        </span>
                      </div>
                      <Icon
                        name={
                          expandedSuggestion === index
                            ? "ChevronUp"
                            : "ChevronDown"
                        }
                        size={16}
                        strokeWidth={2}
                      />
                    </div>

                    {expandedSuggestion === index && (
                      <div className="suggestion-details">
                        <p className="strategy-text">{suggestion?.strategy}</p>
                        <div className="move-type">
                          <Icon name="Target" size={14} strokeWidth={2} />
                          <span>{suggestion?.moveType}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AiSuggestionPanel;
