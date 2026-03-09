import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchCurrentUser } from "@/store/authSlice";

export function AuthInit({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    void dispatch(fetchCurrentUser());
  }, [dispatch]);
  return <>{children}</>;
}
