import Button from "../../../components/ui/Button";
import "./styles/GameControls.css";

interface GameControlsProps {
  onHint: () => void;
  onNewGame: () => void;
  onLeaveGame?: () => void;
  onViewAnalysis?: () => void;
  isGameOver: boolean;
  hintsRemaining: number;
  disableHint?: boolean;
}

const GameControls = ({
  onHint,
  onNewGame,
  onLeaveGame,
  onViewAnalysis,
  isGameOver,
  hintsRemaining,
  disableHint = false,
}: GameControlsProps) => {
  return (
    <>
      <div className="game-controls-container">
        {!isGameOver ? (
          <div className="active-game-controls">
            <Button
              variant="secondary"
              iconName="Lightbulb"
              iconPosition="left"
              onClick={onHint}
              disabled={disableHint || hintsRemaining === 0}
            >
              Hint ({hintsRemaining})
            </Button>

            {onLeaveGame && (
              <Button
                variant="destructive"
                iconName="LogOut"
                iconPosition="left"
                onClick={onLeaveGame}
              >
                Leave Game
              </Button>
            )}
          </div>
        ) : (
          <div className="game-over-controls">
            <Button
              variant="primary"
              iconName="Plus"
              iconPosition="left"
              onClick={onNewGame}
            >
              New Game
            </Button>
            {onViewAnalysis && (
              <Button
                variant="secondary"
                iconName="BarChart3"
                iconPosition="left"
                onClick={onViewAnalysis}
              >
                View Analysis
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default GameControls;
