import { SectionCard } from "../shared";

export default function UtilityStatCard({
  icon,
  iconTone = "bg-bg-subtle text-primary",
  title,
  value,
  unit,
  footerLabel,
  footerValue,
}) {
  const Icon = icon;

  return (
    <SectionCard className="p-6">
      <span className={`grid h-8 w-8 place-content-center rounded-xs ${iconTone}`}>
        <Icon size={16} />
      </span>

      <p className="mt-4 text-sm text-text-secondary">{title}</p>

      <div className="mt-2 flex items-end gap-2">
        <p className="text-4xl font-bold tracking-tight text-text-primary">{value}</p>
        {unit ? <p className="pb-1 text-xl text-text-muted">{unit}</p> : null}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border-default pt-4">
        <p className="text-xs text-text-muted">{footerLabel}</p>
        <p className="text-sm font-semibold text-text-primary">{footerValue}</p>
      </div>
    </SectionCard>
  );
}
