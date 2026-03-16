import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Zap, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email,    setEmail]    = useState("admin@leadflow.com");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    const { error: err } = await login(email.trim(), password);
    setLoading(false);

    if (err) {
      setError(err);
    } else {
      navigate("/");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "hsl(var(--background))",
      padding: "1rem",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "380px",
        backgroundColor: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "12px",
        padding: "2rem",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.5rem" }}>
    
          <span style={{ fontWeight: 700, fontSize: "18px" }}>CRM</span>
          <span style={{
            fontSize: "10px", color: "hsl(var(--muted-foreground))",
            backgroundColor: "hsl(var(--muted))", padding: "2px 8px",
            borderRadius: "99px", marginLeft: "4px",
          }}>Admin</span>
        </div>

        <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>
          Connexion
        </h1>
        <p style={{ fontSize: "13px", color: "hsl(var(--muted-foreground))", marginBottom: "1.5rem" }}>
          Accès réservé aux administrateurs
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Email */}
          <div>
            <label style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="admin@leadflow.com"
              autoComplete="email"
              disabled={loading}
              style={{
                width: "100%", padding: "8px 12px", fontSize: "13px",
                border: `1px solid ${error ? "hsl(var(--destructive))" : "hsl(var(--border))"}`,
                borderRadius: "8px", backgroundColor: "hsl(var(--background))",
                color: "hsl(var(--foreground))", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
              Mot de passe
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                style={{
                  width: "100%", padding: "8px 40px 8px 12px", fontSize: "13px",
                  border: `1px solid ${error ? "hsl(var(--destructive))" : "hsl(var(--border))"}`,
                  borderRadius: "8px", backgroundColor: "hsl(var(--background))",
                  color: "hsl(var(--foreground))", outline: "none", boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                tabIndex={-1}
                style={{
                  position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

         
          {error && (
            <div style={{
              fontSize: "12px", color: "hsl(var(--destructive))",
              backgroundColor: "hsl(var(--destructive) / 0.08)",
              border: "1px solid hsl(var(--destructive) / 0.2)",
              borderRadius: "6px", padding: "8px 12px",
            }}>
              {error}
            </div>
          )}

         
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "10px", fontSize: "14px", fontWeight: 600,
              backgroundColor: loading ? "hsl(var(--muted))" : "hsl(var(--primary))",
              color: loading ? "hsl(var(--muted-foreground))" : "hsl(var(--primary-foreground))",
              border: "none", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              transition: "opacity 0.2s",
            }}
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        {/* Hint credentials */}
        <div style={{
          marginTop: "1.5rem", padding: "10px 12px", borderRadius: "8px",
          backgroundColor: "hsl(var(--muted))", fontSize: "11px",
          color: "hsl(var(--muted-foreground))", lineHeight: "1.6",
        }}>
          <strong>Credentials par défaut :</strong><br />
          Email : <code>admin@leadflow.com</code><br />
          Mot de passe : <code>Admin1234!</code><br />
         
        </div>
      </div>
    </div>
               

  );
}
