import { ChevronDown } from "lucide-react";

const ROLE_TONES = {
  Owner: {
    bgClass: "bg-bg-badge",
    textClass: "text-primary",
  },
  Admin: {
    bgClass: "bg-secondary/35",
    textClass: "text-state-success",
  },
  Member: {
    bgClass: "bg-role-member-bg",
    textClass: "text-role-member-text",
  },
  Viewer: {
    bgClass: "bg-bg-progress-track",
    textClass: "text-text-secondary",
  },
};

export default function PermissionMemberRow({ member }) {
  const tone = ROLE_TONES[member.roleLabel] || ROLE_TONES.Viewer;

  return (
    <div className="flex items-center justify-between rounded-sm border border-[rgba(190,199,212,0.2)] bg-bg-subtle/60 p-3">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`grid h-8 w-8 shrink-0 place-content-center rounded-full text-xs font-semibold ${tone.bgClass} ${tone.textClass}`}
        >
          {member.initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary">{member.name}</p>
          <p className="truncate text-[10px] text-text-secondary">
            {member.subtitle}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-xs px-2 py-1.5 text-xs font-semibold text-primary hover:bg-bg-badge"
      >
        {member.roleLabel}
        <ChevronDown size={14} />
      </button>
    </div>
  );
}
