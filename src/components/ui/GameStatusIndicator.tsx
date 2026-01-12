import { useLocation } from "react-router-dom";
import Icon from "../AppIcon";
import "../styles/ui/GameStatusIndicator.css";

interface GameStatusIndicatorProps {
  currentTurn?: string;
  moveCount?: number;
  gameTime?: string;
  isGameActive?: boolean;
  agingEnabled?: boolean;
  maxAge?: number;
}

const GameStatusIndicator = ({
  currentTurn = "X",
  moveCount = 0,
  gameTime = "00:00",
  isGameActive = false,
  agingEnabled = false,
  maxAge = 5,
}: GameStatusIndicatorProps) => {
  const location = useLocation();
  const isGameBoard = location?.pathname.includes("/play-game/");

  if (!isGameBoard || !isGameActive) {
    return null;
  }

  return (
    <>
      <div className="game-status-indicator">
        <div className="status-item current-turn">
          <Icon name="User" size={16} strokeWidth={2} />
          <span className="status-label">Turn:</span>
          <span className="status-value turn-value">{currentTurn}</span>
        </div>

        <div className="status-divider" />

        <div className="status-item move-count">
          <Icon name="Move" size={16} strokeWidth={2} />
          <span className="status-label desktop-only">Moves:</span>
          <span className="status-value">{moveCount}</span>
        </div>

        <div className="status-divider desktop-only" />

        <div className="status-item game-timer desktop-only">
          <Icon name="Clock" size={16} strokeWidth={2} />
          <span className="status-value">{gameTime}</span>
        </div>

        {agingEnabled && (
          <>
            <div className="status-divider desktop-only" />
            <div className="status-item aging-status desktop-only">
              <Icon name="Zap" size={16} strokeWidth={2} />
              <span className="status-label">Aging:</span>
              <span className="status-value aging-badge">Max Age {maxAge}</span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GameStatusIndicator;
