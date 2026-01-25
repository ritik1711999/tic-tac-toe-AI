import { useEffect, useState } from "react";
import Icon from "../../../components/AppIcon";
import apiClient from "../../../lib/api/client";
import "./styles/LevelUpModal.css";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  previousSkill: string | null;
  newSkill: string;
  skillPoints: number;
}

const LevelUpModal = ({
  isOpen,
  onClose,
  previousSkill,
  newSkill,
  skillPoints,
}: LevelUpModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = async () => {
    setIsClosing(true);

    // Mark level-up as seen on backend
    try {
      await apiClient.patch("/progression/level-up-seen");
    } catch (error) {
      console.error("Failed to mark level-up seen:", error);
    }

    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`level-up-modal-overlay ${isVisible ? "active" : ""} ${isClosing ? "closing" : ""}`}
    >
      <div className="level-up-modal-content">
        <button className="level-up-modal-close" onClick={handleClose}>
          ×
        </button>

        <div className="level-up-modal-icon">
          <Icon
            name="Award"
            size={64}
            color="var(--color-success)"
            strokeWidth={1.5}
          />
        </div>

        <h2 className="level-up-modal-title">Level Up!</h2>

        <div className="level-up-modal-body">
          <p className="level-up-modal-subtitle">
            Congratulations on your achievement!
          </p>

          <div className="level-up-modal-skill-transition">
            <div className="skill-badge old">
              <span className="skill-label">{previousSkill || "Novice"}</span>
            </div>

            <div className="skill-badge-arrow">
              <Icon name="ArrowRight" size={24} color="var(--color-primary)" />
            </div>

            <div className="skill-badge new">
              <span className="skill-label">{newSkill}</span>
            </div>
          </div>

          <div className="level-up-modal-stats">
            <div className="stat-item">
              <span className="stat-label">Total Skill Points</span>
              <span className="stat-value">{skillPoints}</span>
            </div>
          </div>

          <p className="level-up-modal-message">
            Keep playing to unlock the next rank!
          </p>
        </div>

        <button className="level-up-modal-btn" onClick={handleClose}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;
