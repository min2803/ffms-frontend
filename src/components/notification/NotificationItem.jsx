import { Bell, Wallet, TrendingUp, AlertTriangle, Info } from "lucide-react";

const typeIconMap = {
  budget_warning: { icon: Wallet, tone: "bg-amber-100 text-amber-600" },
  budget_alert: { icon: AlertTriangle, tone: "bg-red-100 text-red-600" },
  income: { icon: TrendingUp, tone: "bg-emerald-100 text-emerald-600" },
  expense: { icon: Wallet, tone: "bg-rose-100 text-rose-600" },
  info: { icon: Info, tone: "bg-blue-100 text-blue-600" },
  system: { icon: Bell, tone: "bg-gray-100 text-gray-600" },
};

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export default function NotificationItem({ item, onSelect }) {
  const mapped = typeIconMap[item.type] || typeIconMap.system;
  const Icon = (typeof item.icon === "function") ? item.icon : mapped.icon;
  const iconTone = item.iconTone || mapped.tone;
  const isUnread = item.unread ?? !item.is_read;
  const title = item.title || item.type || "Notification";
  const time = item.time || formatTime(item.created_at);

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={`relative flex w-full items-start gap-4 px-5 py-4 text-left transition ${
        isUnread ? "bg-bg-subtle/90" : "bg-bg-surface"
      } hover:bg-bg-subtle`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-content-center rounded-full text-sm ${iconTone}`}
      >
        <Icon size={18} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="mb-1 flex items-start justify-between gap-3">
          <span className="text-sm font-semibold text-text-primary">{title}</span>
          <span className="whitespace-nowrap text-[10px] text-text-secondary">
            {time}
          </span>
        </span>
        <span className="block text-xs leading-5 text-text-secondary">{item.message}</span>
      </span>

      {isUnread ? (
        <span className="absolute right-2 top-4 h-2 w-2 rounded-full bg-primary" />
      ) : null}
    </button>
  );
}
