import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";

const GameHistoryTable = ({
  games,
  selectedGames,
  onSelectGame,
  onSelectAll,
  onReplay,
  onAnalyze,
  onCompare,
}) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig?.key === key && sortConfig?.direction === "desc"
          ? "asc"
          : "desc",
    });
  };

  const sortedGames = [...games]?.sort((a, b) => {
    const direction = sortConfig?.direction === "asc" ? 1 : -1;

    if (sortConfig?.key === "date") {
      return direction * (new Date(a.date) - new Date(b.date));
    }
    if (sortConfig?.key === "duration") {
      return direction * (a?.duration - b?.duration);
    }
    if (sortConfig?.key === "moves") {
      return direction * (a?.moves - b?.moves);
    }
    if (sortConfig?.key === "rating") {
      return direction * (a?.rating - b?.rating);
    }
    return 0;
  });

  const formatDate = (date) => {
    const d = new Date(date);
    return d?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, "0")}`;
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case "win":
        return "outcome-win";
      case "loss":
        return "outcome-loss";
      case "draw":
        return "outcome-draw";
      default:
        return "";
    }
  };

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: { label: "Easy", class: "difficulty-easy" },
      medium: { label: "Medium", class: "difficulty-medium" },
      hard: { label: "Hard", class: "difficulty-hard" },
    };
    return badges?.[difficulty] || badges?.easy;
  };

  const allSelected =
    games?.length > 0 && selectedGames?.length === games?.length;
  const someSelected =
    selectedGames?.length > 0 && selectedGames?.length < games?.length;

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
                    onChange={(e) => onSelectAll(e?.target?.checked)}
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
                        sortConfig?.key === "date"
                          ? sortConfig?.direction === "asc"
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
                        sortConfig?.key === "moves"
                          ? sortConfig?.direction === "asc"
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
                        sortConfig?.key === "duration"
                          ? sortConfig?.direction === "asc"
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
                        sortConfig?.key === "rating"
                          ? sortConfig?.direction === "asc"
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
              {sortedGames?.map((game) => {
                const difficulty = getDifficultyBadge(game?.difficulty);
                const isSelected = selectedGames?.includes(game?.id);

                return (
                  <tr
                    key={game?.id}
                    className={isSelected ? "selected-row" : ""}
                  >
                    <td className="checkbox-column">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onSelectGame(game?.id)}
                        aria-label={`Select game ${game?.id}`}
                      />
                    </td>
                    <td className="date-column">
                      <div className="date-info">
                        <span className="date-text">
                          {formatDate(game?.date)}
                        </span>
                        <span className="time-text">
                          {formatTime(game?.date)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`difficulty-badge ${difficulty?.class}`}>
                        {difficulty?.label}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`outcome-badge ${getOutcomeColor(
                          game?.outcome
                        )}`}
                      >
                        {game?.outcome?.charAt(0)?.toUpperCase() +
                          game?.outcome?.slice(1)}
                      </span>
                    </td>
                    <td className="moves-column">{game?.moves}</td>
                    <td className="duration-column">
                      {formatDuration(game?.duration)}
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
                        <span>{game?.rating?.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="actions-column">
                      <div className="action-buttons">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Play"
                          onClick={() => onReplay(game?.id)}
                          aria-label="Replay game"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="BarChart3"
                          onClick={() => onAnalyze(game?.id)}
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
      <style jsx>{`
        .game-history-table {
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .table-container {
          overflow-x: auto;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          font-family: var(--font-body);
        }

        .history-table thead {
          background: var(--color-muted);
          border-bottom: 1px solid var(--color-border);
        }

        .history-table th {
          padding: 12px 16px;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-foreground);
          white-space: nowrap;
        }

        .sortable-header {
          cursor: pointer;
          user-select: none;
          transition: background var(--transition-fast);
        }

        .sortable-header:hover {
          background: var(--color-muted);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .checkbox-column {
          width: 48px;
          text-align: center;
        }

        .actions-column {
          width: 120px;
          text-align: center;
        }

        .history-table tbody tr {
          border-bottom: 1px solid var(--color-border);
          transition: background var(--transition-fast);
        }

        .history-table tbody tr:hover {
          background: var(--color-muted);
        }

        .history-table tbody tr.selected-row {
          background: rgba(30, 64, 175, 0.05);
        }

        .history-table td {
          padding: 16px;
          font-size: 0.875rem;
          color: var(--color-foreground);
        }

        .date-column {
          min-width: 140px;
        }

        .date-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .date-text {
          font-weight: 500;
          color: var(--color-foreground);
        }

        .time-text {
          font-size: 0.75rem;
          color: var(--color-muted-foreground);
        }

        .difficulty-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .difficulty-easy {
          background: rgba(16, 185, 129, 0.1);
          color: var(--color-success);
        }

        .difficulty-medium {
          background: rgba(245, 158, 11, 0.1);
          color: var(--color-warning);
        }

        .difficulty-hard {
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-error);
        }

        .outcome-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .outcome-win {
          background: rgba(16, 185, 129, 0.1);
          color: var(--color-success);
        }

        .outcome-loss {
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-error);
        }

        .outcome-draw {
          background: rgba(107, 114, 128, 0.1);
          color: var(--color-muted-foreground);
        }

        .moves-column,
        .duration-column {
          font-family: var(--font-data);
          font-weight: 500;
        }

        .rating-display {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        @media (max-width: 1024px) {
          .history-table th,
          .history-table td {
            padding: 12px;
            font-size: 0.8125rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sortable-header,
          .history-table tbody tr {
            transition: none;
          }
        }
      `}</style>
    </>
  );
};

export default GameHistoryTable;
