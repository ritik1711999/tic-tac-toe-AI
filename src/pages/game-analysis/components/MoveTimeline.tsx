import { useEffect, useRef } from "react";
import Icon from "../../../components/AppIcon";
import "./styles/MoveTimeline.css";
import { type Move } from "../types";

interface MoveTimelineProps {
  moves: Move[];
  currentMoveIndex: number;
  onMoveSelect: (index: number) => void;
  maxAge?: number;
}

const MoveTimeline = ({
  moves,
  currentMoveIndex,
  onMoveSelect,
  maxAge,
}: MoveTimelineProps) => {
  // Create refs for timeline items to enable auto-scrolling
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-scroll to current move when index changes
  useEffect(() => {
    if (itemRefs.current[currentMoveIndex]) {
      itemRefs.current[currentMoveIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentMoveIndex]);

  const getMoveQuality = (quality: Move["quality"]) => {
    const qualities = {
      excellent: {
        icon: "TrendingUp",
        color: "var(--color-success)",
        label: "Excellent",
      },
      good: { icon: "ThumbsUp", color: "var(--color-primary)", label: "Good" },
      suboptimal: {
        icon: "AlertTriangle",
        color: "var(--color-warning)",
        label: "Suboptimal",
      },
      mistake: { icon: "X", color: "var(--color-error)", label: "Mistake" },
    };
    return qualities?.[quality] || qualities?.good;
  };

  const getLifespanColor = (move: Move): string => {
    if (move.expiredOnMove !== null && move.expiredOnMove !== undefined) {
      return "var(--color-error)"; // Red for expired
    }
    if (!maxAge || move.lifespan === undefined) {
      return "var(--color-primary)"; // Default blue for non-aging
    }

    const ratio = move.lifespan / maxAge;
    if (ratio >= 1) return "var(--color-success)"; // Green
    if (ratio >= 0.5) return "var(--color-warning)"; // Yellow
    return "var(--color-error)"; // Red
  };

  const getExpirationLabel = (
    move: Move,
  ): { label: string; style: string } | null => {
    if (!maxAge) return null; // Non-aging game
    if (move.expiredOnMove !== null && move.expiredOnMove !== undefined) {
      return { label: `Expired M${move.expiredOnMove}`, style: "expired" };
    }
    if (move.expiresOnMove !== null && move.expiresOnMove !== undefined) {
      const movesUntilExpiry = move.expiresOnMove - move.moveNumber;
      if (movesUntilExpiry <= 2) {
        return {
          label: `Expires M${move.expiresOnMove}`,
          style: "expiring-soon",
        };
      }
      return { label: `Expires M${move.expiresOnMove}`, style: "expires" };
    }
    return null;
  };

  return (
    <>
      <div className="move-timeline-container">
        <div className="timeline-header">
          <h3 className="timeline-title">Move Timeline</h3>
          <span className="timeline-move-count">{moves?.length} moves</span>
        </div>

        <div className="timeline-list">
          {moves?.map((move, index) => {
            const quality = getMoveQuality(move?.quality);
            const isActive = index === currentMoveIndex;
            const expirationLabel = getExpirationLabel(move);
            const isExpired =
              move.expiredOnMove !== null && move.expiredOnMove !== undefined;
            const lifespanColor = getLifespanColor(move);

            return (
              <div
                key={index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className={`timeline-item ${isActive ? "active" : ""} ${
                  isExpired ? "expired" : ""
                }`}
                style={{ borderLeftColor: lifespanColor }}
                onClick={() => onMoveSelect(index)}
              >
                {isActive && (
                  <div className="active-indicator">
                    <Icon
                      name="ChevronLeft"
                      size={20}
                      strokeWidth={2.5}
                      color="white"
                    />
                  </div>
                )}
                <div
                  className={`timeline-move-number ${
                    isExpired ? "expired-number" : ""
                  }`}
                >
                  {index + 1}
                </div>
                <div className="move-content">
                  <div className="move-header">
                    <div className="player-info">
                      <Icon
                        name={move?.player === "X" ? "X" : "Circle"}
                        size={16}
                        strokeWidth={2.5}
                      />
                      <span className="player-name">Player {move?.player}</span>
                    </div>
                    <div
                      className="quality-badge header-quality"
                      style={{ color: quality?.color }}
                    >
                      <Icon name={quality?.icon} size={14} strokeWidth={2} />
                      <span>{quality?.label}</span>
                    </div>
                  </div>

                  <div className="timeline-move-details">
                    <span className="move-position">
                      Position: {move?.position}
                    </span>
                    {expirationLabel && (
                      <span
                        className={`timeline-expiration-badge ${expirationLabel.style}`}
                      >
                        {expirationLabel.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MoveTimeline;
