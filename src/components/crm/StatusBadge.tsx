import { LeadStatus, STATUS_LABELS } from "@/types/lead";
import { cn } from "@/lib/utils";

const statusStyles: Record<LeadStatus, string> = {
  nouveau: "bg-info/10 text-info border-info/20",
  contacté: "bg-warning/10 text-warning border-warning/20",
  converti: "bg-success/10 text-success border-success/20",
};

export function StatusBadge({ status, className }: { status: LeadStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        statusStyles[status],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}
