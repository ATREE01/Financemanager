"use client";

import { Options } from "@financemanager/financemanager-website-types";
import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ConditionFilterProps {
  options: Options[];
  value: string;
  setFilter: (value: string) => void;
  className?: string;
}

export default function ConditionFilter({
  options,
  value,
  setFilter,
  className,
}: ConditionFilterProps) {
  if (!options?.length) return null;

  const defaultValue = String(value ?? options[0]?.value ?? "");

  return (
    <Select
      value={defaultValue}
      onValueChange={(value) => value !== null && setFilter(value)}
    >
      <SelectTrigger
        className={cn(
          "w-full", // Increased width
          "rounded-lg border border-gray-300 bg-white",
          "px-4 py-3 text-base font-medium", // Increased padding and font size
          "shadow-sm",
          "transition-all duration-150",
          "hover:border-gray-400",
          "focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
          className,
        )}
      >
        <SelectValue placeholder="請選擇條件">
          {options.find((option) => String(option.value) === defaultValue)
            ?.name || "請選擇條件"}
        </SelectValue>
      </SelectTrigger>

      <SelectContent
        className={cn(
          "rounded-lg border bg-white shadow-lg",
          "animate-in fade-in-80",
        )}
      >
        <SelectGroup>
          {options.map((item) => (
            <SelectItem
              key={`${item.value}-${item.name}`}
              value={String(item.value)}
              className={cn(
                "text-center",
                "cursor-pointer",
                "text-base", // Increased font size
                "py-3", // Increased vertical padding
                "focus:bg-blue-50 focus:text-blue-700",
                "data-[state=checked]:font-semibold",
              )}
            >
              {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
