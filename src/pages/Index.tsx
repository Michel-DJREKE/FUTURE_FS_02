import { useState } from "react";
import { useLeads } from "@/hooks/useLeads";
import { StatsCards } from "@/components/crm/StatsCards";
import { LeadsToolbar } from "@/components/crm/LeadsToolbar";
import { LeadsTable } from "@/components/crm/LeadsTable";
import { LeadDetailSheet } from "@/components/crm/LeadDetailSheet";
import { AddLeadDialog } from "@/components/crm/AddLeadDialog";
import { LeadsByStatusChart } from "@/components/crm/LeadsByStatusChart";
import { Lead } from "@/types/lead";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const Index = () => {
  const {
    leads, stats,
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    sourceFilter, setSourceFilter,
    addLead, updateStatus, deleteLead, addNote, exportCSV,
  } = useLeads();

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const handleSelect = (lead: Lead) => {
    setSelectedLead(lead);
    setSheetOpen(true);
  };

  // Keep selected lead in sync
  const currentLead = selectedLead
    ? leads.find((l) => l.id === selectedLead.id) || selectedLead
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
      
            <h1 className="font-display text-lg font-bold">CRM Dashboard</h1>
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block">CRM · Gestion des Leads</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <StatsCards stats={stats} />
            <LeadsByStatusChart stats={stats} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
          <LeadsToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sourceFilter={sourceFilter}
            onSourceFilterChange={setSourceFilter}
            onAddClick={() => setAddOpen(true)}
            onExport={exportCSV}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
          <LeadsTable
            leads={leads}
            onUpdateStatus={updateStatus}
            onDelete={deleteLead}
            onSelect={handleSelect}
          />
        </motion.div>
      </main>

      <LeadDetailSheet
        lead={currentLead}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onUpdateStatus={updateStatus}
        onAddNote={addNote}
      />

      <AddLeadDialog open={addOpen} onOpenChange={setAddOpen} onAdd={addLead} />
    </div>
  );
};

export default Index;
