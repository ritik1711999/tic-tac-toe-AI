import React from "react";
import Button from "../../../components/ui/Button";

const GameControls = ({
  onPause,
  onResume,
  onRestart,
  onHint,
  onNewGame,
  isPaused,
  isGameOver,
  hintsRemaining,
}) => {
  return (
    <>
      <div className="game-controls-container">
        {!isGameOver ? (
          <div className="active-game-controls">
            <Button
              variant={isPaused ? "default" : "outline"}
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

      <style jsx>{`
        .game-controls-container {
          padding: 16px;
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
        }

        .active-game-controls {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .active-game-controls > :global(button) {
          flex: 1;
          min-width: 120px;
        }

        .game-over-controls {
          display: flex;
          gap: 12px;
        }

        .game-over-controls > :global(button) {
          flex: 1;
        }

        @media (max-width: 767px) {
          .game-controls-container {
            padding: 12px;
          }

          .active-game-controls {
            gap: 8px;
          }

          .active-game-controls > :global(button) {
            min-width: 100px;
          }

          .game-over-controls {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
};

export default GameControls;
