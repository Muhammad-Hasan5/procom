import { Navigate, useLocation } from "react-router";
import { useAppSelector } from "@/hooks/useAppSelector";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (!initialized) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
