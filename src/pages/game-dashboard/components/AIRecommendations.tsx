import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const AIRecommendations = () => {
  const recommendations = [
    {
      id: 1,
      type: "difficulty",
      title: "Ready for a Challenge?",
      description:
        "Based on your recent performance, you might be ready to try Hard difficulty. Your win rate against Medium AI is 78%.",
      icon: "TrendingUp",
      color: "var(--color-primary)",
      action: "Try Hard Mode",
      priority: "high",
    },
    {
      id: 2,
      type: "strategy",
      title: "Improve Your Opening",
      description:
        "Analysis shows you win 65% more games when starting with center position. Consider this strategy more often.",
      icon: "Target",
      color: "var(--color-secondary)",
      action: "View Analysis",
      priority: "medium",
    },
    {
      id: 3,
      type: "practice",
      title: "Practice Defensive Play",
      description:
        "Your defensive blocking could be stronger. Try focusing on opponent threat detection in your next 5 games.",
      icon: "Shield",
      color: "var(--color-warning)",
      action: "Start Practice",
      priority: "medium",
    },
  ];

  const getPriorityBadge = (priority) => {
    const badges = {
      high: { label: "High Priority", color: "var(--color-error)" },
      medium: { label: "Recommended", color: "var(--color-primary)" },
      low: { label: "Optional", color: "var(--color-muted-foreground)" },
    };
    return badges?.[priority] || badges?.medium;
  };

  return (
    <>
      <div className="ai-recommendations">
        <div className="recommendations-header">
          <div className="header-icon">
            <Icon
              name="Sparkles"
              size={24}
              color="var(--color-primary)"
              strokeWidth={2}
            />
          </div>
          <div className="header-content">
            <h3 className="recommendations-title">AI Recommendations</h3>
            <p className="recommendations-subtitle">
              Personalized insights to improve your game
            </p>
          </div>
        </div>

        <div className="recommendations-list">
          {recommendations?.map((recommendation) => {
            const priorityBadge = getPriorityBadge(recommendation?.priority);
            return (
              <div key={recommendation?.id} className="recommendation-card">
                <div className="card-header">
                  <div
                    className="recommendation-icon"
                    style={{ background: `${recommendation?.color}15` }}
                  >
                    <Icon
                      name={recommendation?.icon}
                      size={24}
                      color={recommendation?.color}
                      strokeWidth={2}
                    />
                  </div>
                  <span
                    className="priority-badge"
                    style={{
                      background: `${priorityBadge?.color}15`,
                      color: priorityBadge?.color,
                    }}
                  >
                    {priorityBadge?.label}
                  </span>
                </div>
                <div className="card-content">
                  <h4 className="recommendation-title">
                    {recommendation?.title}
                  </h4>
                  <p className="recommendation-description">
                    {recommendation?.description}
                  </p>
                </div>
                <div className="card-footer">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="ArrowRight"
                    iconPosition="right"
                  >
                    {recommendation?.action}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="recommendations-footer">
          <div className="footer-info">
            <Icon name="Info" size={16} strokeWidth={2} />
            <span>Recommendations update based on your last 20 games</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .ai-recommendations {
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }

        .recommendations-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .header-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-primary);
          background-opacity: 0.1;
          border-radius: var(--radius-md);
        }

        .header-content {
          flex: 1;
          min-width: 0;
        }

        .recommendations-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-foreground);
          margin: 0 0 4px 0;
        }

        .recommendations-subtitle {
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--color-muted-foreground);
          margin: 0;
        }

        .recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 20px;
        }

        .recommendation-card {
          padding: 20px;
          background: var(--color-muted);
          border-radius: var(--radius-lg);
          transition: transform var(--transition-fast),
            box-shadow var(--transition-fast);
        }

        .recommendation-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }

        .recommendation-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
        }

        .priority-badge {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
        }

        .card-content {
          margin-bottom: 16px;
        }

        .recommendation-title {
          font-family: var(--font-heading);
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-foreground);
          margin: 0 0 8px 0;
        }

        .recommendation-description {
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--color-muted-foreground);
          line-height: 1.6;
          margin: 0;
        }

        .card-footer {
          display: flex;
          justify-content: flex-end;
        }

        .recommendations-footer {
          padding-top: 20px;
          border-top: 1px solid var(--color-border);
        }

        .footer-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-body);
          font-size: 0.75rem;
          color: var(--color-muted-foreground);
        }

        @media (max-width: 767px) {
          .ai-recommendations {
            padding: 20px;
          }

          .card-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .recommendation-card {
            padding: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .recommendation-card {
            transition: none;
          }

          .recommendation-card:hover {
            transform: none;
          }
        }
      `}</style>
    </>
  );
};

export default AIRecommendations;
