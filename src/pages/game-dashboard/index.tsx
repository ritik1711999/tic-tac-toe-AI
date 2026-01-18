import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../../components/ui/Header";
import QuickActionsMenu from "../../components/ui/QuickActionsMenu";
import NewGameCard from "./components/NewGameCard";
import StatisticsPanel from "./components/StatisticsPanel";
import RecentGamesList from "./components/RecentGamesList";
import AchievementsBadges from "./components/AchievementsBadges";
import AIRecommendations from "./components/AIRecommendations";
import { useCreateGame } from "../../hooks/useGames";
import "./gameDashboard.css";

const GameDashboard = () => {
  const navigate = useNavigate();
  const createGameMutation = useCreateGame();

  const handleNewGame = async () => {
    try {
      // Create game with default settings: Human mode (local multiplayer)
      const gamePayload = {
        vs: "Human" as const,
      };

      const createdGame = await createGameMutation.mutateAsync(gamePayload);

      // Navigate to game board with the created game ID
      navigate(`/play-game/${createdGame._id}`, {
        state: {
          gameMode: "local",
        },
      });
    } catch (err: any) {
      console.error("Error creating game from quick actions:", err);
      // Error handling is managed by the mutation
    } finally {
    }
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
              <QuickActionsMenu onNewGame={handleNewGame} />
            </div>

            <div className="page-dashboard-grid">
              <div className="page-dashboard-grid-section page-dashboard-primary-section">
                <NewGameCard />
                <StatisticsPanel />
                <AIRecommendations />
              </div>

              <div className="page-dashboard-grid-section page-dashboard-secondary-section">
                <RecentGamesList />
                <AchievementsBadges />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default GameDashboard;
