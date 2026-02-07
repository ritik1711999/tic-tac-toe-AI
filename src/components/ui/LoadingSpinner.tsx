import React from "react";
import "../styles/ui/LoadingSpinner.css";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  message?: string;
  variant?: "default" | "inline";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  message,
  variant = "default",
}) => {
  return (
    <div className={`loading-spinner-container ${variant}`}>
      <div className={`loading-spinner ${size}`}>
        <div className="tictactoe-grid">
          {/* 3x3 Grid */}
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="grid-cell">
              {/* Animated X and O pieces */}
              {index % 3 === 0 ? (
                <div className="piece piece-x" style={{ animationDelay: `${index * 0.15}s` }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M18 6L6 18M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              ) : index % 3 === 1 ? (
                <div className="piece piece-o" style={{ animationDelay: `${index * 0.15}s` }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="8" strokeWidth="2.5" />
                  </svg>
                </div>
              ) : (
                <div className="piece piece-empty" style={{ animationDelay: `${index * 0.15}s` }} />
              )}
            </div>
          ))}
        </div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
