import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import type { ExportFormat } from "../types";
import "./styles/BulkActionsBar.css";

interface BulkActionsBarProps {
  selectedCount: number;
  onExport: (format: ExportFormat) => void;
  onCompare: () => void;
  onDelete: () => void;
  onClearSelection: () => void;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onExport,
  onCompare,
  onDelete,
  onClearSelection,
}) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>("json");

  const exportOptions = [
    { value: "json", label: "Export as JSON" },
    { value: "csv", label: "Export as CSV" },
    { value: "pdf", label: "Export as PDF" },
  ];

  const handleExport = () => {
    onExport(exportFormat);
  };

  const handleFormatChange = (value: string | string[]) => {
    setExportFormat(value as ExportFormat);
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
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

        <div className="bulk-action-buttons">
          <div className="export-group">
            <Select
              options={exportOptions}
              value={exportFormat}
              onChange={handleFormatChange}
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
  );
};

export default BulkActionsBar;
