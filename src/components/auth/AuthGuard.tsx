import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setUser,
  setLoading,
  setInitialized,
  clearAuth,
} from "@/store/slices/authSlice";
import { userApi } from "@/lib/api/userApi";
import { authApi } from "@/lib/api/authApi";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isInitialized } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isInitialized) return;

    let cancelled = false;
    dispatch(setLoading(true));

    userApi
      .getMe()
      .then((me) => {
        if (!cancelled) {
          dispatch(setUser(me));
          dispatch(setInitialized(true));
        }
      })
      .catch(async () => {
        if (cancelled) return;
        dispatch(clearAuth());
        try {
          await authApi.logout();
        } catch {}
        navigate("/login", { replace: true });
      })
      .finally(() => {
        if (!cancelled) {
          dispatch(setLoading(false));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch, navigate, isInitialized]);

  if (!isInitialized && isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2
          className="h-8 w-8 animate-spin text-muted-foreground"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <Outlet />;
}
