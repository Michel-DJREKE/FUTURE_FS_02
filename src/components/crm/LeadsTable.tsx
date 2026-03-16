import { Lead, LeadStatus, STATUS_FLOW, SOURCE_LABELS } from "@/types/lead";
import { StatusBadge } from "./StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowRight, Trash2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface LeadsTableProps {
  leads: Lead[];
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onDelete: (id: string) => void;
  onSelect: (lead: Lead) => void;
}

export function LeadsTable({ leads, onUpdateStatus, onDelete, onSelect }: LeadsTableProps) {
  const getNextStatus = (current: LeadStatus): LeadStatus | null => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Nom</TableHead>
            <TableHead className="font-semibold hidden sm:table-cell">Email</TableHead>
            <TableHead className="font-semibold hidden md:table-cell">Source</TableHead>
            <TableHead className="font-semibold">Statut</TableHead>
            <TableHead className="font-semibold hidden lg:table-cell">Date</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence mode="popLayout">
            {leads.map((lead) => {
              const next = getNextStatus(lead.status);
              return (
                <motion.tr
                  key={lead.id}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="group cursor-pointer border-b border-border/30 hover:bg-accent/40 transition-colors"
                  onClick={() => onSelect(lead)}
                >
                  <TableCell className="font-medium">
                    <div>
                      <p>{lead.name}</p>
                      {lead.company && (
                        <p className="text-xs text-muted-foreground">{lead.company}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{lead.email}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{SOURCE_LABELS[lead.source]}</TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {format(new Date(lead.createdAt), "d MMM yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelect(lead); }}>
                          <MessageSquare className="mr-2 h-3.5 w-3.5" /> Détails & Notes
                        </DropdownMenuItem>
                        {next && (
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onUpdateStatus(lead.id, next); }}>
                            <ArrowRight className="mr-2 h-3.5 w-3.5" /> Passer à "{next}"
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }}
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              );
            })}
          </AnimatePresence>
          {leads.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                Aucun lead trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
