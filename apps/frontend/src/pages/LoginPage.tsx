import { Link } from "react-router";
import { GalleryVerticalEnd, ListTodo, FileText } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col gap-8 p-8 md:p-12 lg:p-16">
        <div className="flex justify-center lg:justify-start">
          <Link to="/" className="flex items-center gap-3 font-bold text-2xl">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
              <GalleryVerticalEnd className="size-5" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              ProCom
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back
              </h1>
              <p className="text-muted-foreground text-lg">
                Sign in to your account to continue
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="text-center space-y-6 max-w-md">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                Manage your projects efficiently
              </h2>
              <p className="text-muted-foreground text-lg">
                Organize tasks, collaborate with your team, and keep track of
                everything in one place.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="size-8 rounded bg-primary/10 flex items-center justify-center mx-auto">
                  <ListTodo className="size-4 text-primary" />
                </div>
                <p className="font-medium">Task Management</p>
              </div>
              <div className="space-y-2">
                <div className="size-8 rounded bg-primary/10 flex items-center justify-center mx-auto">
                  <FileText className="size-4 text-primary" />
                </div>
                <p className="font-medium">Note Taking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
