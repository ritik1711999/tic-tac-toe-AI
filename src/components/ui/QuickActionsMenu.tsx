import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Icon from "../AppIcon";
import "../styles/ui/QuickActionsMenu.css";

interface QuickActionsMenuProps {
  onNewGame?: () => void;
  onPauseGame?: () => void;
  onResumeGame?: () => void;
  onRestartGame?: () => void;
  isGameActive?: boolean;
  isGamePaused?: boolean;
}

const QuickActionsMenu = ({
  onNewGame,
  onPauseGame,
  onResumeGame,
  onRestartGame,
  isGameActive = false,
  isGamePaused = false,
}: QuickActionsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isDashboard = location?.pathname === "/game-dashboard";
  const isGameBoard = location?.pathname === "/game-board";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getContextActions = () => {
    if (isDashboard) {
      return [
        {
          label: "New Game",
          icon: "Plus",
          onClick: () => {
            onNewGame?.();
            setIsOpen(false);
          },
          variant: "primary",
        },
      ];
    }

    if (isGameBoard && isGameActive) {
      return [
        {
          label: isGamePaused ? "Resume" : "Pause",
          icon: isGamePaused ? "Play" : "Pause",
          onClick: () => {
            isGamePaused ? onResumeGame?.() : onPauseGame?.();
            setIsOpen(false);
          },
        },
        {
          label: "Restart",
          icon: "RotateCcw",
          onClick: () => {
            onRestartGame?.();
            setIsOpen(false);
          },
          variant: "warning",
        },
      ];
    }

    return [];
  };

  const actions = getContextActions();

  if (actions?.length === 0) {
    return null;
  }

  return (
    <>
      <div className="quick-actions-menu" ref={menuRef}>
        <button
          className="quick-actions-trigger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Quick actions"
          aria-expanded={isOpen}
        >
          <Icon name="MoreVertical" size={20} strokeWidth={2} />
        </button>

        {isOpen && (
          <div className="quick-actions-dropdown">
            {actions?.map((action, index) => (
              <button
                key={index}
                className={`action-item ${action?.variant || ""}`}
                onClick={action?.onClick}
              >
                <Icon name={action?.icon} size={18} strokeWidth={2} />
                <span>{action?.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default QuickActionsMenu;
