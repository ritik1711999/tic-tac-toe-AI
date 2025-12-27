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
    </>
  );
};

export default GameDashboard;
