import { ticketsApi, type TicketStatusFilter } from "@/lib/api/ticketsApi";
import type { TicketListFilterType } from "@/types/ticketTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

enum TicketQueryKeys {
  LIST = "tickets",
}
export const useGetTicketList = (filter: TicketListFilterType) => {
  return useQuery({
    queryKey: [TicketQueryKeys.LIST, filter],
    queryFn: () => ticketsApi.list(filter),
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ticketId,
      status: newStatus,
    }: {
      ticketId: string;
      status: TicketStatusFilter;
    }) => ticketsApi.updateStatus(ticketId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TicketQueryKeys.LIST] });
      toast.success("Status updated");
    },
    onError: (err) => {
      toast.error("Failed to update status", {
        description:
          err instanceof Error ? err.message : "Something went wrong",
      });
    },
  });
};
