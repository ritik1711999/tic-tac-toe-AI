import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../../components/ui/Header";
import GameHistoryTable from "./components/GameHistoryTable";
import GameHistoryMobileCard from "./components/GameHistoryMobileCard";
import FilterPanel from "./components/FilterPanel";
import StatisticsPanel from "./components/StatisticsPanel";
import BulkActionsBar from "./components/BulkActionsBar";
import EmptyState from "./components/EmptyState";

const GameHistory = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedGames, setSelectedGames] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    dateFrom: "",
    dateTo: "",
    outcome: "all",
    difficulty: "all",
    duration: "all",
  });

  const mockGames = [
    {
      id: "game-001",
      date: new Date("2025-12-19T09:30:00"),
      difficulty: "easy",
      outcome: "win",
      moves: 5,
      duration: 45,
      rating: 4.5,
    },
    {
      id: "game-002",
      date: new Date("2025-12-19T08:15:00"),
      difficulty: "medium",
      outcome: "loss",
      moves: 9,
      duration: 120,
      rating: 3.2,
    },
    {
      id: "game-003",
      date: new Date("2025-12-18T16:45:00"),
      difficulty: "hard",
      outcome: "draw",
      moves: 9,
      duration: 180,
      rating: 3.8,
    },
    {
      id: "game-004",
      date: new Date("2025-12-18T14:20:00"),
      difficulty: "easy",
      outcome: "win",
      moves: 6,
      duration: 52,
      rating: 4.2,
    },
    {
      id: "game-005",
      date: new Date("2025-12-18T11:00:00"),
      difficulty: "medium",
      outcome: "win",
      moves: 7,
      duration: 95,
      rating: 4.7,
    },
    {
      id: "game-006",
      date: new Date("2025-12-17T19:30:00"),
      difficulty: "hard",
      outcome: "loss",
      moves: 8,
      duration: 165,
      rating: 2.9,
    },
    {
      id: "game-007",
      date: new Date("2025-12-17T15:10:00"),
      difficulty: "medium",
      outcome: "win",
      moves: 6,
      duration: 78,
      rating: 4.4,
    },
    {
      id: "game-008",
      date: new Date("2025-12-17T10:45:00"),
      difficulty: "easy",
      outcome: "win",
      moves: 5,
      duration: 38,
      rating: 4.8,
    },
    {
      id: "game-009",
      date: new Date("2025-12-16T20:15:00"),
      difficulty: "hard",
      outcome: "draw",
      moves: 9,
      duration: 195,
      rating: 3.5,
    },
    {
      id: "game-010",
      date: new Date("2025-12-16T17:00:00"),
      difficulty: "medium",
      outcome: "loss",
      moves: 8,
      duration: 110,
      rating: 3.0,
    },
    {
      id: "game-011",
      date: new Date("2025-12-16T13:30:00"),
      difficulty: "easy",
      outcome: "win",
      moves: 5,
      duration: 42,
      rating: 4.6,
    },
    {
      id: "game-012",
      date: new Date("2025-12-15T18:45:00"),
      difficulty: "hard",
      outcome: "win",
      moves: 7,
      duration: 155,
      rating: 4.9,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filterGames = (games) => {
    return games?.filter((game) => {
      const matchesSearch =
        !filters?.search ||
        game?.outcome
          ?.toLowerCase()
          ?.includes(filters?.search?.toLowerCase()) ||
        new Date(game.date)?.toLocaleDateString()?.includes(filters?.search);

      const matchesDateFrom =
        !filters?.dateFrom || new Date(game.date) >= new Date(filters.dateFrom);

      const matchesDateTo =
        !filters?.dateTo ||
        new Date(game.date) <= new Date(filters.dateTo + "T23:59:59");

      const matchesOutcome =
        filters?.outcome === "all" || game?.outcome === filters?.outcome;

      const matchesDifficulty =
        filters?.difficulty === "all" ||
        game?.difficulty === filters?.difficulty;

      const matchesDuration =
        filters?.duration === "all" ||
        (() => {
          if (filters?.duration === "0-60") return game?.duration < 60;
          if (filters?.duration === "60-180")
            return game?.duration >= 60 && game?.duration < 180;
          if (filters?.duration === "180-300")
            return game?.duration >= 180 && game?.duration < 300;
          if (filters?.duration === "300+") return game?.duration >= 300;
          return true;
        })();

      return (
        matchesSearch &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesOutcome &&
        matchesDifficulty &&
        matchesDuration
      );
    });
  };

  const filteredGames = filterGames(mockGames);

  const calculateStats = (games) => {
    const stats = {
      totalGames: games?.length,
      wins: games?.filter((g) => g?.outcome === "win")?.length,
      losses: games?.filter((g) => g?.outcome === "loss")?.length,
      draws: games?.filter((g) => g?.outcome === "draw")?.length,
      totalMoves: games?.reduce((sum, g) => sum + g?.moves, 0),
      totalDuration: games?.reduce((sum, g) => sum + g?.duration, 0),
      byDifficulty: ["easy", "medium", "hard"]?.map((level) => {
        const levelGames = games?.filter((g) => g?.difficulty === level);
        return {
          level,
          games: levelGames?.length,
          wins: levelGames?.filter((g) => g?.outcome === "win")?.length,
          losses: levelGames?.filter((g) => g?.outcome === "loss")?.length,
          draws: levelGames?.filter((g) => g?.outcome === "draw")?.length,
        };
      }),
    };
    return stats;
  };

  const stats = calculateStats(mockGames);

  const handleSelectGame = (gameId) => {
    setSelectedGames((prev) =>
      prev?.includes(gameId)
        ? prev?.filter((id) => id !== gameId)
        : [...prev, gameId]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedGames(checked ? filteredGames?.map((g) => g?.id) : []);
  };

  const handleReplay = (gameId) => {
    console.log("Replaying game:", gameId);
    navigate("/game-board", { state: { replayGameId: gameId } });
  };

  const handleAnalyze = (gameId) => {
    console.log("Analyzing game:", gameId);
    navigate("/game-analysis", { state: { gameId } });
  };

  const handleCompare = () => {
    console.log("Comparing games:", selectedGames);
    alert(
      `Comparing ${selectedGames?.length} games. This feature will show side-by-side analysis.`
    );
  };

  const handleExport = (format) => {
    console.log("Exporting games in format:", format);
    const selectedGameData = mockGames?.filter((g) =>
      selectedGames?.includes(g?.id)
    );
    alert(
      `Exporting ${
        selectedGameData?.length
      } games as ${format?.toUpperCase()}. Download will start shortly.`
    );
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedGames?.length} game(s)? This action cannot be undone.`
      )
    ) {
      console.log("Deleting games:", selectedGames);
      setSelectedGames([]);
      alert("Games deleted successfully.");
    }
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      dateFrom: "",
      dateTo: "",
      outcome: "all",
      difficulty: "all",
      duration: "all",
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(
    (v) => v && v !== "all"
  );

  return (
    <>
      <Helmet>
        <title>Game History - TicTacToe Master</title>
        <meta
          name="description"
          content="View your complete TicTacToe game history with detailed statistics, performance analytics, and game replay options."
        />
      </Helmet>
      <div className="game-history-page">
        <Header />

        <BulkActionsBar
          selectedCount={selectedGames?.length}
          onExport={handleExport}
          onCompare={handleCompare}
          onDelete={handleDelete}
          onClearSelection={() => setSelectedGames([])}
        />

        <main className="main-content">
          <div className="content-container">
            <div className="page-header">
              <div className="header-content">
                <h1 className="page-title">Game History</h1>
                <p className="page-description">
                  Track your performance, analyze past games, and monitor your
                  improvement over time
                </p>
              </div>
            </div>

            <div className="content-layout">
              <div className="primary-content">
                <FilterPanel
                  filters={filters}
                  onFilterChange={setFilters}
                  onReset={handleResetFilters}
                  resultCount={filteredGames?.length}
                />

                {filteredGames?.length === 0 ? (
                  <EmptyState
                    hasFilters={hasActiveFilters}
                    onResetFilters={handleResetFilters}
                  />
                ) : (
                  <>
                    {isMobile ? (
                      <div className="mobile-cards-container">
                        {filteredGames?.map((game) => (
                          <GameHistoryMobileCard
                            key={game?.id}
                            game={game}
                            isSelected={selectedGames?.includes(game?.id)}
                            onSelect={handleSelectGame}
                            onReplay={handleReplay}
                            onAnalyze={handleAnalyze}
                          />
                        ))}
                      </div>
                    ) : (
                      <GameHistoryTable
                        games={filteredGames}
                        selectedGames={selectedGames}
                        onSelectGame={handleSelectGame}
                        onSelectAll={handleSelectAll}
                        onReplay={handleReplay}
                        onAnalyze={handleAnalyze}
                        onCompare={handleCompare}
                      />
                    )}
                  </>
                )}
              </div>

              <aside className="sidebar-content">
                <StatisticsPanel stats={stats} />
              </aside>
            </div>
          </div>
        </main>
      </div>
      <style jsx>{`
        .game-history-page {
          min-height: 100vh;
          background: var(--color-background);
          padding-top: 64px;
        }

        .main-content {
          padding: 32px 0;
        }

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .page-header {
          margin-bottom: 32px;
        }

        .header-content {
          max-width: 800px;
        }

        .page-title {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-foreground);
          margin: 0 0 8px 0;
        }

        .page-description {
          font-family: var(--font-body);
          font-size: 1rem;
          color: var(--color-muted-foreground);
          margin: 0;
          line-height: 1.6;
        }

        .content-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
          align-items: start;
        }

        .primary-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .mobile-cards-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sidebar-content {
          position: sticky;
          top: 96px;
        }

        @media (max-width: 1024px) {
          .content-layout {
            grid-template-columns: 1fr;
          }

          .sidebar-content {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .game-history-page {
            padding-top: 64px;
          }

          .main-content {
            padding: 24px 0;
          }

          .content-container {
            padding: 0 16px;
          }

          .page-header {
            margin-bottom: 24px;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .page-description {
            font-size: 0.875rem;
          }

          .primary-content {
            gap: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default GameHistory;
