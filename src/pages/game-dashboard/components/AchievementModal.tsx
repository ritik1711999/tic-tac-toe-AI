import { useEffect, useState } from "react";
import Icon from "../../../components/AppIcon";
import { useMarkAchievementSeen } from "../../../hooks/useAchievements";
import "./styles/AchievementModal.css";

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: Date;
  };
}

const AchievementModal = ({
  isOpen,
  onClose,
  achievement,
}: AchievementModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const markSeenMutation = useMarkAchievementSeen();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = async () => {
    setIsClosing(true);

    // Mark achievement as seen on backend
    try {
      await markSeenMutation.mutateAsync(achievement.id);
    } catch (error) {
      console.error("Failed to mark achievement seen:", error);
    }

    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  const formattedDate = new Date(achievement.unlockedAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div
      className={`achievement-modal-overlay ${isVisible ? "active" : ""} ${isClosing ? "closing" : ""}`}
    >
      <div className="achievement-modal-content">
        <button className="achievement-modal-close" onClick={handleClose}>
          ×
        </button>

        <div className="achievement-modal-icon">
          <Icon
            name={achievement.icon || "Award"}
            size={64}
            color="var(--color-warning)"
            strokeWidth={1.5}
          />
        </div>

        <h2 className="achievement-modal-title">Achievement Unlocked!</h2>

        <div className="achievement-modal-body">
          <div className="achievement-badge">
            <h3 className="achievement-badge-title">{achievement.title}</h3>
            <p className="achievement-badge-description">
              {achievement.description}
            </p>
          </div>

          <div className="achievement-modal-date">
            <Icon
              name="Calendar"
              size={16}
              color="var(--color-muted-foreground)"
            />
            <span>Unlocked on {formattedDate}</span>
          </div>

          <p className="achievement-modal-message">
            Keep up the great work! More achievements await.
          </p>
        </div>

        <button className="achievement-modal-btn" onClick={handleClose}>
          Awesome!
        </button>
      </div>
    </div>
  );
};

export default AchievementModal;
