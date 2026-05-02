import { useState, useEffect } from "react";
import { Filter as FilterIcon, Plus, Lightbulb, Clapperboard, Utensils, ShoppingCart, User as UserIcon, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionCard from "../shared/SectionCard";
import PrimaryButton from "../shared/PrimaryButton";
import AddExpenseModal from "./AddExpenseModal";
import { useAppContext } from "../../contexts/AppContext";
import { formatCurrency } from "../../utils/formatCurrency";
import Pagination from "../ui/Pagination";

const iconMap = { Lightbulb, Clapperboard, Utensils, ShoppingCart };

/**
 * @param {Object}   expenseData     – { summary, members, categories, transactions }
 * @param {Function} onAddExpense    – (payload) => Promise
 * @param {Function} onEditExpense   – (id, payload) => Promise
 * @param {Function} onDeleteExpense – (id) => Promise
 */
export default function FamilyExpenseView({ expenseData = {}, onAddExpense, onEditExpense, onDeleteExpense }) {
  const { t } = useTranslation();
  const { currency, language } = useAppContext();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const { summary = {}, members = [], categories = [], transactions = [] } = expenseData;

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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-[#f8fafc] p-8 border border-gray-100 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
            {t("expense.totalExpenses")}
          </div>
          <div className="mt-2 text-5xl font-bold text-text-primary">
            {fmt(summary.total || 0)}
          </div>
          <div className="mt-8 flex gap-12">
            {summary.sharedBudget != null && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted">{t("expense.sharedBudget")}</div>
                <div className="mt-1 text-xl font-bold text-primary border-b-2 border-primary pb-1 inline-block">
                  {fmt(summary.sharedBudget)}
                </div>
              </div>
            )}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted">{t("expense.dailyAverage")}</div>
              <div className="mt-1 text-xl font-bold text-text-primary pb-1 inline-block">
                {fmt(summary.dailyAverage)}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-[#f0f4f8] p-8">
          <div className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">{t("expense.memberContribution")}</div>
          <div className="mt-6 flex flex-col gap-5">
            {members.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#e2e8f0] border border-white flex items-center justify-center text-gray-400">
                    {m.avatar ? <img src={m.avatar} alt={m.name} className="h-full w-full object-cover" /> : <UserIcon className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text-primary">
                      {m.name} {m.role && <span className="text-[10px] text-text-muted font-normal ml-1">({m.role})</span>}
                    </div>
                    <div className="text-[11px] text-text-muted">{m.percent}% {t("common.total").toLowerCase()}</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-text-primary">
                  {fmt(m.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-y border-border-default py-4">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-1.5 text-xs font-bold text-primary">
            <FilterIcon className="h-3.5 w-3.5" />
            {t("common.category")}: {t("common.all")}
          </button>
          <button className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-primary transition">
            <UserIcon className="h-3.5 w-3.5" />
            {t("household.members")}: {t("common.all")}
          </button>
        </div>
        <PrimaryButton onClick={handleOpenAdd}>
          <Plus className="mr-2 h-4 w-4" />
          {t("expense.addExpense")}
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <SectionCard className="lg:col-span-4 p-6 bg-[#f4f7fb] border-none shadow-none">
          <h3 className="text-base font-bold text-text-primary">{t("expense.categoryBreakdown")}</h3>
          <div className="mt-6 flex flex-col gap-6">
            {categories.map((c, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className={`block h-2 w-2 rounded-full ${c.color.replace("bg-", "bg-")}`} />
                    <span className="text-text-primary">{c.name}</span>
                  </div>
                  <span className="text-text-primary">{c.percent}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-[#e2e8f0] overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${c.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="lg:col-span-8 p-6 shadow-sm border-border-default flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-text-primary">{t("expense.familyTransactions")}</h3>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            {paginatedTransactions.map((tx) => {
              const IconComp = iconMap[tx.icon] || ShoppingCart;
              const isPending = tx.status.includes("PENDING");

              return (
                <div key={tx.id} className="flex items-center justify-between rounded-sm p-3 hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-sm ${isPending ? "bg-orange-50 text-orange-500" : "bg-[#f0f4fa] text-primary"}`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text-primary">{tx.title}</div>
                      <div className="text-xs text-text-muted mt-0.5">{tx.subtitle}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right w-24">
                      <div className="text-sm font-bold text-text-primary">
                        -{fmt(Math.abs(tx.amount))}
                      </div>
                      <div className="mt-1">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                          isPending ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>

                    {/* Edit/Delete buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(tx)}
                        className="rounded-sm p-2 text-text-muted transition hover:bg-blue-50 hover:text-blue-600"
                        title={t("common.edit")}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tx)}
                        className="rounded-sm p-2 text-text-muted transition hover:bg-red-50 hover:text-red-600"
                        title={t("common.delete")}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {paginatedTransactions.length === 0 && (
              <div className="py-8 text-center text-sm text-text-secondary">
                {t("common.noData", "Không có dữ liệu")}
              </div>
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-auto pt-4">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </SectionCard>
      </div>

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
