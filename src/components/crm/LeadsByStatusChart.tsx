import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { STATUS_LABELS, LeadStatus } from "@/types/lead";

const COLORS: Record<LeadStatus, string> = {
  nouveau: "hsl(221 83% 53%)",
  contacté: "hsl(38 92% 50%)",
  converti: "hsl(142 71% 45%)",
};

interface Props {
  stats: { nouveau: number; contacté: number; converti: number };
}

export function LeadsByStatusChart({ stats }: Props) {
  const data = (Object.entries(stats) as [LeadStatus, number][])
    .filter(([k]) => k in STATUS_LABELS)
    .map(([key, value]) => ({ name: STATUS_LABELS[key], value, fill: COLORS[key] }));

  return (
    <div className="stat-card">
      <p className="text-sm font-medium text-muted-foreground mb-4">Répartition par statut</p>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.fill }} />
            {d.name} ({d.value})
          </div>
        ))}
      </div>
    </div>
  );
}
