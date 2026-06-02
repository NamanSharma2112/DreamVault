"use client";

import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface ItemFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  filters: FilterState;
}

export interface FilterState {
  category: string;
  priority: string;
  status: string;
  sortBy: string;
}

const categories = [
  { value: "", label: "All Categories" },
  { value: "WISHLIST", label: "Wishlist" },
  { value: "BUY_LIST", label: "Buy List" },
  { value: "TRIP", label: "Trip" },
  { value: "EXPERIENCE", label: "Experience" },
  { value: "HOME", label: "Home" },
  { value: "VEHICLE", label: "Vehicle" },
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "FASHION", label: "Fashion" },
  { value: "HEALTH", label: "Health" },
  { value: "EDUCATION", label: "Education" },
  { value: "OTHER", label: "Other" },
];

const priorities = [
  { value: "", label: "All Priorities" },
  { value: "DREAM", label: "Dream" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

const statuses = [
  { value: "", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "SAVING", label: "Saving" },
  { value: "PURCHASED", label: "Purchased" },
  { value: "CANCELLED", label: "Cancelled" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-high", label: "Price: High → Low" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "priority", label: "Priority" },
  { value: "deadline", label: "Deadline" },
];

export function ItemFilters({ onFilterChange, filters }: ItemFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const hasFilters = filters.category || filters.priority || filters.status;

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({ category: "", priority: "", status: "", sortBy: "newest" });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 rounded-[9999px] border px-4 py-2 text-caption transition-all duration-200 active:scale-95",
            showFilters || hasFilters
              ? "border-primary bg-primary/5 text-primary"
              : "border-hairline text-ink-muted-80 hover:bg-canvas-parchment"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {hasFilters && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-on-primary">
              {[filters.category, filters.priority, filters.status].filter(Boolean).length}
            </span>
          )}
        </button>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-caption text-primary hover:underline"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}

        <div className="ml-auto">
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter("sortBy", e.target.value)}
            className="appearance-none rounded-[9999px] border border-hairline bg-canvas px-4 py-2 text-caption text-ink-muted-80 outline-none transition-all duration-200 focus:border-primary"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 gap-3 rounded-[11px] border border-hairline bg-canvas-parchment p-4 sm:grid-cols-3">
          <Select
            options={categories}
            value={filters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
            label="Category"
          />
          <Select
            options={priorities}
            value={filters.priority}
            onChange={(e) => updateFilter("priority", e.target.value)}
            label="Priority"
          />
          <Select
            options={statuses}
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            label="Status"
          />
        </div>
      )}
    </div>
  );
}
