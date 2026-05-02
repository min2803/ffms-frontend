import { Wallet, PiggyBank, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionCard from "../shared/SectionCard";
import { useAppContext } from "../../contexts/AppContext";
import { formatCurrency } from "../../utils/formatCurrency";

export default function BudgetOverview({ budgetSummary = {}, violatedIds = [] }) {
  const { t } = useTranslation();
  const { currency, language } = useAppContext();
  const fmt = (amount) => formatCurrency(amount, currency, language);

  const totalBudget = budgetSummary.totalBudget ?? 0;
  const totalUsedPercent = budgetSummary.totalUsedPercent ?? budgetSummary.usagePercent ?? 0;
  const remainingBalance = budgetSummary.remainingBalance ?? budgetSummary.remaining ?? 0;
  const violations = budgetSummary.violations ?? { count: 0, message: "" };
  const violationCount = violations.count ?? 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <SectionCard className="p-6">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-sm bg-[#e6f0f9] text-primary">
          <Wallet className="h-5 w-5" />
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("budget.totalMonthlyBudget")}</div>
        <div className="mt-1 flex items-baseline text-3xl font-bold text-text-primary">
          {fmt(totalBudget)}
        </div>
        <div className="mt-6">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle">
            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(totalUsedPercent, 100)}%` }} />
          </div>
          <div className="mt-2 text-[11px] font-medium text-text-muted">
            {t("budget.ofTotalUsed", { percent: totalUsedPercent })}
          </div>
        </div>
      </SectionCard>

      <SectionCard className="p-6">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-sm bg-emerald-50 text-emerald-600">
          <PiggyBank className="h-5 w-5" />
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("budget.remainingBalance")}</div>
        <div className="mt-1 flex items-baseline text-3xl font-bold text-text-primary">
          {fmt(remainingBalance)}
        </div>
        <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          {remainingBalance >= 0 ? t("budget.onTrack") : t("budget.overBudget")} — {fmt(Math.abs(remainingBalance))} {remainingBalance >= 0 ? t("budget.remaining") : t("budget.exceeded")}
        </div>
      </SectionCard>

      {violationCount > 0 ? (
        <SectionCard className="border-l-4 border-l-red-500 p-6 relative">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <div className="text-[10px] font-bold uppercase tracking-widest text-red-600">{t("budget.attentionRequired")}</div>
          </div>
          <div className="mt-3 text-lg font-bold text-text-primary">
            {violationCount === 1 ? t("budget.categoryOver", { count: violationCount }) : t("budget.categoriesOver", { count: violationCount })}
          </div>
          <div className="mt-2 text-sm text-text-secondary leading-relaxed">
            {violations.message || t("budget.someBudgetExceeded")}
          </div>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => {
                const firstId = violatedIds[0];
                if (!firstId) return;
                const el = document.getElementById(`budget-cat-${firstId}`);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                  el.classList.add("ring-2", "ring-red-400", "bg-red-50");
                  setTimeout(() => el.classList.remove("ring-2", "ring-red-400", "bg-red-50"), 1000);
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              {t("budget.reviewViolations")}
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </SectionCard>
      ) : (
        <SectionCard className="border-l-4 border-l-emerald-500 p-6 relative">
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">{t("budget.allClear")}</div>
          </div>
          <div className="mt-3 text-lg font-bold text-text-primary">
            {t("budget.noViolations")}
          </div>
          <div className="mt-2 text-sm text-text-secondary leading-relaxed">
            {t("budget.allWithinLimits")}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
