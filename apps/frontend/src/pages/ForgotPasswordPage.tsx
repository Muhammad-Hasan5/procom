import { Link } from "react-router";
import { GalleryVerticalEnd } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-svh w-full lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            ProCom
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm space-y-4 text-center">
            <h1 className="text-2xl font-bold">Forgot password</h1>
            <p className="text-sm text-muted-foreground">
              Contact support or use the link sent to your email to reset your password.
            </p>
            <Link to="/login" className="text-primary underline">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-primary/5" />
      </div>
    </div>
  );
}
