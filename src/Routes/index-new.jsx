import { lazy, Suspense } from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom";

// Lazy load auth pages
const Login = lazy(() => import("../pages/Auth/Login"));
const Register = lazy(() => import("../pages/Auth/Register"));
const ResetPassword = lazy(() => import("../pages/Auth/ResetPassword"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"));
const ConfirmPassword = lazy(() => import("../pages/Auth/ConfirmPassword"));

// Lazy load dashboard
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));

// Lazy load project pages
const ProjectsPage = lazy(() => import("../pages/projects/ProjectsPage"));
const ProjectViewPage = lazy(() => import("../pages/projects/ProjectViewPage"));
const ProjectSettingsPage = lazy(
    () => import("../pages/projects/ProjectSettingsPage")
);
const ProjectCreatePage = lazy(
    () => import("../pages/projects/ProjectCreatePage")
);

// Lazy load other pages as needed...
const CalendarPage = lazy(() => import("@/pages/calendar/CalendarPage"));
const TasksPage = lazy(() => import("@/pages/tasks/tasksPage"));
const TaskCreatePage = lazy(() => import("@/pages/tasks/TaskCreatePage"));
const TaskEditPage = lazy(() => import("@/pages/tasks/TaskEditPage"));

import AuthLayout from "@/app/layout/AuthLayout";
import AppLayout from "@/app/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import { useAuthContext } from "@/hooks/AuthContext";
import ErrorBoundary from "./ErrorBoundary";

function GuestRoute() {
    const { user, role, loading } = useAuthContext();
    if (loading) return <div>Loading...</div>;
    if (user) return <Navigate to={`/${role || "client"}/dashboard`} replace />;
    return <Outlet />;
}

export default function AppRoutes() {
    const { role, user } = useAuthContext();
    const basePath = role || "client";

    const router = createBrowserRouter([
        {
            path: "/",
            element: user ? (
                <Navigate to={`/${basePath}/dashboard`} replace />
            ) : (
                <Navigate to="/auth/login" replace />
            ),
        },
        {
            path: "/auth",
            element: <GuestRoute />,
            children: [
                {
                    path: "login",
                    element: (
                        <AuthLayout>
                            <ErrorBoundary>
                                <Suspense fallback={<div>Loading login...</div>}>
                                    <Login />
                                </Suspense>
                            </ErrorBoundary>
                        </AuthLayout>
                    ),
                    handle: { breadcrumb: "Login" },
                },
                {
                    path: "register",
                    element: (
                        <AuthLayout>
                            <ErrorBoundary>
                                <Suspense fallback={<div>Loading register...</div>}>
                                    <Register />
                                </Suspense>
                            </ErrorBoundary>
                        </AuthLayout>
                    ),
                    handle: { breadcrumb: "Register" },
                },
            ],
        },
        {
            path: "/:role",
            element: (
                <ProtectedRoute allowedRoles={["admin", "team_member", "client"]}>
                    <AppLayout />
                </ProtectedRoute>
            ),
            children: [
                {
                    path: "dashboard",
                    element: (
                        <ErrorBoundary>
                            <Suspense fallback={<div>Loading dashboard...</div>}>
                                <DashboardPage />
                            </Suspense>
                        </ErrorBoundary>
                    ),
                    handle: { breadcrumb: "Dashboard" },
                },
                {
                    path: "projects",
                    element: (
                        <ErrorBoundary>
                            <Suspense fallback={<div>Loading projects...</div>}>
                                <ProjectsPage />
                            </Suspense>
                        </ErrorBoundary>
                    ),
                    handle: { breadcrumb: "Projects" },
                },
                {
                    path: "project/:id",
                    element: (
                        <ErrorBoundary>
                            <Suspense fallback={<div>Loading project details...</div>}>
                                <ProjectViewPage />
                            </Suspense>
                        </ErrorBoundary>
                    ),
                    handle: { breadcrumb: ({ id }) => `Project ${id}` },
                },
                {
                    path: "project/new",
                    element: (
                        <ErrorBoundary>
                            <Suspense fallback={<div>Loading project creation...</div>}>
                                <ProjectCreatePage />
                            </Suspense>
                        </ErrorBoundary>
                    ),
                    handle: { breadcrumb: "New Project" },
                },
                {
                    path: "project/:id/settings",
                    element: (
                        <ErrorBoundary>
                            <Suspense fallback={<div>Loading project settings...</div>}>
                                <ProjectSettingsPage />
                            </Suspense>
                        </ErrorBoundary>
                    ),
                    handle: { breadcrumb: "Project Settings" },
                },
                {
                    path: "project/:id/tasks",
                    element: (
                        <ErrorBoundary>
                            <Suspense fallback={<div>Loading tasks...</div>}>
                                <TasksPage />
                            </Suspense>
                        </ErrorBoundary>
                    ),
                    handle: { breadcrumb: "Tasks" },
                },
                {
                    path: "project/:id/task/new",
                    element: (
                        <ErrorBoundary>
                            <Suspense fallback={<div>Loading task creation...</div>}>
                                <TaskCreatePage />
                            </Suspense>
                        </ErrorBoundary>
                    ),
                    handle: { breadcrumb: "New Task" },
                },
                {
                    path: "project/:id/task/:taskId/edit",
                    element: (
                        <ErrorBoundary>
                            <Suspense fallback={<div>Loading task editor...</div>}>
                                <TaskEditPage />
                            </Suspense>
                        </ErrorBoundary>
                    ),
                    handle: { breadcrumb: "Edit Task" },
                },
                {
                    path: "calendar",
                    element: (
                        <ErrorBoundary>
                            <Suspense fallback={<div>Loading calendar...</div>}>
                                <CalendarPage />
                            </Suspense>
                        </ErrorBoundary>
                    ),
                    handle: { breadcrumb: "Calendar" },
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}
