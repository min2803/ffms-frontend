import { ChevronDown } from "lucide-react";

const labelClass =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[1.1px] text-text-secondary";

const controlShell =
  "rounded-xs border-b-2 border-border-default bg-bg-surface px-4 py-3 shadow-soft transition focus-within:border-primary";

export function SettingsTextField({ label, id, className = "", error = "", ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className={controlShell}>
        <input
          id={id}
          className="w-full border-0 bg-transparent text-base font-medium text-text-primary outline-none placeholder:text-input-placeholder"
          {...props}
        />
      </div>
      {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
    </div>
  );
}

export function SettingsSelectField({ label, id, children, className = "", error = "", ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className={`relative ${controlShell}`}>
        <select
          id={id}
          className="w-full cursor-pointer appearance-none border-0 bg-transparent py-0.5 pr-8 text-base font-medium text-text-primary outline-none"
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-input-icon"
          aria-hidden
        />
      </div>
      {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
