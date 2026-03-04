/**
 * API response shape used by the backend.
 */
export interface ApiMeta {
  pagination: { page: number; limit: number; total: number; totalPages: number } | null;
  hasMore: boolean;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta: ApiMeta;
}

export interface ApiError {
  success: false;
  message: string;
  data: unknown | null;
  meta: ApiMeta;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type TicketPriority = "Low" | "Medium" | "High";

export type TicketStatus = "Open" | "In Progress" | "Closed";

export type TicketRow = Ticket;

export interface Ticket {
  _id: string;
  id?: string;
  subject: string;
  message: string;
  priority: TicketPriority;
  status?: TicketStatus;
  createdBy: string | { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}
