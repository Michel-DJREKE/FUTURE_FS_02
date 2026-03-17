
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const { logout, admin } = useAuth();
  const navigate          = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      {admin && (
        <span style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
          {admin.email}
        </span>
      )}
      <button
        onClick={handleLogout}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          fontSize: "12px", fontWeight: 500,
          padding: "6px 12px", borderRadius: "8px",
          border: "1px solid hsl(var(--border))",
          backgroundColor: "transparent",
          color: "hsl(var(--foreground))",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "hsl(var(--muted))")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <LogOut size={14} />
        Déconnexion
      </button>
    </div>
  );
}
