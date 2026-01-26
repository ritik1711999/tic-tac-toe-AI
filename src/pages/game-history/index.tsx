import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../../components/ui/Header";
import GameHistoryTable from "./components/GameHistoryTable";
import GameHistoryMobileCard from "./components/GameHistoryMobileCard";
import FilterPanel from "./components/FilterPanel";
import StatisticsPanel from "./components/StatisticsPanel";
import EmptyState from "./components/EmptyState";
import Button from "../../components/ui/Button";
import {
  useGameHistory,
  useGameHistoryStats,
  type GameHistoryFilters,
} from "../../hooks/useGames";
import type { GameStats } from "./types";
import "./gameHistory.css";

const GameHistory: React.FC = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [filters, setFilters] = useState<GameHistoryFilters>({
    search: "",
    dateFrom: "",
    dateTo: "",
    outcome: "",
    difficulty: "",
    duration: "",
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch games using infinite query
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    status,
  } = useGameHistory(filters, 10);

  // Fetch history stats using server-side aggregation
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useGameHistoryStats(filters);

  // Flatten all pages of games
  const allGames = data?.pages.flatMap((page) => page.games) || [];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Use server stats if available, otherwise provide fallback
  const stats: GameStats = statsData
    ? {
        totalGames: statsData.totalGames,
        wins: statsData.wins,
        loses: statsData.loses,
        draws: statsData.draws,
        totalMoves: statsData.totalMoves,
        totalDuration: statsData.totalDuration,
        winRate: statsData.winRate,
        avgMoves: statsData.avgMoves,
        avgDuration: statsData.avgDuration,
        outcomeBreakdown: statsData.outcomeBreakdown,
        byDifficulty: statsData.byDifficulty,
      }
    : {
        totalGames: 0,
        wins: 0,
        loses: 0,
        draws: 0,
        totalMoves: 0,
        totalDuration: 0,
        byDifficulty: [],
      };

  const handleReplay = (gameId: string) => {
    navigate("/game-board", { state: { replayGameId: gameId } });
  };

  const handleAnalyze = (gameId: string) => {
    navigate(`/analysis/${gameId}`);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      dateFrom: "",
      dateTo: "",
      outcome: "",
      difficulty: "",
      duration: "",
    });
  };

  const handleFilterChange = (newFilters: GameHistoryFilters) => {
    // Reset to first page when filters change
    setFilters(newFilters);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v && v !== "");

  const isEmpty = status === "success" && allGames.length === 0;
  const isLoadingInitial = isLoading && allGames.length === 0;

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

        <main className="main-content">
          <div className="content-container">
            <div className="page-header">
              <div className="game-history-header-content">
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
                  onFilterChange={handleFilterChange}
                  onReset={handleResetFilters}
                  resultCount={allGames.length}
                />

                {isLoadingInitial ? (
                  <div className="loading-state">
                    <p>Loading your games...</p>
                  </div>
                ) : isEmpty ? (
                  <EmptyState
                    hasFilters={hasActiveFilters}
                    onResetFilters={handleResetFilters}
                  />
                ) : (
                  <>
                    {isMobile ? (
                      <div className="mobile-cards-container">
                        {allGames.map((game) => (
                          <GameHistoryMobileCard
                            key={game.id}
                            game={game}
                            onReplay={handleReplay}
                            onAnalyze={handleAnalyze}
                          />
                        ))}
                      </div>
                    ) : (
                      <GameHistoryTable
                        games={allGames}
                        onAnalyze={handleAnalyze}
                      />
                    )}

                    {/* Load More trigger element */}
                    <div ref={loadMoreRef} className="load-more-trigger" />

                    {/* Load More button or loading indicator */}
                    {hasNextPage && (
                      <div className="load-more-container">
                        <Button
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                          variant="secondary"
                          className="load-more-button"
                        >
                          {isFetchingNextPage
                            ? "Loading..."
                            : "Load More Games"}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>

              <aside className="sidebar-content">
                <StatisticsPanel
                  stats={stats}
                  isLoading={statsLoading}
                  error={statsError}
                />
              </aside>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default GameHistory;
