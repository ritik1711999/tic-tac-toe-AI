import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import "./styles/EmptyState.css";

interface EmptyStateProps {
  hasFilters: boolean;
  onResetFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  onResetFilters,
}) => {
  const navigate = useNavigate();

  if (hasFilters) {
    return (
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
    );
  }

  return (
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
  );
};

export default EmptyState;
