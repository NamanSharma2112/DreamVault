"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "dark" | "parchment";
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
}

export function Card({
  children,
  className,
  variant = "default",
  padding = "md",
  hover = false,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[18px] border transition-all duration-300",
        // Variants
        variant === "default" && "border-hairline bg-canvas",
        variant === "dark" && "border-transparent bg-surface-tile-1 text-on-dark",
        variant === "parchment" && "border-hairline bg-canvas-parchment",
        // Padding
        padding === "sm" && "p-4",
        padding === "md" && "p-6",
        padding === "lg" && "p-8",
        // Hover — per DESIGN.md: NO shadows on cards, only translate
        hover && "cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]",
        className
      )}
    >
      {children}
    </div>
  );
}
