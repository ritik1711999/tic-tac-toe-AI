import Icon from "../../../components/AppIcon";
import type { Achievement } from "../types";
import "./styles/AchievementsBadges.css";

const AchievementsBadges = () => {
  const achievements: Achievement[] = [
    {
      id: 1,
      name: "First Victory",
      description: "Win your first game",
      icon: "Award",
      color: "var(--color-success)",
      unlocked: true,
      unlockedDate: "12/15/2025",
    },
    {
      id: 2,
      name: "Winning Streak",
      description: "Win 5 games in a row",
      icon: "Flame",
      color: "var(--color-warning)",
      unlocked: true,
      unlockedDate: "12/18/2025",
    },
    {
      id: 3,
      name: "Strategic Master",
      description: "Win against Expert AI",
      icon: "Brain",
      color: "var(--color-primary)",
      unlocked: false,
      progress: 60,
    },
    {
      id: 4,
      name: "Speed Demon",
      description: "Win a game in under 2 minutes",
      icon: "Zap",
      color: "var(--color-accent)",
      unlocked: true,
      unlockedDate: "12/17/2025",
    },
    {
      id: 5,
      name: "Century Club",
      description: "Play 100 games",
      icon: "Target",
      color: "var(--color-secondary)",
      unlocked: false,
      progress: 85,
    },
    {
      id: 6,
      name: "Perfect Game",
      description: "Win without opponent scoring",
      icon: "Star",
      color: "var(--color-success)",
      unlocked: false,
      progress: 0,
    },
  ];

  const skillLevel = {
    current: "Advanced",
    progress: 72,
    nextLevel: "Expert",
    gamesUntilNext: 15,
  };

  return (
    <>
      <div className="achievements-badges">
        <div className="achievements-section-header">
          <h3 className="achievements-section-title">Achievements & Progress</h3>
          <p className="section-subtitle">Track your gaming milestones</p>
        </div>

        <div className="skill-level-card">
          <div className="skill-header">
            <div className="skill-icon">
              <Icon
                name="TrendingUp"
                size={24}
                color="var(--color-primary)"
                strokeWidth={2}
              />
            </div>
            <div className="skill-info">
              <h4 className="skill-current">
                Skill Level: {skillLevel?.current}
              </h4>
              <p className="skill-next">
                {skillLevel?.gamesUntilNext} games until {skillLevel?.nextLevel}
              </p>
            </div>
          </div>
          <div className="achievements-progress-bar">
            <div
              className="achievements-progress-fill"
              style={{ width: `${skillLevel?.progress}%` }}
            />
          </div>
          <div className="progress-label">
            <span>{skillLevel?.progress}% Complete</span>
          </div>
        </div>

        <div className="achievements-grid">
          {achievements?.map((achievement) => (
            <div
              key={achievement?.id}
              className={`achievement-card ${
                achievement?.unlocked ? "unlocked" : "locked"
              }`}
            >
              <div
                className="achievement-icon"
                style={{ background: `${achievement?.color}15` }}
              >
                <Icon
                  name={achievement?.icon}
                  size={28}
                  color={
                    achievement?.unlocked
                      ? achievement?.color
                      : "var(--color-muted-foreground)"
                  }
                  strokeWidth={2}
                />
              </div>
              <div className="achievement-content">
                <h5 className="achievement-name">{achievement?.name}</h5>
                <p className="achievement-description">
                  {achievement?.description}
                </p>
                {achievement?.unlocked ? (
                  <div className="unlocked-badge">
                    <Icon name="Check" size={12} strokeWidth={3} />
                    <span>Unlocked {achievement?.unlockedDate}</span>
                  </div>
                ) : (
                  achievement?.progress !== undefined && (
                    <div className="progress-indicator">
                      <div className="mini-progress-bar">
                        <div
                          className="mini-progress-fill"
                          style={{ width: `${achievement?.progress}%` }}
                        />
                      </div>
                      <span className="progress-text">
                        {achievement?.progress}%
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AchievementsBadges;
