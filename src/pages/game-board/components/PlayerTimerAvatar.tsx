import { useState, useEffect, useRef } from "react";
import Icon from "../../../components/AppIcon";
import "./styles/PlayerTimerAvatar.css";

interface PlayerTimerAvatarProps {
  label: string; // "You" or "AI Opponent" or opponent name
  shortLabel?: string; // Shortened label for mobile (e.g. first name only)
  avatar?: string | null; // URL to profile photo
  isAI?: boolean; // Whether this is the AI player
  symbol: "X" | "O";
  timeRemaining: number; // in seconds (synced from server)
  totalBudget: number; // total time budget in seconds
  isActive: boolean; // whether it's this player's turn (clock is ticking)
  timerEnabled: boolean; // whether the timer is active for this game
  isCurrentUser?: boolean; // highlight border differently for current user
  mirrored?: boolean; // Mirror layout (avatar on right) for opponent
}

const PlayerTimerAvatar = ({
  label,
  shortLabel,
  avatar,
  isAI = false,
  symbol,
  timeRemaining,
  totalBudget,
  isActive,
  timerEnabled,
  isCurrentUser = false,
  mirrored = false,
}: PlayerTimerAvatarProps) => {
  // Local countdown that ticks every second for smooth UI
  const [displayTime, setDisplayTime] = useState(timeRemaining);
  const intervalRef = useRef<number | null>(null);
  const lastSyncRef = useRef(timeRemaining);

  // Sync from server whenever timeRemaining prop changes
  useEffect(() => {
    lastSyncRef.current = timeRemaining;
    setDisplayTime(timeRemaining);
  }, [timeRemaining]);

  // Locally tick down when active
  useEffect(() => {
    if (isActive && timerEnabled && displayTime > 0) {
      intervalRef.current = window.setInterval(() => {
        setDisplayTime((prev) => Math.max(0, prev - 1));
      }, 1000);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, timerEnabled, timeRemaining]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Progress ring calculations
  const SIZE = 56;
  const STROKE_WIDTH = 3;
  const RADIUS = (SIZE - STROKE_WIDTH) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const progress =
    timerEnabled && totalBudget > 0 ? displayTime / totalBudget : 1;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  // Color based on remaining time
  const getTimerColor = () => {
    if (!timerEnabled) return "var(--color-border)";
    if (displayTime <= 10) return "var(--color-error)";
    if (displayTime <= 30) return "var(--color-warning)";
    return "var(--color-success)";
  };

  const isUrgent = timerEnabled && displayTime <= 10 && isActive;
  const isLow =
    timerEnabled && displayTime <= 30 && displayTime > 10 && isActive;

  return (
    <div
      className={`player-timer-avatar ${isActive ? "active" : ""} ${isCurrentUser ? "current-user" : ""} ${isUrgent ? "urgent" : ""} ${isLow ? "low-time" : ""} ${mirrored ? "mirrored" : ""}`}
    >
      <div className="avatar-ring-container">
        <svg
          className="timer-ring"
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
        >
          {/* Background ring */}
          <circle
            className="timer-ring-bg"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE_WIDTH}
          />
          {/* Progress ring */}
          {timerEnabled && (
            <circle
              className="timer-ring-progress"
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              strokeWidth={STROKE_WIDTH}
              stroke={getTimerColor()}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          )}
        </svg>

        {/* Avatar image or icon */}
        <div className="avatar-inner">
          {avatar ? (
            <img src={avatar} alt={label} className="avatar-image" />
          ) : isAI ? (
            <div className="avatar-placeholder ai-avatar">
              <Icon name="Bot" size={22} strokeWidth={1.8} />
            </div>
          ) : (
            <div className="avatar-placeholder human-avatar">
              <Icon name="User" size={22} strokeWidth={1.8} />
            </div>
          )}
        </div>

        {/* Active turn indicator dot */}
        {isActive && <div className="active-turn-dot" />}

        {/* Mobile-only time display below avatar */}
        {timerEnabled ? (
          <span
            className={`player-time-mobile ${isUrgent ? "time-urgent" : ""} ${isLow ? "time-low" : ""}`}
          >
            {formatTime(displayTime)}
          </span>
        ) : (
          <span className="player-time-mobile no-timer">—</span>
        )}
      </div>

      {/* Player info (desktop) */}
      <div className="player-info">
        <span className="player-label">
          <span className="player-label-full">{label}</span>
          <span className="player-label-short">{shortLabel || label}</span>
          <span className={`player-symbol symbol-${symbol}`}>{symbol}</span>
        </span>
        {timerEnabled ? (
          <span
            className={`player-time ${isUrgent ? "time-urgent" : ""} ${isLow ? "time-low" : ""}`}
          >
            {formatTime(displayTime)}
          </span>
        ) : (
          <span className="player-time no-timer">No Timer</span>
        )}
      </div>

      {/* Mobile-only compact label */}
      <span className="player-mobile-label">
        {shortLabel || label}{" "}
        <span className={`player-symbol symbol-${symbol}`}>{symbol}</span>
      </span>
    </div>
  );
};

export default PlayerTimerAvatar;
