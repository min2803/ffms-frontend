import { useState } from "react";
import { useTranslation } from "react-i18next";
import UserLayout from "../../components/layout/UserLayout";
import { Sidebar, Header } from "../../components/dashboard";
import { FamilyExpenseView } from "../../components/expense";
import { getNavigationItems } from "../../data/navigation";
import { getCurrentMonthYear } from "../../utils/dateTime";
import useExpenses from "../../hooks/useExpenses";
import { useNotifications } from "../../contexts/NotificationContext";
import { useAppContext } from "../../contexts/AppContext";
import { useToast } from "../../contexts/ToastContext";

export default function FamilyExpensePage() {
  const { t } = useTranslation();
  const { language } = useAppContext();
  const [sidebarCollapsed] = useState(false);

  const navItems = getNavigationItems("expense", "expense-family", t);
  const monthYear = getCurrentMonthYear(language === "vi" ? "vi-VN" : "en-US");
  const { expenses, loading, error, addExpense, updateExpense, deleteExpense, refetch } = useExpenses({ type: "family" });
  const { unreadCount } = useNotifications();
  const toast = useToast();

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

  const memberTotals = expenses.reduce((acc, e) => {
    const key = e.user_id;
    if (!acc[key]) acc[key] = { name: e.user_name || t("household.members"), amount: 0 };
    acc[key].amount += parseFloat(e.amount || 0);
    return acc;
  }, {});
  const members = Object.values(memberTotals).map((m) => ({
    ...m,
    percent: total > 0 ? Math.round((m.amount / total) * 100) : 0,
  }));

  const categoryTotals = expenses.reduce((acc, e) => {
    const cat = e.category_name || t("common.other");
    acc[cat] = (acc[cat] || 0) + parseFloat(e.amount || 0);
    return acc;
  }, {});
  const categories = Object.entries(categoryTotals).map(([name, amount]) => ({
    name,
    percent: total > 0 ? Math.round((amount / total) * 100) : 0,
    color: "bg-blue-500",
  }));

  const visibleExpenses = expenses.filter(e => !e.hide_details);

  const transactions = visibleExpenses.map((e) => ({
    id: e.id,
    icon: "ShoppingCart",
    title: e.category_name || e.description || t("nav.expense"),
    subtitle: e.user_name || "",
    amount: parseFloat(e.amount || 0),
    status: t("common.completed").toUpperCase(),
    avatars: [],
    // Keep raw data for edit
    _raw: e,
  }));

  const expenseData = {
    summary: { total, sharedBudget: null, dailyAverage: daysInMonth > 0 ? total / daysInMonth : 0 },
    members,
    categories,
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
          title={t("expense.familyTitle")}
          subtitle={t("expense.familySubtitle", { monthYear })}
          notificationCount={unreadCount}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
    >
      {loading ? (
        <div className="py-10 text-center font-medium text-text-secondary">
          {t("expense.loadingFamily")}
        </div>
      ) : error ? (
        <div className="py-10 text-center font-medium text-red-500">
          {t("common.errorPrefix")} {error}
        </div>
      ) : (
        <FamilyExpenseView
          expenseData={expenseData}
          onAddExpense={handleAddExpense}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
        />
      )}
    </UserLayout>
  );
}
