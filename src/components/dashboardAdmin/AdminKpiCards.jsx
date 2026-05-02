import { Users, Home, ArrowRightLeft, Activity, CheckCircle, HelpCircle } from "lucide-react";
import AdminKpiCard from "./AdminKpiCard";

const iconMap = {
  Users,
  Home,
  ArrowRightLeft,
  Activity,
  CheckCircle,
};

export default function AdminKpiCards({ cards }) {
  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const resolvedIcon = typeof card.icon === "function"
          ? card.icon
          : iconMap[card.icon] || HelpCircle;
        return (
          <AdminKpiCard
            key={card.id ?? idx}
            label={card.label}
            value={card.value}
            icon={resolvedIcon}
            iconBg={card.iconBg || "bg-bg-subtle text-primary"}
            highlighted={card.highlighted}
          />
        );
      })}
    </section>
  );
}
