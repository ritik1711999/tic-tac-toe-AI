import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import "./styles/LeaveGameConfirmationModal.css";

interface LeaveGameConfirmationModalProps {
  isOpen: boolean;
  targetRoute: string | null;
  isAiThinking: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LeaveGameConfirmationModal = ({
  isOpen,
  targetRoute,
  isAiThinking,
  onConfirm,
  onCancel,
}: LeaveGameConfirmationModalProps) => {
  if (!isOpen) return null;

  const getNavigationMessage = () => {
    if (isAiThinking) {
      return "The AI is currently calculating a move. Are you sure you want to leave the game?";
    }

    if (targetRoute === "/dashboard") {
      return "Are you sure you want to leave the game and return to the dashboard?";
    }

    if (targetRoute === "/history") {
      return "Are you sure you want to leave the game and view your history?";
    }

    return "Are you sure you want to leave the game? Your progress will be lost.";
  };

  const getTargetText = () => {
    if (targetRoute === "/dashboard") {
      return "Dashboard";
    }
    if (targetRoute === "/history") {
      return "History";
    }
    return null;
  };

  return (
    <>
      <div className="confirmation-modal-overlay" onClick={onCancel}>
        <div
          className="confirmation-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="confirmation-modal-close-button"
            onClick={onCancel}
            aria-label="Close modal"
          >
            <Icon name="X" size={20} strokeWidth={2} />
          </button>

          <div className="confirmation-icon">
            <Icon
              name="AlertCircle"
              size={56}
              strokeWidth={2}
              color="var(--color-warning)"
            />
          </div>

          <h2 className="confirmation-title">Leave Game?</h2>
          <p className="confirmation-message">{getNavigationMessage()}</p>

          {isAiThinking && (
            <div className="ai-thinking-warning">
              <Icon name="Loader2" size={16} strokeWidth={2} />
              <span>AI is thinking...</span>
            </div>
          )}

          <div className="confirmation-actions">
            <Button
              variant="outline"
              iconName="X"
              iconPosition="left"
              onClick={onCancel}
              fullWidth
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              iconName="LogOut"
              iconPosition="left"
              onClick={onConfirm}
              fullWidth
            >
              Leave to {getTargetText() || "Dashboard"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaveGameConfirmationModal;
