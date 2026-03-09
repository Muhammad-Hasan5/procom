import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router";
import { store } from "@/store";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import { AuthInit } from "@/components/AuthInit";
import { ThemeProvider } from "@/components/theme-provider";
import "./index.css";

// eslint-disable-next-line react-refresh/only-export-components
function RootLayout() {
  return <Outlet />;
}

// eslint-disable-next-line react-refresh/only-export-components
function LandingRedirect() {
  return <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingRedirect /> },
      {
        path: "login",
        lazy: () =>
          import("@/pages/LoginPage").then((m) => ({ Component: m.default })),
      },
      {
        path: "signup",
        lazy: () =>
          import("@/pages/SignupPage").then((m) => ({ Component: m.default })),
      },
      {
        path: "forgot-password",
        lazy: () =>
          import("@/pages/ForgotPasswordPage").then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: "projects",
        element: (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            lazy: () =>
              import("@/pages/ProjectsPage").then((m) => ({
                Component: m.default,
              })),
          },
          {
            path: ":projectId",
            lazy: () =>
              import("@/pages/ProjectDetailPage").then((m) => ({
                Component: m.default,
              })),
          },
        ],
      },
      {
        path: "*",
        element: (
          <div className="container py-24 text-center">
            <p className="text-muted-foreground">Page not found</p>
          </div>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="procom-theme">
    <Provider store={store}>
      <AuthInit>
        <RouterProvider router={router} />
      </AuthInit>
    </Provider>
  </ThemeProvider>,
);
