import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusCircle, Wallet } from "lucide-react";
import UserLayout from "../../components/layout/UserLayout";
import { Sidebar, Header } from "../../components/dashboard";
import { BudgetOverview, BudgetTable, BudgetHistory, AddBudgetModal } from "../../components/budget";
import { getNavigationItems } from "../../data/navigation";
import useBudget from "../../hooks/useBudget";
import { useNotifications } from "../../contexts/NotificationContext";
import { useAppContext } from "../../contexts/AppContext";

export default function BudgetPage() {
  const { t } = useTranslation();
  const { currency } = useAppContext();
  const [sidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { budget, hasNoBudget, currentMonth, currentYear, history, loading, error, setBudget } = useBudget();
  const { unreadCount } = useNotifications();

  const navItems = getNavigationItems("budget", undefined, t);

  const budgetRows = Array.isArray(budget) ? budget : [];
  const totalBudget = budgetRows.reduce((s, b) => s + parseFloat(b.amount || 0), 0);
  const totalSpent = budgetRows.reduce((s, b) => s + parseFloat(b.total_expense || 0), 0);
  const overBudgetCategories = budgetRows.filter((b) => parseFloat(b.total_expense || 0) > parseFloat(b.amount || 0));
  const budgetSummary = {
    totalBudget,
    totalSpent,
    remaining: totalBudget - totalSpent,
    usagePercent: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
    violations: {
      count: overBudgetCategories.length,
      message: overBudgetCategories.length > 0
        ? t("budget.exceededBudgetLimits", { categories: overBudgetCategories.map((b) => b.category_name).join(", ") })
        : "",
    },
  };
  const categories = budgetRows.map((b) => ({
    id: b.id,
    name: b.category_name || t("common.category"),
    budget: parseFloat(b.amount || 0),
    spent: parseFloat(b.total_expense || 0),
    usagePercent: parseFloat(b.usage_percentage || 0),
  }));

  const monthLabel = currentMonth && currentYear
    ? `${String(currentMonth).padStart(2, "0")}/${currentYear}`
    : "";

  return (
    <>
      <UserLayout
        sidebar={<Sidebar navItems={navItems} collapsed={sidebarCollapsed} />}
        header={
          <Header
            title={t("budget.title")}
            subtitle={t("budget.subtitle")}
            notificationCount={unreadCount}
          />
        }
        sidebarCollapsed={sidebarCollapsed}
      >
        <div className="flex flex-col gap-8 pb-10">
          {loading ? (
            <div className="py-10 text-center font-medium text-text-secondary">
              {t("budget.loadingBudget")}
            </div>
          ) : error ? (
            <div className="py-10 text-center font-medium text-red-500">
              {t("budget.errorLoading")} {error}
            </div>
          ) : hasNoBudget ? (
            /* ── Empty State: chưa có budget tháng này ── */
            <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
              <div className="grid h-20 w-20 place-content-center rounded-full bg-bg-tint-soft">
                <Wallet className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-text-primary">
                {t("budget.noBudgetTitle", "Chưa có ngân sách")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {t("budget.noBudgetMessage", "Bạn chưa thiết lập ngân sách cho tháng {{month}}. Hãy tạo ngân sách để quản lý chi tiêu hiệu quả!", { month: monthLabel })}
              </p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="mt-8 inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
              >
                <PlusCircle className="h-5 w-5" />
                {t("budget.createNew", "Tạo ngân sách mới")}
              </button>
            </div>
          ) : (
            /* ── Normal State: có budget ── */
            <>
              <BudgetOverview budgetSummary={budgetSummary} violatedIds={overBudgetCategories.map(b => b.id)} />
              <BudgetTable categories={categories} onAddClick={() => setIsModalOpen(true)} />
            </>
          )}

          {/* ── Budget History (thay thế Spending Projection) ── */}
          {!loading && !error && <BudgetHistory history={history} />}
        </div>
      </UserLayout>

      <AddBudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          await setBudget({
            categoryId: data.category,
            amount: data.amount,
            month: currentMonth || new Date().getMonth() + 1,
            year: currentYear || new Date().getFullYear(),
          });
        }}
      />
    </>
  );
}
