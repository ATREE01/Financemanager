"use client";

import React from "react";
import clsx from "clsx";
import { isAfter, subMonths, subYears, startOfYear } from "date-fns";

export type TimeRange = "1M" | "3M" | "6M" | "1Y" | "YTD" | "ALL";

interface TimeRangeFilterProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  className?: string;
}

export function filterDataByTimeRange<T extends { date?: string } | (string | number | null)[]>(
  data: T[],
  range: TimeRange,
  dateAccessor: (item: T) => string = (item: any) => Array.isArray(item) ? item[0] : item.date
): T[] {
  if (range === "ALL" || !data || data.length <= 1) return data;

  // Assume data[0] might be the header row for react-google-charts format
  const hasHeader = Array.isArray(data[0]) && typeof data[0][0] === "string" && isNaN(Date.parse(data[0][0]));
  const header = hasHeader ? [data[0]] : [];
  const rows = hasHeader ? data.slice(1) : data;

  if (rows.length === 0) return data;

  const now = new Date();
  let cutoffDate: Date;

  switch (range) {
    case "1M":
      cutoffDate = subMonths(now, 1);
      break;
    case "3M":
      cutoffDate = subMonths(now, 3);
      break;
    case "6M":
      cutoffDate = subMonths(now, 6);
      break;
    case "1Y":
      cutoffDate = subYears(now, 1);
      break;
    case "YTD":
      cutoffDate = startOfYear(now);
      break;
    default:
      return data;
  }

  const filteredRows = rows.filter((item) => {
    const itemDateStr = dateAccessor(item);
    if (!itemDateStr) return true;
    const itemDate = new Date(itemDateStr);
    return isAfter(itemDate, cutoffDate);
  });

  return [...header, ...filteredRows] as T[];
}

export default function TimeRangeFilter({ value, onChange, className }: TimeRangeFilterProps) {
  const options: TimeRange[] = ["1M", "3M", "6M", "1Y", "YTD", "ALL"];

  return (
    <div className={clsx("flex items-center space-x-1 bg-gray-100/80 p-1 rounded-lg w-fit", className)}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={clsx(
            "px-3 py-1 text-sm font-medium rounded-md transition-colors",
            value === option
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
