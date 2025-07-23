"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn";

export interface SortProps {
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  options: { value: string; label: string }[];
  className?: string;
}

export function Sort({
  sortBy,
  sortOrder,
  onSortChange,
  options,
  className,
}: SortProps) {
  const { t } = useTranslation();

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value, sortOrder);
  };

  const handleSortOrderChange = () => {
    onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <select
        value={sortBy}
        onChange={handleSortByChange}
        className="border-gray-300 rounded-md shadow-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button onClick={handleSortOrderChange} className="p-2">
        {sortOrder === "asc" ? "↑" : "↓"}
      </button>
    </div>
  );
}
