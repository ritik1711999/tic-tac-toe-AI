import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";

const NewGameCard = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("medium");
  const [gameMode, setGameMode] = useState("ai");

  const difficultyOptions = [
    { value: "easy", label: "Easy", description: "Perfect for beginners" },
    { value: "medium", label: "Medium", description: "Balanced challenge" },
    {
      value: "hard",
      label: "Hard",
      description: "Strategic thinking required",
    },
    { value: "expert", label: "Expert", description: "Master level AI" },
  ];

  const gameModeOptions = [
    { value: "ai", label: "vs AI", description: "Play against computer" },
    {
      value: "local",
      label: "Local Multiplayer",
      description: "Two players on same device",
    },
  ];

  const handleStartGame = () => {
    navigate("/game-board", { state: { difficulty, gameMode } });
  };

  return (
    <>
      <div className="new-game-card">
        <div className="card-header">
          <div className="header-icon">
            <Icon
              name="Gamepad2"
              size={28}
              color="var(--color-primary)"
              strokeWidth={2.5}
            />
          </div>
          <div className="header-content">
            <h2 className="card-title">Start New Game</h2>
            <p className="card-description">
              Configure your game settings and begin playing
            </p>
          </div>
        </div>

        <div className="card-body">
          <div className="form-group">
            <Select
              label="Game Mode"
              description="Choose how you want to play"
              options={gameModeOptions}
              value={gameMode}
              onChange={setGameMode}
            />
          </div>

          <div className="form-group">
            <Select
              label="AI Difficulty"
              description="Select challenge level for AI opponent"
              options={difficultyOptions}
              value={difficulty}
              onChange={setDifficulty}
              disabled={gameMode === "local"}
            />
          </div>

          <div className="action-buttons">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              iconName="Play"
              iconPosition="left"
              onClick={handleStartGame}
            >
              Start Game
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .new-game-card {
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: box-shadow var(--transition-fast);
        }

        .new-game-card:hover {
          box-shadow: var(--shadow-md);
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 24px;
          background: linear-gradient(
            135deg,
            var(--color-primary) 0%,
            var(--color-secondary) 100%
          );
          background-opacity: 0.05;
        }

        .header-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-card);
          border-radius: var(--radius-lg);
          flex-shrink: 0;
        }

        .header-content {
          flex: 1;
          min-width: 0;
        }

        .card-title {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-foreground);
          margin: 0 0 4px 0;
        }

        .card-description {
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--color-muted-foreground);
          margin: 0;
        }

        .card-body {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group:last-of-type {
          margin-bottom: 24px;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
        }

        @media (max-width: 767px) {
          .card-header {
            padding: 20px;
          }

          .header-icon {
            width: 48px;
            height: 48px;
          }

          .card-title {
            font-size: 1.25rem;
          }

          .card-body {
            padding: 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .new-game-card {
            transition: none;
          }
        }
      `}</style>
    </>
  );
};

export default NewGameCard;
