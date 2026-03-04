import * as React from "react";

import { clearAuth } from "@/store/slices/authSlice";
import { authApi } from "@/lib/api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import TicketListing from "@/pages/tickets/TicketListing";
import { seedTicketsIntoDb } from "@/lib/common";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function Home() {
  const [seeding, setSeeding] = React.useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleSeedTickets = async () => {
    setSeeding(true);
    try {
      await seedTicketsIntoDb();
    } finally {
      setSeeding(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    dispatch(clearAuth());
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-svh flex-col gap-4 p-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Tickets</h1>
          {user && (
            <p className="text-muted-foreground text-sm">
              {user.name} ({user.email})
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link to="/tickets/new">Add ticket</Link>
          </Button>
          <Button
            variant="outline"
            onClick={handleSeedTickets}
            disabled={seeding}
          >
            {seeding ? "Seeding..." : "Seed 50 tickets"}
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
      <TicketListing />
    </div>
  );
}
