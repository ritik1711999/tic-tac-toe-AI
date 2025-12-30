import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";
import type { Game, SortConfig } from "../types";
import "./styles/GameHistoryTable.css";

interface GameHistoryTableProps {
  games: Game[];
  selectedGames: string[];
  onSelectGame: (gameId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onReplay: (gameId: string) => void;
  onAnalyze: (gameId: string) => void;
  onCompare: () => void;
}

const GameHistoryTable: React.FC<GameHistoryTableProps> = ({
  games,
  selectedGames,
  onSelectGame,
  onSelectAll,
  onReplay,
  onAnalyze,
  onCompare,
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date",
    direction: "desc",
  });

  const handleSort = (key: SortConfig["key"]) => {
    setSortConfig({
      key,
      direction:
        sortConfig?.key === key && sortConfig?.direction === "desc"
          ? "asc"
          : "desc",
    });
  };

  const sortedGames = [...games].sort((a, b) => {
    const direction = sortConfig.direction === "asc" ? 1 : -1;

    if (sortConfig.key === "date") {
      return direction * (a.date.getTime() - b.date.getTime());
    }
    if (sortConfig.key === "duration") {
      return direction * (a.duration - b.duration);
    }
    if (sortConfig.key === "moves") {
      return direction * (a.moves - b.moves);
    }
    if (sortConfig.key === "rating") {
      return direction * (a.rating - b.rating);
    }
    return 0;
  });

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "win":
        return "table-outcome-win";
      case "loss":
        return "table-outcome-loss";
      case "draw":
        return "table-outcome-draw";
      default:
        return "";
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const badges: Record<string, { label: string; class: string }> = {
      easy: { label: "Easy", class: "table-difficulty-easy" },
      medium: { label: "Medium", class: "table-difficulty-medium" },
      hard: { label: "Hard", class: "table-difficulty-hard" },
    };
    return badges[difficulty] || badges.easy;
  };

  const allSelected = games.length > 0 && selectedGames.length === games.length;
  const someSelected =
    selectedGames.length > 0 && selectedGames.length < games.length;

  return (
    <>
      <div className="game-history-table">
        <div className="table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    aria-label="Select all games"
                  />
                </th>
                <th
                  className="sortable-header"
                  onClick={() => handleSort("date")}
                >
                  <div className="header-content">
                    <span>Date & Time</span>
                    <Icon
                      name={
                        sortConfig.key === "date"
                          ? sortConfig.direction === "asc"
                            ? "ArrowUp"
                            : "ArrowDown"
                          : "ArrowUpDown"
                      }
                      size={16}
                      strokeWidth={2}
                    />
                  </div>
                </th>
                <th>Opponent</th>
                <th>Outcome</th>
                <th
                  className="sortable-header"
                  onClick={() => handleSort("moves")}
                >
                  <div className="header-content">
                    <span>Moves</span>
                    <Icon
                      name={
                        sortConfig.key === "moves"
                          ? sortConfig.direction === "asc"
                            ? "ArrowUp"
                            : "ArrowDown"
                          : "ArrowUpDown"
                      }
                      size={16}
                      strokeWidth={2}
                    />
                  </div>
                </th>
                <th
                  className="sortable-header"
                  onClick={() => handleSort("duration")}
                >
                  <div className="header-content">
                    <span>Duration</span>
                    <Icon
                      name={
                        sortConfig.key === "duration"
                          ? sortConfig.direction === "asc"
                            ? "ArrowUp"
                            : "ArrowDown"
                          : "ArrowUpDown"
                      }
                      size={16}
                      strokeWidth={2}
                    />
                  </div>
                </th>
                <th
                  className="sortable-header"
                  onClick={() => handleSort("rating")}
                >
                  <div className="header-content">
                    <span>Rating</span>
                    <Icon
                      name={
                        sortConfig.key === "rating"
                          ? sortConfig.direction === "asc"
                            ? "ArrowUp"
                            : "ArrowDown"
                          : "ArrowUpDown"
                      }
                      size={16}
                      strokeWidth={2}
                    />
                  </div>
                </th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedGames.map((game) => {
                const difficulty = getDifficultyBadge(game.difficulty);
                const isSelected = selectedGames.includes(game.id);

                return (
                  <tr
                    key={game.id}
                    className={isSelected ? "selected-row" : ""}
                  >
                    <td className="checkbox-column">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onSelectGame(game.id)}
                        aria-label={`Select game ${game.id}`}
                      />
                    </td>
                    <td className="date-column">
                      <div className="date-info">
                        <span className="date-text">{formatDate(game.date)}</span>
                        <span className="time-text">{formatTime(game.date)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`table-difficulty-badge ${difficulty.class}`}>
                        {difficulty.label}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`table-outcome-badge ${getOutcomeColor(game.outcome)}`}
                      >
                        {game.outcome.charAt(0).toUpperCase() +
                          game.outcome.slice(1)}
                      </span>
                    </td>
                    <td className="moves-column">{game.moves}</td>
                    <td className="duration-column">
                      {formatDuration(game.duration)}
                    </td>
                    <td className="rating-column">
                      <div className="rating-display">
                        <Icon
                          name="Star"
                          size={16}
                          strokeWidth={2}
                          fill="var(--color-warning)"
                          color="var(--color-warning)"
                        />
                        <span>{game.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="actions-column">
                      <div className="table-action-buttons">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Play"
                          onClick={() => onReplay(game.id)}
                          aria-label="Replay game"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="BarChart3"
                          onClick={() => onAnalyze(game.id)}
                          aria-label="Analyze game"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default GameHistoryTable;
