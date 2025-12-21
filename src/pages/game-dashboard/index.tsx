import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../../components/ui/Header";
import QuickActionsMenu from "../../components/ui/QuickActionsMenu";
import NewGameCard from "./components/NewGameCard";
import StatisticsPanel from "./components/StatisticsPanel";
import RecentGamesList from "./components/RecentGamesList";
import AchievementsBadges from "./components/AchievementsBadges";
import AIRecommendations from "./components/AIRecommendations";

const GameDashboard = () => {
  const [showNewGameModal, setShowNewGameModal] = useState(false);

  const handleNewGame = () => {
    setShowNewGameModal(true);
  };

  return (
    <>
      <Helmet>
        <title>Game Dashboard - TicTacToe Master</title>
        <meta
          name="description"
          content="Access your TicTacToe gaming hub with statistics, recent games, achievements, and AI-powered recommendations for strategic improvement."
        />
      </Helmet>

      <div className="dashboard-layout">
        <Header />

        <main className="dashboard-main">
          <div className="dashboard-container">
            <div className="dashboard-header">
              <div className="header-content">
                <h1 className="page-title">Game Dashboard</h1>
                <p className="page-description">
                  Welcome back! Track your progress and start new games
                </p>
              </div>
              <QuickActionsMenu
                onNewGame={handleNewGame}
                onPauseGame={() => {}}
                onResumeGame={() => {}}
                onRestartGame={() => {}}
              />
            </div>

            <div className="dashboard-grid">
              <div className="grid-section primary-section">
                <NewGameCard />
                <StatisticsPanel />
              </div>

              <div className="grid-section secondary-section">
                <RecentGamesList />
              </div>

              <div className="grid-section tertiary-section">
                <AchievementsBadges />
              </div>

              <div className="grid-section quaternary-section">
                <AIRecommendations />
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .dashboard-layout {
          min-height: 100vh;
          background: var(--color-background);
        }

        .dashboard-main {
          padding-top: 64px;
          min-height: 100vh;
        }

        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .dashboard-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 32px;
        }

        .header-content {
          flex: 1;
          min-width: 0;
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
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 24px;
        }

        .grid-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .primary-section {
          grid-column: span 4;
        }

        .secondary-section {
          grid-column: span 8;
        }

        .tertiary-section {
          grid-column: span 7;
        }

        .quaternary-section {
          grid-column: span 5;
        }

        @media (max-width: 1200px) {
          .primary-section {
            grid-column: span 5;
          }

          .secondary-section {
            grid-column: span 7;
          }

          .tertiary-section {
            grid-column: span 12;
          }

          .quaternary-section {
            grid-column: span 12;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 24px 16px;
          }

          .dashboard-header {
            flex-direction: column;
            margin-bottom: 24px;
          }

          .page-title {
            font-size: 1.75rem;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .primary-section,
          .secondary-section,
          .tertiary-section,
          .quaternary-section {
            grid-column: span 1;
          }
        }

        @media (max-width: 480px) {
          .dashboard-container {
            padding: 20px 12px;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .dashboard-grid {
            gap: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default GameDashboard;
