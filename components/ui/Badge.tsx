"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variantStyles = {
  default: "bg-canvas-parchment text-ink-muted-80",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[9999px] px-2.5 py-0.5 text-[12px] font-semibold",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
