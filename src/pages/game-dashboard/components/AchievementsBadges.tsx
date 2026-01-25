import Icon from "../../../components/AppIcon";
import "./styles/AchievementsBadges.css";
import {
  useProgression,
  useProgressionRefetchOnGameEnd,
} from "../../../hooks/useProgression";
import {
  useAchievements,
  useAchievementsRefetchOnGameEnd,
} from "../../../hooks/useAchievements";

const AchievementsBadges = () => {
  const { data: progression, isLoading } = useProgression();
  const { data: achievements, isLoading: achievementsLoading } =
    useAchievements();

  useProgressionRefetchOnGameEnd();
  useAchievementsRefetchOnGameEnd();

  const skillCurrentLabel = progression?.currentSkill?.label ?? "—";
  const skillProgressPct = Math.round(progression?.progressPercent ?? 0);
  const nextLabel = progression?.nextSkill?.label ?? "—";
  const pointsToNext = progression?.pointsToNextLevel ?? 0;

  return (
    <>
      <div className="achievements-badges">
        <div className="achievements-section-header">
          <h3 className="achievements-section-title">
            Achievements & Progress
          </h3>
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
                Skill Level: {isLoading ? "Loading..." : skillCurrentLabel}
              </h4>
              <p className="skill-next">
                {isLoading
                  ? ""
                  : `Next: ${nextLabel} • ${pointsToNext} pts to level`}
              </p>
            </div>
          </div>
          <div className="achievements-progress-bar">
            <div
              className="achievements-progress-fill"
              style={{ width: `${skillProgressPct}%` }}
            />
          </div>
          <div className="progress-label">
            <span>{skillProgressPct}% Complete</span>
          </div>
        </div>

        <div className="achievements-grid">
          {achievementsLoading ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "2rem",
              }}
            >
              Loading achievements...
            </div>
          ) : (
            achievements?.map((achievement: any) => {
              const progressPercent =
                achievement.target > 0
                  ? Math.round(
                      (achievement.progress / achievement.target) * 100,
                    )
                  : 0;

              const formattedDate = achievement.unlockedAt
                ? new Date(achievement.unlockedAt).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })
                : "";

              return (
                <div
                  key={achievement.id}
                  className={`achievement-card ${
                    achievement.isUnlocked ? "unlocked" : "locked"
                  }`}
                >
                  <div
                    className="achievement-icon"
                    style={{
                      background: achievement.isUnlocked
                        ? "var(--color-success-subtle)"
                        : "var(--color-muted)",
                    }}
                  >
                    <Icon
                      name={achievement.icon}
                      size={28}
                      color={
                        achievement.isUnlocked
                          ? "var(--color-success)"
                          : "var(--color-muted-foreground)"
                      }
                      strokeWidth={2}
                    />
                  </div>
                  <div className="achievement-content">
                    <h5 className="achievement-name">{achievement.title}</h5>
                    <p className="achievement-description">
                      {achievement.description}
                    </p>
                    {achievement.isUnlocked ? (
                      <div className="unlocked-badge">
                        <Icon name="Check" size={12} strokeWidth={3} />
                        <span>Unlocked {formattedDate}</span>
                      </div>
                    ) : (
                      <div className="progress-indicator">
                        <div className="mini-progress-bar">
                          <div
                            className="mini-progress-fill"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <span className="progress-text">
                          {achievement.progress} / {achievement.target}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default AchievementsBadges;
