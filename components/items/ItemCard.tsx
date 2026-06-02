"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { formatCurrency, daysUntil, getProgressPercentage, cn } from "@/lib/utils";
import { ExternalLink, Calendar, MoreHorizontal, ArrowUpRight } from "lucide-react";
import type { Item } from "@/hooks/useItems";
import { motion } from "framer-motion";

interface ItemCardProps {
  item: Item;
  onEdit?: (item: Item) => void;
  onDelete?: (id: string) => void;
}

const priorityBadge = {
  DREAM: { variant: "info" as const, label: "Dream" },
  HIGH: { variant: "danger" as const, label: "High" },
  MEDIUM: { variant: "warning" as const, label: "Medium" },
  LOW: { variant: "default" as const, label: "Low" },
};

const statusBadge = {
  PENDING: { variant: "default" as const, label: "Pending" },
  SAVING: { variant: "primary" as const, label: "Saving" },
  PURCHASED: { variant: "success" as const, label: "Purchased" },
  CANCELLED: { variant: "danger" as const, label: "Cancelled" },
};

export function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  const progress = getProgressPercentage(item.savedAmount, item.price);
  const days = item.targetDate ? daysUntil(item.targetDate) : null;
  const pBadge = priorityBadge[item.priority as keyof typeof priorityBadge] || priorityBadge.MEDIUM;
  const sBadge = statusBadge[item.status as keyof typeof statusBadge] || statusBadge.PENDING;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="group relative overflow-hidden">
        {/* Image */}
        <div className={cn(
          "relative mb-4 h-44 overflow-hidden rounded-[8px] bg-canvas-parchment transition-all duration-300",
          item.imageUrl && "product-shadow"
        )}>
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-display-lg text-ink-muted-48/30">
                {item.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Badges overlay */}
          <div className="absolute left-2 top-2 flex gap-1.5">
            <Badge variant={pBadge.variant}>{pBadge.label}</Badge>
            <Badge variant={sBadge.variant}>{sBadge.label}</Badge>
          </div>

          {/* Actions overlay */}
          <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {item.sourceUrl && (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform duration-200 hover:scale-110"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <button
              onClick={() => onEdit?.(item)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform duration-200 hover:scale-110"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div onClick={() => onEdit?.(item)} className="cursor-pointer">
          <h3 className="text-body-strong text-ink line-clamp-1">{item.title}</h3>

          <div className="mt-1 flex items-center justify-between">
            <p className="text-tagline text-ink">
              {formatCurrency(item.price, item.currency)}
            </p>
            {item.goal && (
              <span className="flex items-center gap-0.5 text-fine-print text-primary">
                <ArrowUpRight className="h-3 w-3" />
                {item.goal.title}
              </span>
            )}
          </div>

          {/* Progress */}
          {item.status !== "PURCHASED" && item.status !== "CANCELLED" && (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-fine-print text-ink-muted-48">
                  {formatCurrency(item.savedAmount, item.currency)} saved
                </span>
                <span className="text-fine-print text-ink-muted-48">{progress}%</span>
              </div>
              <Progress
                value={item.savedAmount}
                max={item.price}
                size="sm"
                color={progress >= 100 ? "success" : progress >= 50 ? "primary" : "warning"}
              />
            </div>
          )}

          {/* Footer */}
          {days !== null && (
            <div className="mt-3 flex items-center gap-1.5 text-fine-print text-ink-muted-48">
              <Calendar className="h-3 w-3" />
              {days > 0
                ? `${days} days left`
                : days === 0
                ? "Due today"
                : `${Math.abs(days)} days overdue`}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
