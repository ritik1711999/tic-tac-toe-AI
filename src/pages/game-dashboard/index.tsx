import { Helmet } from "react-helmet";
import Header from "../../components/ui/Header";
import QuickActionsMenu from "../../components/ui/QuickActionsMenu";
import NewGameCard from "./components/NewGameCard";
import StatisticsPanel from "./components/StatisticsPanel";
import RecentGamesList from "./components/RecentGamesList";
import AchievementsBadges from "./components/AchievementsBadges";
import AIRecommendations from "./components/AIRecommendations";
import "./gameDashboard.css";

const GameDashboard = () => {
  const handleNewGame = () => {
    // setShowNewGameModal(true);
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

      <div className="page-dashboard-layout">
        <Header />

        <main className="page-dashboard-main">
          <div className="page-dashboard-container">
            <div className="page-dashboard-header">
              <div className="page-dashboard-header-content">
                <h1 className="page-dashboard-title">Game Dashboard</h1>
                <p className="page-dashboard-description">
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

            <div className="page-dashboard-grid">
              <div className="page-dashboard-grid-section page-dashboard-primary-section">
                <NewGameCard />
                <StatisticsPanel />
              </div>

              <div className="page-dashboard-grid-section page-dashboard-secondary-section">
                <RecentGamesList />
              </div>

              <div className="page-dashboard-grid-section page-dashboard-tertiary-section">
                <AchievementsBadges />
              </div>

              <div className="page-dashboard-grid-section page-dashboard-quaternary-section">
                <AIRecommendations />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default GameDashboard;
