import { ScanLine } from "lucide-react";
import { SectionCard } from "../shared";

function MeterHistoryItem({ item }) {
  return (
    <div className="flex items-start gap-3 rounded-sm bg-bg-subtle p-3">
      <span className="mt-1 grid h-8 w-8 shrink-0 place-content-center rounded-xs bg-bg-surface text-text-muted">
        <ScanLine size={14} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold leading-tight text-text-primary">{item.dateLabel}</p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.8px] text-text-muted">
          {item.type}
        </p>
      </div>

      <div className="text-right">
        <p className="text-base font-bold leading-tight text-text-primary">{item.reading ?? item.value}</p>
        <p className="mt-1 text-xs font-semibold text-state-success">{item.delta}</p>
      </div>
    </div>
  );
}

export default function MeterHistoryCard({ items, title, viewAllLabel }) {
  return (
    <SectionCard className="h-full p-6">
      <h3 className="text-3xl font-bold tracking-tight text-text-primary">{title || "Meter History"}</h3>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <MeterHistoryItem key={item.id} item={item} />
        ))}
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-sm border border-border-default px-4 py-3 text-sm font-semibold text-text-secondary"
      >
        {viewAllLabel || "View Full History"}
      </button>
    </SectionCard>
  );
}
