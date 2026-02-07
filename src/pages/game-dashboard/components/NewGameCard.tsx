import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import { useCreateGame } from "../../../hooks/useGames";
import type { CreateGamePayload } from "../../../hooks/useGames";
import "./styles/NewGameCard.css";

const NewGameCard = () => {
  const navigate = useNavigate();
  const createGameMutation = useCreateGame();
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );
  const [timerDuration, setTimerDuration] = useState<60 | 180 | 300>(180); // Default 3 minutes
  const [gameMode, setGameMode] = useState<"AI" | "Human">("AI");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const difficultyOptions = [
    { value: "easy", label: "Easy", description: "Perfect for beginners" },
    { value: "medium", label: "Medium", description: "Balanced challenge" },
    {
      value: "hard",
      label: "Hard",
      description: "Strategic thinking required",
    },
  ];

  const durationOptions = [
    { value: "60", label: "1 Minute", description: "Fast-paced game" },
    { value: "180", label: "3 Minutes", description: "Balanced pace" },
    { value: "300", label: "5 Minutes", description: "Relaxed gameplay" },
  ];

  const gameModeOptions = [
    { value: "AI", label: "vs AI", description: "Play against computer" },
    {
      value: "Human",
      label: "Local Multiplayer",
      description: "Two players on same device",
    },
  ];

  const handleStartGame = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Map gameMode to vs parameter
      const vs: "Human" | "AI" = gameMode === "AI" ? "AI" : "Human";

      const gamePayload: CreateGamePayload = {
        vs,
        ...(vs === "AI" && { difficulty }),
        ...(vs === "Human" && { timerDuration }),
      };

      const createdGame = await createGameMutation.mutateAsync(gamePayload);

      // Navigate to game board with the created game ID
      navigate(`/play-game/${createdGame._id}`, {
        state: {
          difficulty: gameMode === "AI" ? difficulty : undefined,
          gameMode,
          timerDuration: gameMode === "Human" ? timerDuration : undefined,
        },
      });
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        "Failed to create game. Please try again.";
      setError(errorMessage);
      console.error("Error creating game:", err);
    } finally {
      setIsLoading(false);
    }
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
          {error && (
            <div className="page-dashboard-error-message">
              <Icon name="AlertCircle" size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="page-dashboard-form-group">
            <Select
              label="Game Mode"
              description="Choose how you want to play"
              options={gameModeOptions}
              value={gameMode}
              onChange={(value) => setGameMode(value as "AI" | "Human")}
              disabled={isLoading}
            />
          </div>

          <div className="page-dashboard-form-group">
            {gameMode === "AI" ? (
              <Select
                label="AI Difficulty"
                description="Select challenge level for AI opponent"
                options={difficultyOptions}
                value={difficulty}
                onChange={(value) =>
                  setDifficulty(value as "easy" | "medium" | "hard")
                }
                disabled={isLoading}
              />
            ) : (
              <Select
                label="Time Budget"
                description="Choose time per player in local multiplayer"
                options={durationOptions}
                value={timerDuration.toString()}
                onChange={(value) =>
                  setTimerDuration(parseInt(value as string) as 60 | 180 | 300)
                }
                disabled={isLoading}
              />
            )}
          </div>

          <div className="page-dashboard-action-buttons">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              iconName="Play"
              iconPosition="left"
              onClick={handleStartGame}
              disabled={isLoading}
            >
              {isLoading ? "Creating Game..." : "Start Game"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewGameCard;
