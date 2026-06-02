"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton", className)} />;
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[18px] border border-hairline bg-canvas p-6", className)}>
      <Skeleton className="mb-4 h-40 w-full" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-4 h-4 w-1/2" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="rounded-[18px] border border-hairline bg-canvas p-6">
      <Skeleton className="mb-2 h-4 w-1/3" />
      <Skeleton className="mb-1 h-8 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-[11px] bg-canvas-parchment/50 p-3">
          <Skeleton className="h-10 w-10 rounded-[8px]" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}
