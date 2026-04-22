import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { ForcePasswordChangeGate } from "@/components/auth/ForcePasswordChangeGate";

export function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: UserRole[];
}) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-soft">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  // Block all dashboard access until the temporary password is changed.
  if (user.mustChangePassword) return <ForcePasswordChangeGate />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
