import Button from "../../../components/ui/Button";
import "./styles/ReplayControls.css";

interface ReplayControlsProps {
  currentMoveIndex: number;
  totalMoves: number;
  onFirst: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onLast: () => void;
  isPlaying: boolean;
  onPlayPause: () => void;
}

const ReplayControls = ({
  currentMoveIndex,
  totalMoves,
  onFirst,
  onPrevious,
  onNext,
  onLast,
  isPlaying,
  onPlayPause,
}: ReplayControlsProps) => {
  const progress =
    totalMoves > 0 ? ((currentMoveIndex + 1) / totalMoves) * 100 : 0;

  return (
    <>
      <div className="replay-controls-container">
        <div className="progress-section">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-info">
            <span className="current-move">Move {currentMoveIndex + 1}</span>
            <span className="total-moves">of {totalMoves}</span>
          </div>
        </div>

        <div className="controls-section">
          <Button
            variant="outline"
            size="icon"
            onClick={onFirst}
            disabled={currentMoveIndex === 0}
            iconName="ChevronsLeft"
            iconSize={20}
            aria-label="First move"
          >
            <span className="sr-only">First move</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onPrevious}
            disabled={currentMoveIndex === 0}
            iconName="ChevronLeft"
            iconSize={20}
            aria-label="Previous move"
          >
            <span className="sr-only">Previous move</span>
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={onPlayPause}
            iconName={isPlaying ? "Pause" : "Play"}
            iconSize={20}
            className="play-button"
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            disabled={currentMoveIndex >= totalMoves - 1}
            iconName="ChevronRight"
            iconSize={20}
            aria-label="Next move"
          >
            <span className="sr-only">Next move</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onLast}
            disabled={currentMoveIndex >= totalMoves - 1}
            iconName="ChevronsRight"
            iconSize={20}
            aria-label="Last move"
          >
            <span className="sr-only">Last move</span>
          </Button>
        </div>
      </div>

      {/* <style jsx>{`
        .replay-controls-container {
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .progress-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .progress-bar {
          height: 6px;
          background: var(--color-muted);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--color-primary);
          transition: width var(--transition-base);
        }

        .progress-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-data);
          font-size: 0.75rem;
        }

        .current-move {
          color: var(--color-foreground);
          font-weight: 600;
        }

        .total-moves {
          color: var(--color-muted-foreground);
        }

        .controls-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .play-button {
          min-width: 120px;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        @media (max-width: 767px) {
          .replay-controls-container {
            padding: 16px;
          }

          .controls-section {
            gap: 6px;
          }

          .play-button {
            min-width: 100px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .progress-fill {
            transition: none;
          }
        }
      `}</style> */}
    </>
  );
};

export default ReplayControls;
