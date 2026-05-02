import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import UserLayout from "../../components/layout/UserLayout";
import { Sidebar, Header } from "../../components/dashboard";
import { IncomeFilters, IncomeHistory, AddIncomeModal } from "../../components/income";
import { getNavigationItems } from "../../data/navigation";
import useIncome from "../../hooks/useIncome";
import { useNotifications } from "../../contexts/NotificationContext";
import { useAppContext } from "../../contexts/AppContext";
import { useToast } from "../../contexts/ToastContext";
import { formatCurrency } from "../../utils/formatCurrency";

export default function IncomePage() {
  const { t } = useTranslation();
  const { currency, language } = useAppContext();
  const [sidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const { incomes, loading, error, addIncome, updateIncome, deleteIncome } = useIncome();
  const { unreadCount } = useNotifications();
  const toast = useToast();

  const [filters, setFilters] = useState({ dateRange: "30", category: "all" });

  const filteredIncomes = useMemo(() => {
    return incomes.filter((row) => {
      if (filters.category !== "all" && row.category_name !== filters.category) {
        return false;
      }
      if (filters.dateRange !== "all") {
        const days = parseInt(filters.dateRange, 10);
        const rowDate = new Date(row.income_date);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        if (rowDate < cutoffDate) {
          return false;
        }
      }
      return true;
    });
  }, [incomes, filters]);

  const incomeTransactions = filteredIncomes.map((row) => ({
    id: row.id,
    icon: "Banknote",
    sourceTitle: row.source,
    sourceSubtitle: row.category_name || row.description || row.user_name || "",
    date: row.income_date ? new Date(row.income_date).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US") : "",
    status: t("common.completed").toUpperCase(),
    amount: formatCurrency(parseFloat(row.amount), currency, language),
    // Keep raw data for edit
    _raw: row,
  }));

  const handleOpenAdd = () => {
    setEditingIncome(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tx) => {
    // tx._raw has the original data from the API
    setEditingIncome(tx._raw);
    setIsModalOpen(true);
  };

  const handleDelete = async (incomeId) => {
    try {
      await deleteIncome(incomeId);
      toast.success(t("incomePage.deleteSuccess"));
    } catch {
      toast.error(t("incomePage.deleteFailed"));
    }
  };

  const handleSave = async (payload) => {
    if (editingIncome) {
      await updateIncome(editingIncome.id, payload);
      toast.success(t("incomeModal.updateSuccess"));
    } else {
      await addIncome(payload);
      toast.success(t("incomeModal.createSuccess"));
    }
  };

  const navItems = getNavigationItems("income", undefined, t);

  return (
    <>
      <UserLayout
        sidebar={<Sidebar navItems={navItems} collapsed={sidebarCollapsed} />}
        header={
          <Header
            title={t("incomePage.title")}
            subtitle={t("incomePage.subtitle")}
            notificationCount={unreadCount}
          />
        }
        sidebarCollapsed={sidebarCollapsed}
      >
        <div className="flex flex-col gap-6">
          <IncomeFilters 
            categories={[...new Set(incomes.map((r) => r.category_name).filter(Boolean))]} 
            onFilterChange={setFilters} 
          />
          {loading ? (
            <div className="py-10 text-center font-medium text-text-secondary">
              {t("incomePage.loadingIncome")}
            </div>
          ) : error ? (
            <div className="py-10 text-center font-medium text-red-500">
              {t("common.errorPrefix")} {error}
            </div>
          ) : (
            <IncomeHistory
              transactions={incomeTransactions}
              onAddClick={handleOpenAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </UserLayout>

      <AddIncomeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIncome(null);
        }}
        onSave={handleSave}
        initialData={editingIncome}
      />
    </>
  );
}
