import { ticketsApi, type TicketStatusFilter } from "@/lib/api/ticketsApi";
import { toast } from "sonner";

export const seedTicketsIntoDb = async () => {
  try {
    for (let i = 1; i <= 50; i += 1) {
      await ticketsApi.create({
        subject: `Seeded ticket #${i}`,
        message: `This is seeded ticket number ${i} for testing.`,
        priority: "Medium",
      });
    }
    toast.success("Seeded 50 tickets");
    //   queryClient.invalidateQueries({ queryKey: ["tickets"] });
  } catch (err) {
    toast.error("Failed to seed tickets", {
      description: err instanceof Error ? err.message : "Something went wrong",
    });
  }
};

export const STATUS_OPTIONS: { value: TicketStatusFilter; label: string }[] = [
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Closed", label: "Closed" },
];
