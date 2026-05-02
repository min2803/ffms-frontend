import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../contexts/AppContext";
import { formatCurrency } from "../../utils/formatCurrency";
import Pagination from "../ui/Pagination";

export default function RecentActivity({ activities = [] }) {
  const { t } = useTranslation();
  const { currency, language } = useAppContext();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [activities.length]);

  const totalPages = Math.ceil(activities.length / itemsPerPage) || 1;
  const paginatedActivities = activities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <article className="rounded-md border border-border-default bg-bg-surface p-5 shadow-soft flex flex-col h-full">
      <div className="mb-4">
        <p className="text-lg font-bold text-text-primary">{t("dashboard.recentActivity")}</p>
      </div>
      <div className="space-y-2.5 flex-1">
        {paginatedActivities.map((item) => (
          <div
            key={`${item.id || item.name}-${item.time}`}
            className="flex items-center justify-between rounded-sm bg-bg-subtle px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-text-primary">{item.name}</p>
              <p className="text-xs text-text-soft">
                {item.category} • {item.time}
              </p>
            </div>
            <p
              className={`text-sm font-bold ${
                item.amount > 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {item.amount > 0 ? "+" : "-"}{formatCurrency(Math.abs(item.amount), currency, language)}
            </p>
          </div>
        ))}
        {paginatedActivities.length === 0 && (
          <div className="py-8 text-center text-sm text-text-secondary">
            {t("common.noData", "Không có dữ liệu")}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 pt-4 border-t border-border-default">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </article>
  );
}
