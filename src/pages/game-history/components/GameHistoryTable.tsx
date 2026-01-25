import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import type { SortConfig } from "../types";
import type { RecentGame } from "../../../hooks/useGames";
import "./styles/GameHistoryTable.css";

interface GameHistoryTableProps {
  games: RecentGame[];
  onAnalyze: (gameId: string) => void;
}

const GameHistoryTable: React.FC<GameHistoryTableProps> = ({
  games,
  onAnalyze,
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
      return (
        direction *
        (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      );
    }
    if (sortConfig.key === "duration") {
      return direction * (a.durationSeconds - b.durationSeconds);
    }
    if (sortConfig.key === "moves") {
      return direction * (a.moves - b.moves);
    }
    return 0;
  });

  const formatDate = (dateStr: string | Date) => {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string | Date) => {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "win":
        return "table-outcome-win";
      case "lose":
        return "table-outcome-lose";
      case "draw":
        return "table-outcome-draw";
      default:
        return "";
    }
  };

  const extractDifficulty = (opponent: string): string => {
    if (opponent.includes("Easy")) return "easy";
    if (opponent.includes("Medium")) return "medium";
    if (opponent.includes("Hard")) return "hard";
    return "easy";
  };

  const getDifficultyBadge = (opponent: string) => {
    const difficulty = extractDifficulty(opponent);
    const badges: Record<string, { label: string; class: string }> = {
      easy: { label: "Easy", class: "table-difficulty-easy" },
      medium: { label: "Medium", class: "table-difficulty-medium" },
      hard: { label: "Hard", class: "table-difficulty-hard" },
    };
    return badges[difficulty] || badges.easy;
  };

  return (
    <>
      <div className="game-history-table">
        <div className="table-container">
          <table className="history-table">
            <thead>
              <tr>
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
                <th className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedGames.map((game) => {
                const difficulty = getDifficultyBadge(game.opponent);

                return (
                  <tr key={game.id}>
                    <td className="date-column">
                      <div className="date-info">
                        <span className="date-text">
                          {formatDate(game.timestamp)}
                        </span>
                        <span className="time-text">
                          {formatTime(game.timestamp)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`table-difficulty-badge ${difficulty.class}`}
                      >
                        {difficulty.label}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`table-outcome-badge ${getOutcomeColor(
                          game.result,
                        )}`}
                      >
                        {game.result.charAt(0).toUpperCase() +
                          game.result.slice(1)}
                      </span>
                    </td>
                    <td className="moves-column">{game.moves}</td>
                    <td className="duration-column">{game.duration}</td>
                    <td className="actions-column">
                      <div className="table-action-buttons">
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
