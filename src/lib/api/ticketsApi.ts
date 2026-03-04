import { axiosInstance } from "./axiosInstance";
import type { ApiResponse, Ticket, TicketPriority, ApiMeta } from "./types";
import type { TicketListFilterType } from "@/types/ticketTypes";

function isSuccess<T>(
  res: ApiResponse<T>,
): res is ApiResponse<T> & { success: true; data: T } {
  return res.success === true;
}

export interface CreateTicketPayload {
  subject: string;
  message: string;
  priority: TicketPriority;
}

export type TicketStatusFilter = "Open" | "In Progress" | "Closed";

export interface ListTicketsResult {
  tickets: Ticket[];
  meta: ApiMeta;
}

export const ticketsApi = {
  async create(payload: CreateTicketPayload) {
    const { data } = await axiosInstance.post<ApiResponse<Ticket>>(
      "/tickets",
      payload,
    );
    if (!isSuccess(data)) {
      throw new Error(data.message ?? "Failed to create ticket");
    }
    return data.data;
  },

  async updateStatus(
    ticketId: string,
    status: TicketStatusFilter,
  ): Promise<Ticket> {
    const { data } = await axiosInstance.patch<ApiResponse<Ticket>>(
      `/tickets/${ticketId}`,
      { status },
    );
    if (!isSuccess(data)) {
      throw new Error(data.message ?? "Failed to update ticket status");
    }
    return data.data;
  },

  async list(filter: TicketListFilterType): Promise<ListTicketsResult> {
    const { data } = await axiosInstance.get<ApiResponse<Ticket[]>>(
      "/tickets/list",
      {
        params: {
          ...filter,
          page: filter.pagination.pageIndex,
          size: filter.pagination.pageSize,
        },
      },
    );

    if (!isSuccess(data)) {
      throw new Error(data.message ?? "Failed to fetch tickets");
    }

    return {
      tickets: data.data,
      meta: data.meta,
    };
  },
};
