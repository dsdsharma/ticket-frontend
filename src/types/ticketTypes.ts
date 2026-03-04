import type { TicketStatusFilter } from "@/lib/api/ticketsApi";
import type { PaginationState } from "@tanstack/react-table";

export type TicketListFilterType = {
  search?: string;
  status?: TicketStatusFilter;
  dateFrom?: string;
  dateTo?: string;
  pagination: PaginationState;
};
