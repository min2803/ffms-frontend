import { AlertTriangle, CheckCircle, Info, Lightbulb } from "lucide-react";
import { useTranslation } from "react-i18next";

const typeIconMap = {
  warning: { icon: AlertTriangle, bg: "bg-amber-50 text-amber-600" },
  positive: { icon: CheckCircle, bg: "bg-emerald-50 text-emerald-600" },
  info: { icon: Info, bg: "bg-blue-50 text-blue-600" },
};
const defaultIcon = { icon: Lightbulb, bg: "bg-purple-50 text-purple-600" };

export default function AiInsights({ insights = [], onRefresh }) {
  const { t } = useTranslation();

  return (
    <aside className="flex flex-col rounded-md border border-border-default bg-bg-insights p-5 shadow-soft">
      <p className="mb-4 text-lg font-bold text-text-primary">{t("dashboard.aiInsights")}</p>

      <div className="flex-1 space-y-3">
        {insights.map((insight) => {
          const mapped = typeIconMap[insight.type] || defaultIcon;
          const Icon = insight.icon || mapped.icon;
          const iconBg = insight.iconBg || mapped.bg;
          return (
            <div key={insight.id} className="rounded-sm bg-bg-surface p-4">
              <div className="flex items-start gap-3">
                <div className={`grid h-8 w-8 shrink-0 place-content-center rounded-xs ${iconBg}`}>
                  <Icon size={14} />
                </div>
                <div className="w-full">
                  <p className="text-sm font-semibold text-text-primary">{insight.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-text-muted">{insight.description}</p>

                  {insight.progress != null && (
                    <div className="mt-2 h-1.5 w-full rounded-full bg-bg-progress-track">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{ width: `${insight.progress}%` }}
                      />
                    </div>
                  )}

                  {insight.actionLabel && (
                    <button
                      onClick={insight.onAction}
                      className="mt-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      {insight.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onRefresh}
        className="mt-4 w-full rounded-sm border border-border-default bg-bg-surface py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted transition hover:bg-bg-subtle"
      >
        {t("common.refreshAnalysis")}
      </button>
    </aside>
  );
}
