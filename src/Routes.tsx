import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route,
  Navigate,
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./store/authStore";
import NotFound from "./pages/NotFound";
import GameBoard from "./pages/game-board";
import GameDashboard from "./pages/game-dashboard";
import GameAnalysis from "./pages/game-analysis";
import GameHistory from "./pages/game-history";
import Login from "./pages/login";
import Register from "./pages/register";

const Routes = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <GameDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <GameHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/play-game/:gameId"
            element={
              <ProtectedRoute>
                <GameBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis/:gameId"
            element={
              <ProtectedRoute>
                <GameAnalysis />
              </ProtectedRoute>
            }
          />

          {/* Default and 404 */}
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
            }
          />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
