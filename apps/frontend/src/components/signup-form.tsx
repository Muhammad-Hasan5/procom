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
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { register } from "@/lib/auth-api";
import type { ApiError } from "@/lib/api";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    setLoading(true);
    try {
      await register({
        fullname: formData.fullname,
        username: formData.username.toLowerCase(),
        email: formData.email,
        password: formData.password,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message ?? "Sign up failed");
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
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>
        {error && (
          <Field>
            <FieldError>{error}</FieldError>
          </Field>
        )}
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            className="bg-background"
            value={formData.fullname}
            onChange={(e) =>
              setFormData((p) => ({ ...p, fullname: e.target.value }))
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            type="text"
            placeholder="johndoe"
            required
            minLength={3}
            className="bg-background"
            value={formData.username}
            onChange={(e) =>
              setFormData((p) => ({ ...p, username: e.target.value }))
            }
          />
          <FieldDescription>At least 3 characters, lowercase.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className="bg-background"
            value={formData.email}
            onChange={(e) =>
              setFormData((p) => ({ ...p, email: e.target.value }))
            }
          />
          <FieldDescription>
            We&apos;ll use this to contact you.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            className="bg-background"
            value={formData.password}
            onChange={(e) =>
              setFormData((p) => ({ ...p, password: e.target.value }))
            }
          />
          <FieldDescription>Must be at least 8 characters long.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            required
            className="bg-background"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((p) => ({ ...p, confirmPassword: e.target.value }))
            }
          />
        </Field>
        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </Button>
        </Field>
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-muted dark:*:data-[slot=field-separator-content]:bg-card">
          Or continue with
        </FieldSeparator>
        <Field>
          <Button variant="outline" type="button" disabled>
            Sign up with GitHub (coming soon)
          </Button>
          <FieldDescription className="px-6 text-center">
            Already have an account? <Link to="/login" className="text-primary underline">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
