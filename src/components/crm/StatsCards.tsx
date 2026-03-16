import { Users, UserPlus, Phone, CheckCircle2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardsProps {
  stats: {
    total: number;
    nouveau: number;
    contacté: number;
    converti: number;
    conversionRate: number;
  };
}

const cards = [
  { key: "total", label: "Total Leads", icon: Users, color: "text-primary" },
  { key: "nouveau", label: "Nouveaux", icon: UserPlus, color: "text-info" },
  { key: "contacté", label: "Contactés", icon: Phone, color: "text-warning" },
  { key: "converti", label: "Convertis", icon: CheckCircle2, color: "text-success" },
] as const;

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </div>
          <p className="mt-2 text-2xl font-bold font-display">{stats[card.key]}</p>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="stat-card col-span-2 lg:col-span-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Taux de conversion</p>
            <p className="mt-1 text-2xl font-bold font-display">{stats.conversionRate}%</p>
          </div>
          <TrendingUp className="h-5 w-5 text-success" />
        </div>
        <div className="mt-3 h-2 rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.conversionRate}%` }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full bg-success"
          />
        </div>
      </motion.div>
    </div>
  );
}
