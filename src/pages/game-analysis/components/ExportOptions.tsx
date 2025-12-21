import { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import "./styles/ExportOptions.css";
import { type GameData } from "../types";

interface ExportOptionsProps {
  gameData: GameData;
  onExport: (format: string) => void;
}

const ExportOptions = ({ gameData, onExport }: ExportOptionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const exportFormats = [
    {
      id: "pdf",
      name: "PDF Report",
      icon: "FileText",
      description: "Complete analysis with charts and insights",
    },
    {
      id: "json",
      name: "JSON Data",
      icon: "Code",
      description: "Raw game data and move history",
    },
    {
      id: "csv",
      name: "CSV Export",
      icon: "Table",
      description: "Move-by-move data in spreadsheet format",
    },
    {
      id: "share",
      name: "Share Link",
      icon: "Share2",
      description: "Generate shareable analysis link",
    },
  ];

  const handleExport = (format: string) => {
    onExport?.(format);
    setIsOpen(false);
  };

  return (
    <>
      <div className="export-options-container">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          iconName="Download"
          iconPosition="left"
        >
          Export Analysis
        </Button>

        {isOpen && (
          <div className="export-dropdown">
            <div className="dropdown-header">
              <span className="dropdown-title">Export Options</span>
              <button
                className="close-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close export options"
              >
                <Icon name="X" size={18} strokeWidth={2} />
              </button>
            </div>

            <div className="export-list">
              {exportFormats?.map((format) => (
                <button
                  key={format?.id}
                  className="export-item"
                  onClick={() => handleExport(format?.id)}
                >
                  <div className="export-icon">
                    <Icon name={format?.icon} size={20} strokeWidth={2} />
                  </div>
                  <div className="export-content">
                    <span className="export-name">{format?.name}</span>
                    <span className="export-description">
                      {format?.description}
                    </span>
                  </div>
                  <Icon name="ChevronRight" size={18} strokeWidth={2} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ExportOptions;
