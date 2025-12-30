import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import "./styles/NewGameCard.css";

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
      <div className="page-dashboard-new-game-card">
        <div className="page-dashboard-new-game-card-header">
          <div className="page-dashboard-card-header-icon">
            <Icon
              name="Gamepad2"
              size={28}
              color="var(--color-primary)"
              strokeWidth={2.5}
            />
          </div>
          <div className="page-dashboard-card-header-content">
            <h2 className="page-dashboard-card-title">Start New Game</h2>
            <p className="page-dashboard-card-description">
              Configure your game settings and begin playing
            </p>
          </div>
        </div>

        <div className="page-dashboard-card-body">
          <div className="page-dashboard-form-group">
            <Select
              label="Game Mode"
              description="Choose how you want to play"
              options={gameModeOptions}
              value={gameMode}
              onChange={(value) => setGameMode(value as string)}
            />
          </div>

          <div className="page-dashboard-form-group">
            <Select
              label="AI Difficulty"
              description="Select challenge level for AI opponent"
              options={difficultyOptions}
              value={difficulty}
              onChange={(value) => setDifficulty(value as string)}
              disabled={gameMode === "local"}
            />
          </div>

          <div className="page-dashboard-action-buttons">
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
    </>
  );
};

export default NewGameCard;
