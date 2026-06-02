"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "dark";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
          // Variants
          variant === "primary" &&
            "bg-primary text-on-primary hover:bg-primary-focus",
          variant === "secondary" &&
            "border border-primary bg-transparent text-primary hover:bg-primary/5",
          variant === "ghost" &&
            "bg-surface-pearl text-ink-muted-80 hover:bg-divider-soft",
          variant === "danger" &&
            "bg-danger text-white hover:bg-danger/90",
          variant === "dark" &&
            "bg-ink text-on-dark hover:bg-ink-muted-80",
          // Sizes
          size === "sm" && "rounded-[8px] px-3 py-1.5 text-[14px]",
          size === "md" && "rounded-[9999px] px-5 py-2.5 text-[14px]",
          size === "lg" && "rounded-[9999px] px-7 py-3.5 text-[17px] font-light",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
