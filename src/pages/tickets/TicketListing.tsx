import { PriorityBadge } from "@/components/PriorityBadge";
import { TicketStatusBadge } from "@/components/TicketStatusBadge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TicketStatusFilter } from "@/lib/api/ticketsApi";
import type { Ticket, TicketRow } from "@/lib/api/types";
import { STATUS_OPTIONS } from "@/lib/common";
import { cn } from "@/lib/utils";
import {
  useGetTicketList,
  useUpdateTicketStatus,
} from "@/queries/ticketQueriesAndMutations";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { CalendarIcon } from "lucide-react";
import React from "react";
import type { DateRange } from "react-day-picker";

function formatDateForApi(date: Date | undefined): string | undefined {
  if (!date) return undefined;
  return date.toISOString().slice(0, 10);
}
function getTicketId(ticket: TicketRow): string {
  return ticket.id ?? ticket._id;
}

function getDefaultDateRange(): DateRange {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 30);
  return { from, to };
}

export default function TicketListing() {
  const [searchInput, setSearchInput] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<TicketStatusFilter | undefined>();
  const [dateRange, setDateRange] =
    React.useState<DateRange>(getDefaultDateRange);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const updateStatusMutation = useUpdateTicketStatus();

  const [selectedTicket, setSelectedTicket] = React.useState<TicketRow | null>(
    null,
  );
  const [selectedStatus, setSelectedStatus] =
    React.useState<TicketStatusFilter>("Open");

  const range = dateRange ?? getDefaultDateRange();
  const dateFrom = formatDateForApi(range.from);
  const dateTo = formatDateForApi(range.to);

  const {
    data,
    isLoading: loading,
    error: queryError,
  } = useGetTicketList({
    search,
    status,
    dateFrom,
    dateTo,
    pagination,
  });
  
  React.useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearch(searchInput);
    }, 400);

    return () => {
      window.clearTimeout(handle);
    };
  }, [searchInput]);

  const handleApplyFilters = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleUpdateStatus = () => {
    if (!selectedTicket) return;
     updateStatusMutation.mutate({
      ticketId: getTicketId(selectedTicket),
      status: selectedStatus,
    });
    setSelectedTicket(null);
  };

  const errorMessage =
    queryError instanceof Error
      ? queryError.message
      : queryError
        ? "Failed to load tickets"
        : null;

  const tickets = data?.tickets ?? [];
  const pageCount = data?.meta?.pagination?.totalPages ?? 1;

  const columns = React.useMemo<ColumnDef<TicketRow>[]>(
    () => [
      {
        accessorKey: "subject",
        header: "Subject",
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
          const priority = row.getValue("priority") as Ticket["priority"];
          return priority ? (
            <PriorityBadge priority={priority} />
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created at",
        cell: ({ row }) => {
          const value = row.getValue("createdAt") as string;
          const date = new Date(value);
          return (
            <span>
              {date.toLocaleDateString()}{" "}
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as Ticket["status"];
          return status ? (
            <TicketStatusBadge status={status} />
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const ticket = row.original;
          return (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedTicket(ticket);
                setSelectedStatus(
                  (ticket.status as TicketStatusFilter) ?? "Open",
                );
              }}
            >
              Change status
            </Button>
          );
        },
      },
    ],
    [],
  );

  return (
    <div>
      {" "}
      <section className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-sm font-medium">Search</label>
          <Input
            placeholder="Search by subject"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="min-w-[160px]">
          <label className="mb-1 block text-sm font-medium">Status</label>
          <Select
            value={status ?? "all"}
            onValueChange={(value) =>
              setStatus(
                value === "all" ? undefined : (value as TicketStatusFilter),
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[260px]">
          <label className="mb-1 block text-sm font-medium">Date range</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange?.from && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {dateRange.from.toLocaleDateString()} -{" "}
                      {dateRange.to.toLocaleDateString()}
                    </>
                  ) : (
                    dateRange.from.toLocaleDateString()
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => range && setDateRange(range)}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-end">
          <Button onClick={handleApplyFilters} disabled={loading}>
            Apply filters
          </Button>
        </div>
      </section>
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
      <section className="flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={tickets}
          manualPagination
          pagination={pagination}
          onPaginationChange={setPagination}
          pageCount={pageCount}
          className="mt-2"
        />
      </section>
      <Dialog
        open={!!selectedTicket}
        onOpenChange={(open) => !open && setSelectedTicket(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Change status</DialogTitle>
            <DialogDescription>
              Choose a new status for this ticket.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <label className="mb-2 block text-sm font-medium">Status</label>
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as TicketStatusFilter)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleUpdateStatus}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? "Updating..." : "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
