import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { useRecommendations } from "../../../hooks/useRecommendations";
import { useCreateGame } from "../../../hooks/useGames";
import type { Recommendation } from "../../../hooks/useRecommendations";
import "./styles/AiRecommendations.css";

const AIRecommendations = () => {
  const navigate = useNavigate();
  const { data: recommendations, isLoading, error } = useRecommendations();
  const createGameMutation = useCreateGame();

  const handleRecommendationAction = async (rec: Recommendation) => {
    const { action } = rec;

    try {
      if (action.type === "play-game") {
        // Create game with specified difficulty
        const createdGame = await createGameMutation.mutateAsync({
          vs: "AI",
          difficulty: (action.difficulty || "medium") as
            | "easy"
            | "medium"
            | "hard",
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Navigate to game
        navigate(`/play-game/${createdGame._id}`, {
          state: { gameMode: "ai" },
        });
      } else if (action.type === "view-analysis") {
        // Navigate to game history for analysis
        navigate("/history");

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error handling recommendation action:", error);
    }
  };

  const getRecommendationIcon = (iconType: string): string => {
    const iconMap: Record<string, string> = {
      "trending-up": "TrendingUp",
      target: "Target",
      lightbulb: "Lightbulb",
      shield: "Shield",
    };
    return iconMap[iconType] || "Sparkles";
  };

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

  // Loading state
  if (isLoading) {
    return (
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
              Analyzing your performance...
            </p>
          </div>
        </div>
        <div className="recommendations-list">
          <div className="recommendation-card" style={{ opacity: 0.6 }}>
            <div className="recommendation-card-header">
              <div
                className="recommendation-icon skeleton"
                style={{ width: 48, height: 48 }}
              />
              <span
                className="priority-badge skeleton"
                style={{ width: 100, height: 24 }}
              />
            </div>
            <div className="recommendations-card-content">
              <div
                className="skeleton"
                style={{ width: "70%", height: 20, marginBottom: 8 }}
              />
              <div className="skeleton" style={{ width: "100%", height: 16 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error or no recommendations
  if (error || !recommendations || recommendations.length === 0) {
    return null; // Hide section if no recommendations
  }

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
            const iconName = getRecommendationIcon(recommendation?.icon);

            return (
              <div key={recommendation?.id} className="recommendation-card">
                <div className="recommendation-card-header">
                  <div
                    className="recommendation-icon"
                    style={{ background: `var(--color-primary-foreground)15` }}
                  >
                    <Icon
                      name={iconName}
                      size={24}
                      color="var(--color-primary-foreground)"
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
                    onClick={() => handleRecommendationAction(recommendation)}
                    disabled={createGameMutation.isPending}
                  >
                    {recommendation?.action?.label}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="recommendations-footer">
          <div className="footer-info">
            <Icon name="Info" size={16} strokeWidth={2} />
            <span>
              Recommendations are refreshed every 24 hours using your last 10
              games
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIRecommendations;
