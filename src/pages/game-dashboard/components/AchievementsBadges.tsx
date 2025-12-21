import React from "react";
import Icon from "../../../components/AppIcon";

const AchievementsBadges = () => {
  const achievements = [
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
        <div className="section-header">
          <h3 className="section-title">Achievements & Progress</h3>
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
          <div className="progress-bar">
            <div
              className="progress-fill"
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
      <style jsx>{`
        .achievements-badges {
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }

        .section-header {
          margin-bottom: 24px;
        }

        .section-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-foreground);
          margin: 0 0 4px 0;
        }

        .section-subtitle {
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--color-muted-foreground);
          margin: 0;
        }

        .skill-level-card {
          padding: 20px;
          background: linear-gradient(
            135deg,
            var(--color-primary) 0%,
            var(--color-secondary) 100%
          );
          background-opacity: 0.05;
          border-radius: var(--radius-lg);
          margin-bottom: 24px;
        }

        .skill-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .skill-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-card);
          border-radius: var(--radius-md);
        }

        .skill-info {
          flex: 1;
          min-width: 0;
        }

        .skill-current {
          font-family: var(--font-heading);
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--color-foreground);
          margin: 0 0 4px 0;
        }

        .skill-next {
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--color-muted-foreground);
          margin: 0;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: var(--color-muted);
          border-radius: var(--radius-sm);
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(
            90deg,
            var(--color-primary) 0%,
            var(--color-secondary) 100%
          );
          border-radius: var(--radius-sm);
          transition: width var(--transition-slow);
        }

        .progress-label {
          display: flex;
          justify-content: flex-end;
          font-family: var(--font-data);
          font-size: 0.75rem;
          color: var(--color-muted-foreground);
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .achievement-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          background: var(--color-muted);
          border-radius: var(--radius-lg);
          transition: transform var(--transition-fast),
            box-shadow var(--transition-fast);
        }

        .achievement-card.unlocked {
          border: 1px solid var(--color-success);
          border-opacity: 0.2;
        }

        .achievement-card.locked {
          opacity: 0.6;
        }

        .achievement-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .achievement-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          flex-shrink: 0;
        }

        .achievement-content {
          flex: 1;
          min-width: 0;
        }

        .achievement-name {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-foreground);
          margin: 0 0 4px 0;
        }

        .achievement-description {
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--color-muted-foreground);
          margin: 0 0 12px 0;
        }

        .unlocked-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--color-success);
          padding: 4px 8px;
          background: var(--color-success);
          background-opacity: 0.1;
          border-radius: var(--radius-sm);
          width: fit-content;
        }

        .progress-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mini-progress-bar {
          flex: 1;
          height: 4px;
          background: var(--color-border);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .mini-progress-fill {
          height: 100%;
          background: var(--color-primary);
          border-radius: var(--radius-sm);
          transition: width var(--transition-slow);
        }

        .progress-text {
          font-family: var(--font-data);
          font-size: 0.75rem;
          color: var(--color-muted-foreground);
          white-space: nowrap;
        }

        @media (max-width: 767px) {
          .achievements-badges {
            padding: 20px;
          }

          .achievements-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .skill-level-card {
            padding: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .achievement-card,
          .progress-fill,
          .mini-progress-fill {
            transition: none;
          }

          .achievement-card:hover {
            transform: none;
          }
        }
      `}</style>
    </>
  );
};

export default AchievementsBadges;
