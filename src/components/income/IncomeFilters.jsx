import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Filter, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function IncomeFilters({ categories = [], onFilterChange }) {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState("30");
  const [category, setCategory] = useState("all");
  const [dateOpen, setDateOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const dateRef = useRef(null);
  const categoryRef = useRef(null);

  const DATE_RANGES = [
    { value: "30", label: t("incomeFilters.last30Days") },
    { value: "60", label: t("incomeFilters.last60Days") },
    { value: "90", label: t("incomeFilters.last90Days") },
    { value: "all", label: t("incomeFilters.allTime") },
  ];

  useEffect(() => {
    function handleClick(e) {
      if (dateRef.current && !dateRef.current.contains(e.target)) setDateOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleReset = () => {
    setDateRange("30");
    setCategory("all");
    onFilterChange?.({ dateRange: "30", category: "all" });
  };

  const dateLabel = DATE_RANGES.find((d) => d.value === dateRange)?.label || t("incomeFilters.last30Days");
  const categoryLabel = category === "all" ? t("incomeFilters.allCategories", "Tất cả danh mục") : category;
  const categoryOptions = [{ value: "all", label: t("incomeFilters.allCategories", "Tất cả danh mục") }, ...categories.map((c) => ({ value: c, label: c }))];

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <div className="rounded-md bg-bg-subtle p-6">
        <label className="mb-3 block text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {t("incomeFilters.dateRange")}
        </label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1" ref={dateRef}>
            <div
              onClick={() => setDateOpen(!dateOpen)}
              className="flex h-10 cursor-pointer items-center justify-between rounded-sm bg-white px-4 text-sm font-medium text-text-primary shadow-sm transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-text-muted" />
                <span>{dateLabel}</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-text-muted transition-transform ${dateOpen ? "rotate-180" : ""}`} />
            </div>
            {dateOpen && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-sm border border-border-default bg-white shadow-lg">
                {DATE_RANGES.map((d) => (
                  <div
                    key={d.value}
                    onClick={() => { setDateRange(d.value); setDateOpen(false); onFilterChange?.({ dateRange: d.value, category }); }}
                    className={`cursor-pointer px-4 py-2.5 text-sm font-medium hover:bg-bg-subtle ${dateRange === d.value ? "text-primary" : "text-text-primary"}`}
                  >
                    {d.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleReset} className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#e2e8f0] text-text-secondary transition hover:bg-[#cbd5e1]">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-md bg-bg-subtle p-6">
        <label className="mb-3 block text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {t("incomeFilters.category", "Danh mục")}
        </label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1" ref={categoryRef}>
            <div
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="flex h-10 cursor-pointer items-center justify-between rounded-sm bg-white px-4 text-sm font-medium text-text-primary shadow-sm transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-2.5">
                <Filter className="h-4 w-4 text-text-muted" />
                <span>{categoryLabel}</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-text-muted transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
            </div>
            {categoryOpen && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-sm border border-border-default bg-white shadow-lg">
                {categoryOptions.map((c) => (
                  <div
                    key={c.value}
                    onClick={() => { setCategory(c.value); setCategoryOpen(false); onFilterChange?.({ dateRange, category: c.value }); }}
                    className={`cursor-pointer px-4 py-2.5 text-sm font-medium hover:bg-bg-subtle ${category === c.value ? "text-primary" : "text-text-primary"}`}
                  >
                    {c.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleReset} className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#e2e8f0] text-text-secondary transition hover:bg-[#cbd5e1]">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
