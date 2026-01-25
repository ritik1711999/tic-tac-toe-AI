import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Input from "../../../components/ui/Input";
import type { GameHistoryFilters } from "../../../hooks/useGames";
import "./styles/FilterPanel.css";

interface FilterPanelProps {
  filters: GameHistoryFilters;
  onFilterChange: (filters: GameHistoryFilters) => void;
  onReset: () => void;
  resultCount: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
  resultCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const outcomeOptions = [
    { value: "", label: "All Outcomes" },
    { value: "win", label: "Wins" },
    { value: "lose", label: "Loses" },
    { value: "draw", label: "Draws" },
  ];

  const difficultyOptions = [
    { value: "", label: "All Difficulties" },
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  const durationOptions = [
    { value: "", label: "Any Duration" },
    { value: "0-60", label: "Under 1 minute" },
    { value: "60-180", label: "1-3 minutes" },
    { value: "180-300", label: "3-5 minutes" },
    { value: "300+", label: "Over 5 minutes" },
  ];

  const handleOutcomeChange = (value: string | string[]) => {
    onFilterChange({ ...filters, outcome: value as string });
  };

  const handleDifficultyChange = (value: string | string[]) => {
    onFilterChange({ ...filters, difficulty: value as string });
  };

  const handleDurationChange = (value: string | string[]) => {
    onFilterChange({ ...filters, duration: value as string });
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, dateFrom: e.target.value });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, dateTo: e.target.value });
  };

  const openNativePicker = (e: React.FocusEvent<HTMLInputElement>) => {
    // Hint the browser to open the date picker immediately
    if (typeof (e.target as HTMLInputElement).showPicker === "function") {
      (e.target as HTMLInputElement).showPicker();
    }
  };
  const activeFilterCount = Object.values(filters)?.filter(
    (v) => v && v !== "",
  )?.length;

  return (
    <div className="history-filter-panel">
      <div className="history-filter-header">
        <div className="history-filter-header-left">
          <Icon name="Filter" size={20} strokeWidth={2} />
          <h3 className="history-filter-title">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="history-filter-badge">{activeFilterCount}</span>
          )}
        </div>
        <div className="history-filter-header-right">
          <span className="history-result-count">
            {resultCount} games found
          </span>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" iconName="X" onClick={onReset}>
              Clear
            </Button>
          )}
          <button
            className="history-mobile-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Toggle filters"
          >
            <Icon
              name={isExpanded ? "ChevronUp" : "ChevronDown"}
              size={20}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      <div className={`history-filter-content ${isExpanded ? "expanded" : ""}`}>
        <div className="history-filter-grid">
          <div className="history-filter-group">
            <Input
              type="date"
              label="From Date"
              value={filters?.dateFrom || ""}
              onChange={handleDateFromChange}
              onFocus={openNativePicker}
            />
          </div>

          <div className="history-filter-group">
            <Input
              type="date"
              label="To Date"
              value={filters?.dateTo || ""}
              onChange={handleDateToChange}
              onFocus={openNativePicker}
            />
          </div>

          <div className="history-filter-group">
            <Select
              label="Outcome"
              options={outcomeOptions}
              value={filters?.outcome || ""}
              onChange={handleOutcomeChange}
            />
          </div>

          <div className="history-filter-group">
            <Select
              label="Difficulty"
              options={difficultyOptions}
              value={filters?.difficulty || ""}
              onChange={handleDifficultyChange}
            />
          </div>

          <div className="history-filter-group">
            <Select
              label="Duration"
              options={durationOptions}
              value={filters?.duration || ""}
              onChange={handleDurationChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
