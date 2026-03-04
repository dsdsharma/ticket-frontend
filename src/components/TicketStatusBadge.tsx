import { Badge } from "@/components/ui/badge";
import type { TicketStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<TicketStatus, { className: string; label: string }> =
  {
    Open: {
      className:
        "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800",
      label: "Open",
    },
    "In Progress": {
      className:
        "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
      label: "In Progress",
    },
    Closed: {
      className:
        "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
      label: "Closed",
    },
  };

interface TicketStatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

export function TicketStatusBadge({
  status,
  className,
}: TicketStatusBadgeProps) {
  const config = statusStyles[status as TicketStatus] ?? {
    className: "bg-muted text-muted-foreground border-border",
    label: (status as string) ?? "—",
  };
  const { className: statusClassName, label } = config;
  return (
    <Badge variant="outline" className={cn(statusClassName, className)}>
      {label}
    </Badge>
  );
}
