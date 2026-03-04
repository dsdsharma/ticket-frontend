import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addTicketSchema,
  type AddTicketFormSchema,
} from "@/schemas/ticketSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ticketsApi } from "@/lib/api/ticketsApi";
import { cn } from "@/lib/utils";

const PRIORITY_OPTIONS: { value: AddTicketFormSchema["priority"]; label: string }[] = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

export function AddTicketForm() {
  const navigate = useNavigate();
  const form = useForm<AddTicketFormSchema>({
    resolver: zodResolver(addTicketSchema),
    defaultValues: {
      subject: "",
      message: "",
      priority: "Medium",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: AddTicketFormSchema) => {
    try {
      await ticketsApi.create({
        subject: values.subject,
        message: values.message,
        priority: values.priority,
      });
      toast.success("Ticket created");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error("Failed to create ticket", {
        description: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  };

  const textareaClassName = cn(
    "flex w-full min-h-[80px] resize-y rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20"
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Controller
        name="subject"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Subject</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Brief summary of the issue"
              autoComplete="off"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="message"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="ticket-message">Message</FieldLabel>
            <textarea
              {...field}
              id="ticket-message"
              placeholder="Describe the issue in detail"
              rows={5}
              className={textareaClassName}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="priority"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="ticket-priority">Priority</FieldLabel>
            <Select
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id="ticket-priority"
                aria-invalid={fieldState.invalid}
                className="w-full"
              >
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Field orientation="horizontal">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create ticket"
          )}
        </Button>
      </Field>
    </form>
  );
}
