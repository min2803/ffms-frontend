import { MoreHorizontal } from "lucide-react";
import { SectionCard } from "../shared";

export default function ConsumptionHistoryCard({ title, subtitle, labels, upperValues, lowerValues }) {
  const maxValue = Math.max(...upperValues, ...lowerValues, 1);

  return (
    <SectionCard className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-3xl font-bold tracking-tight text-text-primary">{title || "Consumption History"}</h3>
          <p className="mt-1 text-sm text-text-secondary">
            {subtitle || "Power usage measured in kWh over the last 30 days"}
          </p>
        </div>
        <button type="button" className="text-text-muted" aria-label="Chart options">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Chart area */}
      <div className="mt-6 rounded-sm bg-bg-surface px-4 pt-4 pb-3">
        {/* Bars */}
        <div className="flex items-end gap-1" style={{ height: 220 }}>
          {upperValues.map((val, i) => {
            const upperPct = maxValue > 0 ? (val / maxValue) * 100 : 0;
            const lowerPct = maxValue > 0 ? ((lowerValues[i] || 0) / maxValue) * 100 : 0;
            return (
              <div key={i} className="relative flex-1" style={{ height: "100%" }}>
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t-[6px] bg-bg-utility-chart-top"
                  style={{ height: `${upperPct}%` }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t-[6px] bg-bg-utility-chart-bottom"
                  style={{ height: `${lowerPct}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Labels — same flex layout as bars */}
        <div className="mt-2 flex gap-1">
          {labels.map((label, i) => (
            <p key={i} className="flex-1 text-center text-xs font-semibold uppercase tracking-[1px] text-text-muted">
              {label}
            </p>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
