import { useState, useEffect } from "react";
import { Plus, Banknote, Building2, Building, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionCard from "../shared/SectionCard";
import PrimaryButton from "../shared/PrimaryButton";
import Pagination from "../ui/Pagination";

const iconMap = { Banknote, Building2, Building };

function StatusBadge({ status }) {
  const isCompleted = status === "COMPLETED";
  const bgClass = isCompleted ? "bg-[#dcfce7]" : "bg-[#e2e8f0]";
  const textClass = isCompleted ? "text-[#166534]" : "text-text-secondary";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${bgClass} ${textClass}`}>
      {status}
    </span>
  );
}

/**
 * @param {Function} onAddClick  – open Add modal
 * @param {Function} onEdit      – (income) => open Edit modal
 * @param {Function} onDelete    – (incomeId) => delete income
 * @param {Array}    transactions – formatted income rows
 */
export default function IncomeHistory({ onAddClick, onEdit, onDelete, transactions: incomeTransactions = [] }) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [incomeTransactions.length]);

  const totalPages = Math.ceil(incomeTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = incomeTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = (tx) => {
    if (window.confirm(t("incomePage.confirmDelete"))) {
      onDelete?.(tx.id);
    }
  };

  return (
    <SectionCard className="overflow-hidden">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("incomePage.transactionHistory")}
        </h2>
        <PrimaryButton onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          {t("incomePage.addIncome")}
        </PrimaryButton>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-bg-sidebar">
            <tr>
              <th className="px-6 py-4 font-semibold text-text-secondary uppercase tracking-wider text-xs">{t("incomePage.source")}</th>
              <th className="px-6 py-4 font-semibold text-text-secondary uppercase tracking-wider text-xs">{t("incomePage.date")}</th>
              <th className="px-6 py-4 font-semibold text-text-secondary uppercase tracking-wider text-xs">{t("incomePage.status")}</th>
              <th className="px-6 py-4 font-semibold text-text-secondary uppercase tracking-wider text-xs text-right">{t("incomePage.amount")}</th>
              <th className="px-6 py-4 font-semibold text-text-secondary uppercase tracking-wider text-xs text-center">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default bg-white text-text-primary">
            {paginatedTransactions.map((tx) => {
              const IconComp = iconMap[tx.icon] || Banknote;
              return (
                <tr key={tx.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-bg-subtle text-primary">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold">{tx.sourceTitle}</div>
                        <div className="text-xs text-text-muted">{tx.sourceSubtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-text-secondary">{tx.date}</td>
                  <td className="px-6 py-4"><StatusBadge status={tx.status} /></td>
                  <td className="px-6 py-4 text-right font-bold">{tx.amount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit?.(tx)}
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
      </div>
      
      {totalPages > 1 && (
        <div className="p-4 border-t border-border-default">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </SectionCard>
  );
}
