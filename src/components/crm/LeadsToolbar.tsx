import { LeadStatus, LeadSource, STATUS_LABELS, SOURCE_LABELS } from "@/types/lead";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Plus, Download } from "lucide-react";

interface LeadsToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: LeadStatus | "all";
  onStatusFilterChange: (s: LeadStatus | "all") => void;
  sourceFilter: LeadSource | "all";
  onSourceFilterChange: (s: LeadSource | "all") => void;
  onAddClick: () => void;
  onExport: () => void;
}

export function LeadsToolbar({
  searchQuery, onSearchChange,
  statusFilter, onStatusFilterChange,
  sourceFilter, onSourceFilterChange,
  onAddClick, onExport,
}: LeadsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as LeadStatus | "all")}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={(v) => onSourceFilterChange(v as LeadSource | "all")}>
          <SelectTrigger className="w-[140px] hidden md:flex"><SelectValue placeholder="Source" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes sources</SelectItem>
            {Object.entries(SOURCE_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="mr-1.5 h-3.5 w-3.5" /> Export
        </Button>
        <Button size="sm" onClick={onAddClick}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Nouveau Lead
        </Button>
      </div>
    </div>
  );
}
