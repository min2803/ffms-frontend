import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function AssetAllocation({ data = [] }) {
  const { t } = useTranslation();
  const gradient = useMemo(() => {
    const segments = data.reduce(
      (acc, item) => {
        const start = acc.offset;
        const end = start + item.percent;
        acc.offset = end;
        acc.parts.push(`${item.color} ${start}% ${end}%`);
        return acc;
      },
      { offset: 0, parts: [] }
    );

    return segments.parts.join(", ");
  }, [data]);

  return (
    <article className="rounded-md border border-border-default bg-bg-surface p-5 shadow-soft">
      <p className="mb-4 text-lg font-bold text-text-primary">{t("dashboard.assetAllocation")}</p>
      <div className="flex items-center gap-8">
        {/* Donut */}
        <div
          className="relative grid h-40 w-40 shrink-0 place-content-center rounded-full"
          style={{ background: `conic-gradient(${gradient})` }}
        >
          <div className="grid h-24 w-24 place-content-center rounded-full bg-bg-surface text-center">
            <p className="text-sm font-semibold text-text-primary">{t("common.total")}</p>
            <p className="text-xs text-text-soft">100%</p>
          </div>
        </div>

        {/* Legend */}
        <ul className="space-y-3 text-sm">
          {data.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-text-secondary">{item.label}</span>
              <span className="font-bold text-text-primary">{item.percent}%</span>
              <span className="text-text-soft">({item.amount})</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
