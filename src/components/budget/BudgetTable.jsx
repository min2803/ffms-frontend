import { Zap, Utensils, ShoppingBag, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionCard from "../shared/SectionCard";
import PrimaryButton from "../shared/PrimaryButton";
import { useAppContext } from "../../contexts/AppContext";
import { formatCurrency } from "../../utils/formatCurrency";

const iconMap = { Zap, Utensils, ShoppingBag };

export default function BudgetTable({ onAddClick, categories: budgetCategories = [] }) {
  const { t } = useTranslation();
  const { currency, language } = useAppContext();
  const fmt = (amount) => formatCurrency(amount, currency, language);

  return (
    <SectionCard className="overflow-hidden mt-8">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-lg font-bold text-text-primary">
          {t("budget.categoryDistribution")}
        </h2>
        <PrimaryButton onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          {t("budget.createNewBudget")}
        </PrimaryButton>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-[#f8fafc]">
            <tr>
              <th className="px-6 py-4 font-semibold text-text-muted uppercase tracking-wider text-[10px]">{t("common.category")}</th>
              <th className="px-6 py-4 font-semibold text-text-muted uppercase tracking-wider text-[10px]">{t("budget.budgetLimit")}</th>
              <th className="px-6 py-4 font-semibold text-text-muted uppercase tracking-wider text-[10px]">{t("budget.spentToDate")}</th>
              <th className="px-6 py-4 font-semibold text-text-muted uppercase tracking-wider text-[10px] w-64">{t("budget.progress")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {budgetCategories.map((cat) => {
              const IconComp = iconMap[cat.icon] || Plus;
              const limit = cat.limit ?? cat.budget ?? 0;
              const spent = cat.spent ?? 0;
              const percent = cat.percent ?? cat.usagePercent ?? (limit > 0 ? Math.round((spent / limit) * 100) : 0);
              const status = cat.status || (percent > 100 ? "over" : percent > 80 ? "warning" : "ok");
              const isOver = status === "over";
              const isWarning = status === "warning";

              const progressBg = isOver ? "bg-red-500" : isWarning ? "bg-yellow-500" : "bg-emerald-600";
              const typeColor = isOver ? "text-red-500" : "text-text-muted";
              const amountLeft = limit - spent;

              const textAmountLeft = isOver
                ? `-${fmt(Math.abs(amountLeft))} ${t("budget.over")}`
                : `${fmt(amountLeft)} ${t("budget.left")}`;

              return (
                <tr key={cat.id} id={`budget-cat-${cat.id}`} className="bg-white transition-all duration-500 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ${isOver ? "bg-red-50 text-red-500" : isWarning ? "bg-orange-50 text-orange-500" : "bg-[#f0f4fa] text-primary"}`}>
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-text-primary">{cat.name}</div>
                        <div className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${typeColor}`}>{cat.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-text-primary">
                    {fmt(limit)}
                  </td>
                  <td className={`px-6 py-4 font-bold ${isOver ? "text-red-500" : "text-text-primary"}`}>
                    {fmt(spent)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-between text-[11px] font-bold mb-1">
                      <span className={isOver ? "text-red-500" : isWarning ? "text-yellow-600" : "text-emerald-700"}>{percent}%</span>
                      <span className={isOver ? "text-red-500" : isWarning ? "text-yellow-600" : "text-text-muted"}>{textAmountLeft}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle">
                      <div className={`h-full rounded-full ${progressBg}`} style={{ width: `${Math.min(percent, 100)}%` }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
