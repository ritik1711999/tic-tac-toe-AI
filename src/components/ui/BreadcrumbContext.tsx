import { Link, useLocation } from "react-router-dom";
import Icon from "../AppIcon";
import "../styles/ui/BreadcrumbContext.css";

interface BreadcrumbContextProps {
  gameTitle?: string;
  gameDate?: string;
  gameId?: string;
  showBackButton?: boolean;
}

const BreadcrumbContext = ({
  gameTitle,
  gameDate,
  gameId,
  showBackButton = true,
}: BreadcrumbContextProps) => {
  const location = useLocation();
  const isAnalysisPage = location?.pathname === "/game-analysis";

  if (!isAnalysisPage || !gameTitle) {
    return null;
  }

  const formatDate = (date: string) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return dateObj?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="breadcrumb-context">
        <div className="breadcrumb-container">
          {showBackButton && (
            <Link to="/game-history" className="back-button">
              <Icon name="ArrowLeft" size={20} strokeWidth={2} />
            </Link>
          )}

          <nav className="breadcrumb-nav" aria-label="Breadcrumb">
            <ol className="breadcrumb-list">
              <li className="breadcrumb-item">
                <Link to="/game-history" className="breadcrumb-link">
                  History
                </Link>
              </li>
              <li className="breadcrumb-separator">
                <Icon name="ChevronRight" size={16} strokeWidth={2} />
              </li>
              <li className="breadcrumb-item current">
                <span className="breadcrumb-current">
                  <span className="game-title">{gameTitle}</span>
                  {gameDate && (
                    <span className="game-meta desktop-only">
                      {" "}
                      - {formatDate(gameDate)}
                    </span>
                  )}
                </span>
              </li>
            </ol>
          </nav>

          {gameId && <span className="game-id desktop-only">#{gameId}</span>}
        </div>
      </div>
    </>
  );
};

export default BreadcrumbContext;
