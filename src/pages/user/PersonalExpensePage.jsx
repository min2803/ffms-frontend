import { useState } from "react";
import { useTranslation } from "react-i18next";
import UserLayout from "../../components/layout/UserLayout";
import { Sidebar, Header } from "../../components/dashboard";
import { PersonalExpenseView } from "../../components/expense";
import { getNavigationItems } from "../../data/navigation";
import { getCurrentMonthYear } from "../../utils/dateTime";
import useExpenses from "../../hooks/useExpenses";
import { useNotifications } from "../../contexts/NotificationContext";
import { useAppContext } from "../../contexts/AppContext";
import { useToast } from "../../contexts/ToastContext";

export default function PersonalExpensePage() {
  const { t } = useTranslation();
  const { language } = useAppContext();
  const [sidebarCollapsed] = useState(false);

  const navItems = getNavigationItems("expense", "expense-personal", t);
  const monthYear = getCurrentMonthYear(language === "vi" ? "vi-VN" : "en-US");
  const { expenses, loading, error, addExpense, updateExpense, deleteExpense } = useExpenses({ type: "personal" });
  const { unreadCount } = useNotifications();
  const toast = useToast();

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const categoryTotals = expenses.reduce((acc, e) => {
    const cat = e.category_name || t("common.other");
    acc[cat] = (acc[cat] || 0) + parseFloat(e.amount || 0);
    return acc;
  }, {});
  const allocations = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
    percent: total > 0 ? Math.round((amount / total) * 100) : 0,
  }));

  const transactions = expenses.map((e) => ({
    id: e.id,
    icon: "ShoppingCart",
    title: e.category_name || e.description || t("nav.expense"),
    date: e.expense_date ? new Date(e.expense_date).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US") : "",
    category: e.category_name || t("common.other"),
    amount: parseFloat(e.amount || 0),
    status: t("common.completed"),
    // Keep raw data for edit
    _raw: e,
  }));

  const expenseData = {
    summary: { total, fixed: 0, variable: total, unplanned: 0 },
    allocations,
    transactions,
  };

  const handleAddExpense = async (payload) => {
    await addExpense(payload);
    toast.success(t("expenseModal.createSuccess"));
  };

  const handleEditExpense = async (id, payload) => {
    await updateExpense(id, payload);
    toast.success(t("expenseModal.updateSuccess"));
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      toast.success(t("expenseModal.deleteSuccess"));
    } catch {
      toast.error(t("expenseModal.deleteFailed"));
    }
  };

  return (
    <UserLayout
      sidebar={<Sidebar navItems={navItems} collapsed={sidebarCollapsed} />}
      header={
        <Header
          title={t("expense.personalTitle")}
          subtitle={t("expense.personalSubtitle", { monthYear })}
          notificationCount={unreadCount}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
    >
      {loading ? (
        <div className="py-10 text-center font-medium text-text-secondary">
          {t("expense.loadingPersonal")}
        </div>
      ) : error ? (
        <div className="py-10 text-center font-medium text-red-500">
          {t("common.errorPrefix")} {error}
        </div>
      ) : (
        <PersonalExpenseView
          expenseData={expenseData}
          onAddExpense={handleAddExpense}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
        />
      )}
    </UserLayout>
  );
}
