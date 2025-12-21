import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const EmptyState = ({ hasFilters, onResetFilters }) => {
  const navigate = useNavigate();

  if (hasFilters) {
    return (
      <>
        <div className="empty-state">
          <div className="empty-icon">
            <Icon
              name="Search"
              size={64}
              strokeWidth={1.5}
              color="var(--color-muted-foreground)"
            />
          </div>
          <h3 className="empty-title">No games found</h3>
          <p className="empty-description">
            No games match your current filters. Try adjusting your search
            criteria or clear all filters to see all games.
          </p>
          <Button
            variant="outline"
            iconName="X"
            iconPosition="left"
            onClick={onResetFilters}
          >
            Clear Filters
          </Button>
        </div>

        <style jsx>{`
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 64px 24px;
            text-align: center;
          }

          .empty-icon {
            margin-bottom: 24px;
            opacity: 0.5;
          }

          .empty-title {
            font-family: var(--font-heading);
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--color-foreground);
            margin: 0 0 12px 0;
          }

          .empty-description {
            font-family: var(--font-body);
            font-size: 1rem;
            color: var(--color-muted-foreground);
            max-width: 480px;
            margin: 0 0 24px 0;
            line-height: 1.6;
          }

          @media (max-width: 768px) {
            .empty-state {
              padding: 48px 16px;
            }

            .empty-title {
              font-size: 1.25rem;
            }

            .empty-description {
              font-size: 0.875rem;
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div className="empty-state">
        <div className="empty-icon">
          <Icon
            name="Gamepad2"
            size={64}
            strokeWidth={1.5}
            color="var(--color-muted-foreground)"
          />
        </div>
        <h3 className="empty-title">No game history yet</h3>
        <p className="empty-description">
          Start playing games to build your history. Your completed games will
          appear here with detailed statistics and analysis options.
        </p>
        <Button
          variant="primary"
          iconName="Play"
          iconPosition="left"
          onClick={() => navigate("/game-board")}
        >
          Start New Game
        </Button>
      </div>

      <style jsx>{`
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 24px;
          text-align: center;
        }

        .empty-icon {
          margin-bottom: 24px;
          opacity: 0.5;
        }

        .empty-title {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-foreground);
          margin: 0 0 12px 0;
        }

        .empty-description {
          font-family: var(--font-body);
          font-size: 1rem;
          color: var(--color-muted-foreground);
          max-width: 480px;
          margin: 0 0 24px 0;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .empty-state {
            padding: 48px 16px;
          }

          .empty-title {
            font-size: 1.25rem;
          }

          .empty-description {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </>
  );
};

export default EmptyState;
