import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * RequireAuth — wraps protected routes.
 *
 * Usage in App.tsx:
 *   <Route element={<RequireAuth />}>
 *     ... routes ...
 *   </Route>
 *
 *   <Route element={<RequireAuth requireAdmin />}>
 *     <Route path="/admin" element={<Admin />} />
 *   </Route>
 */
export function RequireAuth({ requireAdmin = false }: { requireAdmin?: boolean }) {
    const { user, userRole, initialising } = useContext(AuthContext);
    const location = useLocation();

    // While Firebase is still determining auth state, show a full-screen loader
    if (initialising) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
                <div className="flex flex-col items-center gap-4 text-white">
                    <Loader2 className="animate-spin text-purple-300" size={40} />
                    <p className="text-purple-200 text-sm">Loading…</p>
                </div>
            </div>
        );
    }

    // If auth is resolved and there's no user, redirect to /login.
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If this route requires admin role and user is not admin, redirect to '/'
    if (requireAdmin && userRole !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // User is authenticated (and meets role check) — render the nested route.
    return <Outlet />;
}
