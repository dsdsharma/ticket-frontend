import { Badge } from "@/components/ui/badge";
import type { TicketPriority } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const priorityStyles: Record<
  TicketPriority,
  { className: string; label: string }
> = {
  Low: {
    className:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700",
    label: "Low",
  },
  Medium: {
    className:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    label: "Medium",
  },
  High: {
    className:
      "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
    label: "High",
  },
};

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityStyles[priority as TicketPriority] ?? {
    className: "bg-muted text-muted-foreground border-border",
    label: (priority as string) ?? "—",
  };
  const { className: priorityClassName, label } = config;
  return (
    <Badge variant="outline" className={cn(priorityClassName, className)}>
      {label}
    </Badge>
  );
}
