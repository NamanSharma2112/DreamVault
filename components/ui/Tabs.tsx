"use client";

import { cn } from "@/lib/utils";
import { useState, type ReactNode } from "react";

interface TabsProps {
  tabs: Array<{ id: string; label: string; icon?: ReactNode }>;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, defaultTab, onChange, className }: TabsProps) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id || "");

  const handleClick = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div className={cn("flex gap-1 rounded-[11px] bg-canvas-parchment p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleClick(tab.id)}
          className={cn(
            "flex items-center gap-1.5 rounded-[8px] px-3 py-2 text-caption font-medium transition-all duration-200",
            active === tab.id
              ? "bg-canvas text-ink shadow-sm"
              : "text-ink-muted-48 hover:text-ink-muted-80"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
