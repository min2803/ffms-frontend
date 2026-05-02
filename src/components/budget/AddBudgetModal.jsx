import { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Calendar, BellRing } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../contexts/AppContext";
import PrimaryButton from "../shared/PrimaryButton";
import { getCurrentMonthYear } from "../../utils/dateTime";
import categoryService from "../../services/modules/categoryService";

export default function AddBudgetModal({ isOpen, onClose, onSave }) {
  const { t } = useTranslation();
  const { currency, language } = useAppContext();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const categoryRef = useRef(null);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState("");
  const alertRef = useRef(null);

  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    categoryService.getCategories().then((res) => {
      const data = res?.data ?? res;
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setCategories(list.map((c) => ({ value: String(c.id), label: c.name })));
    }).catch(() => {});
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) setIsCategoryOpen(false);
      if (alertRef.current && !alertRef.current.contains(event.target)) setIsAlertOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = () => {
    if (!selectedCategory || !amount) return;
    if (onSave) onSave({ category: selectedCategory, amount: parseFloat(amount), alertThreshold: selectedAlert, period });
    setSelectedCategory("");
    setAmount("");
    setSelectedAlert("");
    setPeriod("");
    onClose();
  };

  if (!isOpen) return null;
  const currentMonthYear = getCurrentMonthYear(language === "vi" ? "vi-VN" : "en-US");
  const currencySymbol = currency === "VND" ? "₫" : "$";

  const alerts = [
    { value: "80", label: t("budgetModal.budgetOf80") },
    { value: "90", label: t("budgetModal.budgetOf90") },
    { value: "100", label: t("budgetModal.budgetOf100") },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111c2d]/50 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between bg-primary px-6 py-4 text-white">
          <h2 className="text-base font-semibold">{t("budgetModal.title")}</h2>
          <button onClick={onClose} className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="relative" ref={categoryRef}>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-text-secondary">
              {t("budgetModal.budgetCategory")}
            </label>
            <div
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex cursor-pointer select-none items-center justify-between rounded-sm bg-bg-subtle px-3.5 py-3 transition-colors hover:bg-[#e6edfa]"
            >
              <span className={`text-sm font-medium ${selectedCategory ? "text-text-primary" : "text-text-muted"}`}>
                {selectedCategory ? categories.find(c => c.value === selectedCategory)?.label : t("budgetModal.selectCategory")}
              </span>
              <ChevronDown className={`h-4 w-4 text-text-muted transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
            </div>
            {isCategoryOpen && (
              <div className="absolute left-0 right-0 top-[100%] z-10 mt-2 overflow-hidden rounded-sm border border-border-default bg-white shadow-lg animate-in fade-in slide-in-from-top-2">
                <div className="max-h-60 overflow-y-auto py-1">
                  {categories.map((cat) => (
                    <div
                      key={cat.value}
                      onClick={() => { setSelectedCategory(cat.value); setIsCategoryOpen(false); }}
                      className={`cursor-pointer px-4 py-2.5 text-sm font-medium transition-colors hover:bg-bg-subtle ${
                        selectedCategory === cat.value ? "bg-[#f0f4ff] text-primary" : "text-text-primary"
                      }`}
                    >
                      {cat.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("budgetModal.monthlyLimit")}</label>
            <div className="flex items-center rounded-sm bg-bg-subtle px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-primary/20">
              <span className="mr-2 text-sm font-bold text-text-primary">{currencySymbol}</span>
              <input
                type="number"
                className="w-full bg-transparent text-sm font-medium text-text-primary placeholder-text-muted focus:outline-none"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative" ref={alertRef}>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                {t("budgetModal.alertThreshold")}
              </label>
              <div
                onClick={() => setIsAlertOpen(!isAlertOpen)}
                className="flex cursor-pointer select-none items-center justify-between rounded-sm bg-bg-subtle px-3.5 py-3 transition-colors hover:bg-[#e6edfa]"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <BellRing className="h-4 w-4 shrink-0 text-text-muted" />
                  <span className={`truncate text-sm font-medium ${selectedAlert ? "text-text-primary" : "text-text-muted"}`}>
                    {selectedAlert ? alerts.find(a => a.value === selectedAlert)?.label : t("budgetModal.target")}
                  </span>
                </div>
                <ChevronDown className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 ${isAlertOpen ? "rotate-180" : ""}`} />
              </div>
              {isAlertOpen && (
                <div className="absolute left-0 right-0 top-[100%] z-10 mt-2 overflow-hidden rounded-sm border border-border-default bg-white shadow-lg animate-in fade-in slide-in-from-top-2">
                  <div className="max-h-60 overflow-y-auto py-1">
                    {alerts.map((a) => (
                      <div
                        key={a.value}
                        onClick={() => { setSelectedAlert(a.value); setIsAlertOpen(false); }}
                        className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors hover:bg-bg-subtle ${
                          selectedAlert === a.value ? "bg-[#f0f4ff] text-primary" : "text-text-primary"
                        }`}
                      >
                        {a.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("budgetModal.budgetPeriod")}</label>
              <div className="flex items-center justify-between rounded-sm bg-bg-subtle px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-primary/20">
                <input
                  type="text"
                  className="w-full bg-transparent text-sm font-medium text-text-primary placeholder-text-muted focus:outline-none"
                  placeholder={currentMonthYear}
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                />
                <Calendar className="h-4 w-4 shrink-0 text-text-muted" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-2">
          <button onClick={onClose} className="rounded-sm px-4 py-2 text-sm font-bold text-text-primary transition hover:bg-gray-100">
            {t("budgetModal.cancel")}
          </button>
          <PrimaryButton onClick={handleSubmit} className="px-6">
            {t("budgetModal.saveBudget")}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
