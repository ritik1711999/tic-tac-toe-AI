import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";

const BulkActionsBar = ({
  selectedCount,
  onExport,
  onCompare,
  onDelete,
  onClearSelection,
}) => {
  const [exportFormat, setExportFormat] = useState("json");

  const exportOptions = [
    { value: "json", label: "Export as JSON" },
    { value: "csv", label: "Export as CSV" },
    { value: "pdf", label: "Export as PDF" },
  ];

  const handleExport = () => {
    onExport(exportFormat);
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className="bulk-actions-bar">
        <div className="actions-content">
          <div className="selection-info">
            <Icon name="CheckSquare" size={20} strokeWidth={2} />
            <span className="selection-text">
              {selectedCount} game{selectedCount !== 1 ? "s" : ""} selected
            </span>
            <button
              className="clear-button"
              onClick={onClearSelection}
              aria-label="Clear selection"
            >
              <Icon name="X" size={16} strokeWidth={2} />
            </button>
          </div>

          <div className="action-buttons">
            <div className="export-group">
              <Select
                options={exportOptions}
                value={exportFormat}
                onChange={setExportFormat}
                className="export-select"
              />
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                onClick={handleExport}
              >
                Export
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              iconName="GitCompare"
              onClick={onCompare}
              disabled={selectedCount < 2}
            >
              Compare
            </Button>

            <Button
              variant="destructive"
              size="sm"
              iconName="Trash2"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bulk-actions-bar {
          position: sticky;
          top: 64px;
          z-index: 40;
          background: var(--color-primary);
          border-bottom: 1px solid var(--color-border);
          box-shadow: var(--shadow-md);
          animation: slideDown var(--transition-fast);
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .actions-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .selection-info {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--color-primary-foreground);
        }

        .selection-text {
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 600;
        }

        .clear-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: rgba(255, 255, 255, 0.2);
          color: var(--color-primary-foreground);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .clear-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .export-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .export-select {
          min-width: 160px;
        }

        @media (max-width: 768px) {
          .actions-content {
            flex-direction: column;
            align-items: stretch;
            padding: 12px 16px;
          }

          .selection-info {
            justify-content: space-between;
          }

          .action-buttons {
            flex-wrap: wrap;
          }

          .export-group {
            flex: 1;
            min-width: 100%;
          }

          .export-select {
            flex: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bulk-actions-bar {
            animation: none;
          }

          .clear-button {
            transition: none;
          }
        }
      `}</style>
    </>
  );
};

export default BulkActionsBar;
