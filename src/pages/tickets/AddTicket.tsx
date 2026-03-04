import { Link } from "react-router-dom";
import { AddTicketForm } from "./AddTicketForm";

export default function AddTicket() {
  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">New ticket</h1>
        <p className="text-muted-foreground text-sm">
          Create a support ticket. We’ll get back to you as soon as we can.
        </p>
      </div>
      <AddTicketForm />
    </div>
  );
}
