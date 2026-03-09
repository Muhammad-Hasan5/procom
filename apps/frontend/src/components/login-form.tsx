import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/auth-api";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setUser } from "@/store/authSlice";
import type { User } from "@/types/api";
import type { ApiError } from "@/lib/api";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.data) dispatch(setUser(res.data as User));
      navigate("/projects", { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6 w-full max-w-sm", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to continue
          </p>
        </div>
        {error && (
          <Field>
            <FieldError>{error}</FieldError>
          </Field>
        )}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className="bg-background"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            className="bg-background"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FieldDescription>
            <Link to="/forgot-password" className="text-primary underline">
              Forgot password?
            </Link>
          </FieldDescription>
        </Field>
        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </Field>
        <FieldDescription className="text-center">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-primary underline">
            Sign up
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
