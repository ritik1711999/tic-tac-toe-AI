import Button from "../../../components/ui/Button";
import "./styles/GameControls.css";

interface GameControlsProps {
  onHint: () => void;
  onNewGame: () => void;
  onLeaveGame?: () => void;
  isGameOver: boolean;
  hintsRemaining: number;
}

const GameControls = ({
  onHint,
  onNewGame,
  onLeaveGame,
  isGameOver,
  hintsRemaining,
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
              disabled={hintsRemaining === 0}
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
              fullWidth
            >
              New Game
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default GameControls;
