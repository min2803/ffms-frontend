import { useState, useEffect } from "react";
import { ShoppingCart, Car, Home, LampDesk, Utensils, Plus, Filter, ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionCard from "../shared/SectionCard";
import PrimaryButton from "../shared/PrimaryButton";
import AddExpenseModal from "./AddExpenseModal";
import { useAppContext } from "../../contexts/AppContext";
import { formatCurrency } from "../../utils/formatCurrency";
import Pagination from "../ui/Pagination";

const iconMap = { ShoppingCart, Car, Home, LampDesk, Utensils };

/**
 * @param {Object}   expenseData   – { summary, allocations, transactions }
 * @param {Function} onAddExpense  – (payload) => Promise — create expense
 * @param {Function} onEditExpense – (id, payload) => Promise — update expense
 * @param {Function} onDeleteExpense – (id) => Promise — delete expense
 */
export default function PersonalExpenseView({ expenseData = {}, onAddExpense, onEditExpense, onDeleteExpense }) {
  const { t } = useTranslation();
  const { currency, language } = useAppContext();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const { summary = {}, allocations = [], transactions = [] } = expenseData;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [transactions.length]);

  const totalPages = Math.ceil(transactions.length / itemsPerPage) || 1;
  const paginatedTransactions = transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const fmt = (amount) => formatCurrency(amount, currency, language);

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setIsAddExpenseOpen(true);
  };

  const handleEdit = (tx) => {
    setEditingExpense(tx._raw || tx);
    setIsAddExpenseOpen(true);
  };

  const handleDelete = (tx) => {
    if (window.confirm(t("expenseModal.confirmDelete"))) {
      onDeleteExpense?.(tx.id);
    }
  };

  const handleSubmit = async (payload) => {
    if (editingExpense) {
      await onEditExpense?.(editingExpense.id, payload);
    } else {
      await onAddExpense?.(payload);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2 rounded-lg bg-bg-sidebar p-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {t("expense.totalExpenses")}
          </div>
          <div className="mt-2 text-5xl font-bold text-text-primary">
            {fmt(summary.total || 0)}
          </div>
          <div className="mt-8 flex gap-8 border-t border-border-default pt-6">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{t("expense.fixedExpenses")}</div>
              <div className="mt-1 text-lg font-bold text-text-primary">{fmt(summary.fixed || 0)}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{t("expense.variableExpenses")}</div>
              <div className="mt-1 text-lg font-bold text-text-primary">{fmt(summary.variable || 0)}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{t("expense.unplannedExpenses")}</div>
              <div className="mt-1 text-lg font-bold text-text-primary">{fmt(summary.unplanned || 0)}</div>
            </div>
          </div>
        </div>

        <SectionCard className="p-6">
          <div className="text-sm font-bold text-text-primary">{t("expense.expenseAllocation")}</div>
          <div className="mt-5 space-y-4">
            {allocations.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-semibold text-text-secondary">
                  <span>{item.category}</span>
                  <span className="text-text-primary">{fmt(item.amount)}</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle">
                  <div
                    className={`h-full rounded-full ${idx === 0 ? "bg-primary" : idx === 1 ? "bg-orange-400" : idx === 2 ? "bg-emerald-400" : "bg-blue-400"}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard className="overflow-hidden">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-lg font-semibold text-text-primary">
            {t("expense.recentTransactions")}
          </h2>
          <div className="flex gap-3">
            <PrimaryButton onClick={handleOpenAdd}>
              <Plus className="mr-2 h-4 w-4" />
              {t("expense.addExpense")}
            </PrimaryButton>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-[#f8fafc]">
              <tr>
                <th className="px-6 py-4 font-semibold text-text-muted uppercase tracking-wider text-[10px]">{t("common.description")}</th>
                <th className="px-6 py-4 font-semibold text-text-muted uppercase tracking-wider text-[10px]">{t("common.category")}</th>
                <th className="px-6 py-4 text-right font-semibold text-text-muted uppercase tracking-wider text-[10px]">{t("common.amount")}</th>
                <th className="px-6 py-4 text-right font-semibold text-text-muted uppercase tracking-wider text-[10px]">{t("common.status")}</th>
                <th className="px-6 py-4 text-center font-semibold text-text-muted uppercase tracking-wider text-[10px]">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {paginatedTransactions.map((tx) => {
                const IconComp = iconMap[tx.icon] || Plus;
                return (
                  <tr key={tx.id} className="bg-white transition hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-subtle text-primary">
                          <IconComp className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-text-primary">{tx.title}</div>
                          <div className="text-[11px] text-text-muted">{tx.date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-600 border border-orange-100">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-text-primary">
                      -{fmt(Math.abs(tx.amount))}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-xs font-semibold">
                        <span className={`h-1.5 w-1.5 rounded-full ${tx.status === t("common.completed") ? "bg-emerald-500" : "bg-gray-400"}`} />
                        <span className={tx.status === t("common.completed") ? "text-emerald-700" : "text-gray-500"}>{tx.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(tx)}
                          className="rounded-sm p-2 text-text-muted transition hover:bg-blue-50 hover:text-blue-600"
                          title={t("common.edit")}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tx)}
                          className="rounded-sm p-2 text-text-muted transition hover:bg-red-50 hover:text-red-600"
                          title={t("common.delete")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedTransactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-text-secondary">
                    {t("common.noData", "Không có dữ liệu")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div className="p-4 border-t border-border-default">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </div>
      </SectionCard>

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => {
          setIsAddExpenseOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingExpense}
      />
    </div>
  );
}
