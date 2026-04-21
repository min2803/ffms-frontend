import { Bell, Droplets, Zap } from "lucide-react";

export default function UtilitiesHeaderBar({ title }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-5xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)]">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="grid h-10 w-10 place-content-center rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-[var(--color-text-muted)]"
          aria-label="Utilities notifications"
        >
          <Bell size={16} />
        </button>

        <div className="flex items-center rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] p-1">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[var(--radius-xs)] bg-[var(--color-bg-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)]"
          >
            <Zap size={14} />
            Electricity
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[var(--radius-xs)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)]"
          >
            <Droplets size={14} />
            Water
          </button>
        </div>
      </div>
    </div>
  );
}
