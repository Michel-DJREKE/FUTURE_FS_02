
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const TOKEN_KEY = "leadflow_token";

interface Admin {
  email: string;
  role:  string;
}

interface AuthContextType {
  token:           string | null;
  admin:           Admin | null;
  isAuthenticated: boolean;
  loading:         boolean;
  login:           (email: string, password: string) => Promise<{ error: string | null }>;
  logout:          () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token,   setToken]   = useState<string | null>(null);
  const [admin,   setAdmin]   = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Restaure la session depuis localStorage ──────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) { setLoading(false); return; }

    // Vérifie que le token est encore valide côté serveur
    fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${stored}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setToken(stored);
          setAdmin(data.admin);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  // ── Login ────────
  const login = useCallback(async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { error: data.error || "Identifiants incorrects." };
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setAdmin(data.admin);
      return { error: null };
    } catch {
      return { error: "Impossible de contacter le serveur." };
    }
  }, []);

  // ── Logout ─────────
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      token, admin,
      isAuthenticated: !!token,
      loading,
      login, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
