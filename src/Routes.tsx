import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import GameBoard from "./pages/game-board";
import GameDashboard from "./pages/game-dashboard";
import GameAnalysis from "./pages/game-analysis";
import GameHistory from "./pages/game-history";
import Login from "./pages/login";
import Register from "./pages/register";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<GameDashboard />} />
          <Route path="/game-board" element={<GameBoard />} />
          <Route path="/game-dashboard" element={<GameDashboard />} />
          <Route path="/game-analysis" element={<GameAnalysis />} />
          <Route path="/game-history" element={<GameHistory />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
