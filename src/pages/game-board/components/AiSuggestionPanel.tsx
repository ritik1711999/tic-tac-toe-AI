import { useState } from "react";
import Icon from "../../../components/AppIcon";

const AiSuggestionPanel = ({
  suggestions,
  isVisible,
  onToggle,
  isAiThinking,
}) => {
  const [expandedSuggestion, setExpandedSuggestion] = useState(null);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "var(--color-success)";
    if (confidence >= 60) return "var(--color-warning)";
    return "var(--color-error)";
  };

  const getPositionLabel = (position) => {
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
      <style jsx>{`
        .ai-suggestion-panel {
          position: fixed;
          top: 64px;
          right: 0;
          width: 320px;
          height: calc(100vh - 64px);
          background: var(--color-card);
          border-left: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          transition: transform var(--transition-base);
          z-index: 40;
        }

        .ai-suggestion-panel.collapsed {
          transform: translateX(calc(100% - 48px));
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid var(--color-border);
          background: var(--color-muted);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .panel-title {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-foreground);
          margin: 0;
        }

        .thinking-indicator {
          display: flex;
          align-items: center;
          color: var(--color-primary);
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .toggle-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: var(--color-foreground);
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
        }

        .toggle-button:hover {
          background: var(--color-muted);
        }

        .panel-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 48px 24px;
          color: var(--color-muted-foreground);
        }

        .empty-text {
          font-family: var(--font-body);
          font-size: 0.875rem;
          text-align: center;
          margin: 0;
        }

        .suggestions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .suggestion-card {
          background: var(--color-background);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all var(--transition-fast);
        }

        .suggestion-card:hover {
          border-color: var(--color-primary);
        }

        .suggestion-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          cursor: pointer;
        }

        .suggestion-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .position-label {
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-foreground);
        }

        .confidence-bar {
          width: 100%;
          height: 6px;
          background: var(--color-muted);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .confidence-fill {
          height: 100%;
          transition: width var(--transition-base);
        }

        .confidence-value {
          font-family: var(--font-data);
          font-size: 0.75rem;
          color: var(--color-muted-foreground);
        }

        .suggestion-details {
          padding: 12px;
          border-top: 1px solid var(--color-border);
          background: var(--color-card);
        }

        .strategy-text {
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--color-foreground);
          line-height: 1.5;
          margin: 0 0 8px 0;
        }

        .move-type {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          background: var(--color-muted);
          border-radius: var(--radius-sm);
          font-family: var(--font-body);
          font-size: 0.75rem;
          color: var(--color-muted-foreground);
          width: fit-content;
        }

        @media (max-width: 1023px) {
          .ai-suggestion-panel {
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 50vh;
            border-left: none;
            border-top: 1px solid var(--color-border);
          }

          .ai-suggestion-panel.collapsed {
            transform: translateY(calc(100% - 56px));
          }

          .toggle-button {
            transform: rotate(90deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ai-suggestion-panel,
          .suggestion-card,
          .confidence-fill,
          .animate-spin {
            transition: none;
            animation: none;
          }
        }
      `}</style>
    </>
  );
};

export default AiSuggestionPanel;
