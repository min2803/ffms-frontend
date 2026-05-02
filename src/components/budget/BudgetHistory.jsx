import { useTranslation } from "react-i18next";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { SectionCard } from "../shared";
import { useAppContext } from "../../contexts/AppContext";

export default function BudgetHistory({ history = [] }) {
  const { t } = useTranslation();
  const { currency } = useAppContext();
  const [expandedIdx, setExpandedIdx] = useState(null);

  const currencySymbol = currency === "VND" ? "₫" : "$";
  const locale = currency === "VND" ? "vi-VN" : "en-US";

  const fmtAmount = (val) =>
    Number(val).toLocaleString(locale, { maximumFractionDigits: 0 });

  if (history.length === 0) {
    return (
      <div className="mt-8">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-text-primary">{t("budget.historyTitle", "Lịch sử ngân sách")}</h3>
          <p className="text-sm text-text-secondary">{t("budget.historySubtitle", "Xem lại ngân sách các tháng trước")}</p>
        </div>
        <SectionCard className="p-8 text-center">
          <Calendar className="mx-auto h-10 w-10 text-text-muted" />
          <p className="mt-3 text-sm text-text-secondary">
            {t("budget.noHistory", "Chưa có lịch sử ngân sách.")}
          </p>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-text-primary">{t("budget.historyTitle", "Lịch sử ngân sách")}</h3>
        <p className="text-sm text-text-secondary">{t("budget.historySubtitle", "Xem lại ngân sách các tháng trước")}</p>
      </div>

      <div className="space-y-3">
        {history.map((item, idx) => (
          <SectionCard key={`${item.year}-${item.month}`} className="overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              className="flex w-full items-center justify-between p-4 text-left transition hover:bg-bg-subtle/60"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-content-center rounded-xs bg-bg-tint-soft text-primary">
                  <Calendar className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-base font-semibold text-text-primary">
                    {t("budget.monthLabel", "Tháng")} {item.label}
                  </p>
                  <p className="text-xs text-text-muted">
                    {item.category_count} {t("budget.categories", "danh mục")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-text-primary">
                  {fmtAmount(item.total_amount)} {currencySymbol}
                </span>
                {expandedIdx === idx ? (
                  <ChevronUp className="h-4 w-4 text-text-muted" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-text-muted" />
                )}
              </div>
            </button>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
