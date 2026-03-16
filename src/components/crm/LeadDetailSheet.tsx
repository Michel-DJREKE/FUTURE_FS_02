import { useState } from "react";
import { Lead, LeadStatus, STATUS_FLOW, STATUS_LABELS, SOURCE_LABELS } from "@/types/lead";
import { StatusBadge } from "./StatusBadge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Send, Mail, Phone, Building2, Globe, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LeadDetailSheetProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onAddNote: (leadId: string, content: string) => void;
}

export function LeadDetailSheet({ lead, open, onOpenChange, onUpdateStatus, onAddNote }: LeadDetailSheetProps) {
  const [noteContent, setNoteContent] = useState("");

  if (!lead) return null;

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    onAddNote(lead.id, noteContent.trim());
    setNoteContent("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="font-display text-xl">{lead.name}</SheetTitle>
          <StatusBadge status={lead.status} />
        </SheetHeader>

        <div className="space-y-6">
          {/* Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{lead.email}</span>
            </div>
            {lead.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{lead.phone}</span>
              </div>
            )}
            {lead.company && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{lead.company}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>{SOURCE_LABELS[lead.source]}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Créé le {format(new Date(lead.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}</span>
            </div>
          </div>

          <Separator />

          {/* Status flow */}
          <div>
            <p className="text-sm font-medium mb-3">Progression</p>
            <div className="flex gap-2">
              {STATUS_FLOW.map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={lead.status === s ? "default" : "outline"}
                  className="flex-1 text-xs"
                  onClick={() => onUpdateStatus(lead.id, s)}
                >
                  {STATUS_LABELS[s]}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div>
            <p className="text-sm font-medium mb-3">Notes & Suivi</p>
            <div className="flex gap-2">
              <Textarea
                placeholder="Ajouter une note..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="min-h-[60px] text-sm resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAddNote();
                }}
              />
              <Button size="icon" onClick={handleAddNote} disabled={!noteContent.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {lead.notes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-lg bg-muted/50 p-3"
                  >
                    <p className="text-sm">{note.content}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {format(new Date(note.createdAt), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {lead.notes.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Aucune note pour le moment</p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
