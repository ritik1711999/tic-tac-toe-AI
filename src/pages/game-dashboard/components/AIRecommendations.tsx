import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import type { Recommendation } from "../types";
import "./styles/AiRecommendations.css";

const AIRecommendations = () => {
  const recommendations: Recommendation[] = [
    {
      id: 1,
      type: "difficulty",
      title: "Ready for a Challenge?",
      description:
        "Based on your recent performance, you might be ready to try Hard difficulty. Your win rate against Medium AI is 78%.",
      icon: "TrendingUp",
      color: "var(--color-primary-foreground)",
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
      color: "var(--color-primary-foreground)",
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
      color: "var(--color-primary-foreground)",
      action: "Start Practice",
      priority: "medium",
    },
  ];

  const getPriorityBadge = (priority: "high" | "medium" | "low") => {
    const badges = {
      high: {
        label: "High Priority",
        color: "var(--color-primary-foreground)",
      },
      medium: {
        label: "Recommended",
        color: "var(--color-primary-foreground)",
      },
      low: { label: "Optional", color: "var(--color-primary-foreground)" },
    };
    return badges?.[priority] || badges?.medium;
  };

  return (
    <>
      <div className="ai-recommendations">
        <div className="recommendations-header">
          <div className="recommendations-header-icon">
            <Icon
              name="Sparkles"
              size={24}
              color="var(--color-primary-foreground)"
              strokeWidth={2}
            />
          </div>
          <div className="recommendations-header-content">
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
                <div className="recommendation-card-header">
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
                <div className="recommendations-card-content">
                  <h4 className="recommendation-title">
                    {recommendation?.title}
                  </h4>
                  <p className="recommendation-description">
                    {recommendation?.description}
                  </p>
                </div>
                <div className="recommendations-card-footer">
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
    </>
  );
};

export default AIRecommendations;
