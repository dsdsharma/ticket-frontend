import { z } from "zod";

export const ticketPriorityEnum = z.enum(["Low", "Medium", "High"], {
  required_error: "Priority is required",
});

export const addTicketSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required")
    .trim()
    .max(200, "Subject must be at most 200 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .trim()
    .max(5000, "Message must be at most 5000 characters"),
  priority: ticketPriorityEnum,
});

export type AddTicketFormSchema = z.infer<typeof addTicketSchema>;
export type TicketPriority = z.infer<typeof ticketPriorityEnum>;
