/**
 * useLeads — version avec authentification JWT
 * Chaque requête envoie le token dans Authorization: Bearer <token>
 */
import { useState, useCallback, useMemo, useEffect } from "react";
import { Lead, LeadStatus, LeadSource } from "@/types/lead";

const API       = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const TOKEN_KEY = "leadflow_token";

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    headers: {
      "Content-Type":  "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || `Erreur HTTP ${res.status}`);
  }
  return json.data as T;
}

export interface LeadStats {
  total:          number;
  nouveau:        number;
  "contacté":     number;
  converti:       number;
  conversionRate: number;
}

export function useLeads() {
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [stats, setStats]       = useState<LeadStats>({
    total: 0, nouveau: 0, "contacté": 0, converti: 0, conversionRate: 0,
  });
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState<string | null>(null);

  const [searchQuery,  setSearchQuery]  = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all");

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [leadsData, statsData] = await Promise.all([
        apiFetch<Lead[]>("/leads"),
        apiFetch<LeadStats>("/leads/stats"),
      ]);
      setAllLeads(leadsData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const leads = useMemo(() => {
    return allLeads.filter((lead) => {
      const matchesSearch =
        !searchQuery ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [allLeads, searchQuery, statusFilter, sourceFilter]);

  const refreshStats = () =>
    apiFetch<LeadStats>("/leads/stats").then(setStats).catch(() => {});

  const addLead = useCallback(async (
    data: Omit<Lead, "id" | "notes" | "createdAt" | "updatedAt">
  ): Promise<Lead> => {
    const newLead = await apiFetch<Lead>("/leads", {
      method: "POST",
      body:   JSON.stringify(data),
    });
    setAllLeads((prev) => [newLead, ...prev]);
    refreshStats();
    return newLead;
  }, []);

  const updateLead = useCallback(async (id: string, data: Partial<Lead>) => {
    const updated = await apiFetch<Lead>(`/leads/${id}`, {
      method: "PATCH",
      body:   JSON.stringify(data),
    });
    setAllLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
    refreshStats();
  }, []);

  const updateStatus = useCallback((id: string, status: LeadStatus) =>
    updateLead(id, { status }), [updateLead]);

  const deleteLead = useCallback(async (id: string) => {
    await apiFetch(`/leads/${id}`, { method: "DELETE" });
    setAllLeads((prev) => prev.filter((l) => l.id !== id));
    refreshStats();
  }, []);

  const addNote = useCallback(async (leadId: string, content: string) => {
    const note = await apiFetch<{ id: string; content: string; createdAt: string }>(
      `/leads/${leadId}/notes`,
      { method: "POST", body: JSON.stringify({ content }) }
    );
    setAllLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? { ...l, notes: [note, ...l.notes], updatedAt: new Date().toISOString() }
          : l
      )
    );
  }, []);

  const exportCSV = useCallback(() => {
    const headers = ["Nom","Email","Téléphone","Entreprise","Source","Statut","Créé le"];
    const rows    = allLeads.map((l) => [
      l.name, l.email, l.phone || "", l.company || "", l.source, l.status, l.createdAt,
    ]);
    const csv  = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [allLeads]);

  return {
    leads, allLeads, stats, loading, error,
    refetch: fetchLeads,
    searchQuery,  setSearchQuery,
    statusFilter, setStatusFilter,
    sourceFilter, setSourceFilter,
    addLead, updateLead, deleteLead, updateStatus, addNote, exportCSV,
  };
}
