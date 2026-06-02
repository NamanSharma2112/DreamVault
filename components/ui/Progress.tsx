"use client";

import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
  color?: "primary" | "success" | "warning" | "danger";
}

export function Progress({
  value,
  max = 100,
  size = "md",
  className,
  showLabel = false,
  color = "primary",
}: ProgressProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const colorStyles = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex-1 overflow-hidden rounded-[9999px] bg-canvas-parchment",
          size === "sm" && "h-1.5",
          size === "md" && "h-2.5",
          size === "lg" && "h-4"
        )}
      >
        <div
          className={cn(
            "h-full rounded-[9999px] transition-all duration-500 ease-out",
            colorStyles[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-caption-strong text-ink-muted-80 min-w-[40px] text-right">
          {percentage}%
        </span>
      )}
    </div>
  );
}
