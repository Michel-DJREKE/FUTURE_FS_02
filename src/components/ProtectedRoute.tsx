import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

/**
 * Enveloppe les routes qui nécessitent une connexion admin.
 * - Pendant la vérification du token → spinner
 * - Non connecté → redirige vers /login
 * - Connecté → affiche le contenu
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        backgroundColor: "hsl(var(--background))",
      }}>
        <Loader2 size={24} className="animate-spin" style={{ color: "hsl(var(--muted-foreground))" }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
