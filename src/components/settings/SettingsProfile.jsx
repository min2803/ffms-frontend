import { ShieldCheck } from "lucide-react";
import { SectionCard } from "../shared";
import { getAvatarUrl } from "../../utils/avatar";

export default function SettingsProfile({ profile = {} }) {
  const { name = "", role = "", status = "", joinedDate = "", avatar = "", uid = "" } = profile;
  const effectiveAvatar = avatar || getAvatarUrl(name);

  return (
    <SectionCard className="relative overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary/5 blur-glow-md" />

      <div className="relative flex flex-col items-stretch gap-8 md:flex-row md:items-center md:gap-8">
        <div className="relative h-32 w-32 shrink-0 self-start md:self-center">
          <div className="h-full w-full overflow-hidden rounded-sm border-4 border-bg-surface shadow-button-sm">
            <img src={effectiveAvatar} alt={name} className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-[30px] font-semibold leading-9 text-text-primary">
            {name}
          </h2>
          <div className="flex items-center gap-2 text-base font-medium text-text-secondary">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
            <span>{role}</span>
          </div>
          <p className="pt-0.5 font-mono text-xs text-text-secondary/80">
            UID: {uid}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <span className="rounded-pill bg-role-editor-bg px-3 py-1 text-xs font-semibold uppercase tracking-[0.6px] text-role-editor-text">
              {status}
            </span>
            <span className="rounded-pill bg-bg-tint-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.6px] text-text-secondary">
              {joinedDate}
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
