import Icon from "../../../components/AppIcon";
import "./styles/MoveTimeline.css";
import { type Move } from "../types";

interface MoveTimelineProps {
  moves: Move[];
  currentMoveIndex: number;
  onMoveSelect: (index: number) => void;
}

const MoveTimeline = ({
  moves,
  currentMoveIndex,
  onMoveSelect,
}: MoveTimelineProps) => {
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

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
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

            return (
              <div
                key={index}
                className={`timeline-item ${isActive ? "active" : ""}`}
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
                <div className="timeline-move-number">{index + 1}</div>
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
                    <span className="move-time">
                      {formatTime(move?.timestamp)}
                    </span>
                  </div>

                  <div className="timeline-move-details">
                    <span className="move-position">
                      Position: {move?.position}
                    </span>
                    <div
                      className="quality-badge"
                      style={{ color: quality?.color }}
                    >
                      <Icon name={quality?.icon} size={14} strokeWidth={2} />
                      <span>{quality?.label}</span>
                    </div>
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
