import { AuthGuard } from "@/components/auth/AuthGuard";
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import AddTicket from "@/pages/tickets/AddTicket";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function AppRouter() {
  return (
    <BrowserRouter>
    <Routes>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<Home />} />
        <Route path="/tickets/new" element={<AddTicket />} />
      </Route>

      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>  )
}
