import Button from "../../../components/ui/Button";
import "./styles/GameControls.css";

interface GameControlsProps {
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onHint: () => void;
  onNewGame: () => void;
  onLeaveGame?: () => void;
  isPaused: boolean;
  isGameOver: boolean;
  hintsRemaining: number;
}

const GameControls = ({
  onPause,
  onResume,
  onRestart,
  onHint,
  onNewGame,
  onLeaveGame,
  isPaused,
  isGameOver,
  hintsRemaining,
}: GameControlsProps) => {
  return (
    <>
      <div className="game-controls-container">
        {!isGameOver ? (
          <div className="active-game-controls">
            <Button
              variant={isPaused ? "secondary" : "outline"}
              iconName={isPaused ? "Play" : "Pause"}
              iconPosition="left"
              onClick={isPaused ? onResume : onPause}
            >
              {isPaused ? "Resume" : "Pause"}
            </Button>

            <Button
              variant="outline"
              iconName="RotateCcw"
              iconPosition="left"
              onClick={onRestart}
            >
              Restart
            </Button>

            <Button
              variant="secondary"
              iconName="Lightbulb"
              iconPosition="left"
              onClick={onHint}
              disabled={hintsRemaining === 0 || isPaused}
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

            <Button
              variant="outline"
              iconName="RotateCcw"
              iconPosition="left"
              onClick={onRestart}
              fullWidth
            >
              Play Again
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default GameControls;
