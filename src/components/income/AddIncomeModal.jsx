import { useState, useEffect, useRef } from "react";
import { X, Briefcase, Shapes, ChevronDown } from "lucide-react";
import DatePicker from "../ui/DatePicker";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../contexts/AppContext";
import PrimaryButton from "../shared/PrimaryButton";
import categoryService from "../../services/modules/categoryService";

/**
 * Income Modal – supports both Create and Update.
 *
 * @param {boolean}  isOpen       – controls visibility
 * @param {Function} onClose      – called to close the modal
 * @param {Function} onSave       – (payload) => Promise  — create or update
 * @param {Object|null} initialData – null = create mode, object = edit mode
 *   initialData shape: { id, amount, source, income_date, description }
 */
export default function AddIncomeModal({ isOpen, onClose, onSave, initialData = null }) {
  const { t } = useTranslation();
  const { currency } = useAppContext();

  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const categoryRef = useRef(null);

  const isEditMode = Boolean(initialData);

  // Fetch categories
  useEffect(() => {
    if (isOpen) {
      categoryService.getCategories({ type: "income" })
        .then((res) => {
          const arr = Array.isArray(res) ? res : (res?.data || []);
          setCategories(arr);
          // Default select the first one if empty and we are creating
          if (!initialData?.category_id && arr.length > 0) {
            setCategoryId(arr[0].id);
          }
        })
        .catch((err) => console.error("Failed to fetch income categories", err));
    }
  }, [isOpen, initialData]);

  // Click outside to close category dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset / populate form whenever modal opens or initialData changes
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setAmount(String(initialData.amount ?? ""));
      setSource(initialData.source ?? "");
      // Normalize date: could be ISO string or "YYYY-MM-DD"
      const rawDate = initialData.income_date || initialData.incomeDate || "";
      setDate(rawDate ? new Date(rawDate).toISOString().split("T")[0] : "");
      setCategoryId(initialData.category_id || "");
    } else {
      setAmount("");
      setSource("");
      setDate(new Date().toISOString().split("T")[0]);
      // categoryId will be set by the fetch categories effect if available
    }
    setError("");
    setSubmitting(false);
    setIsCategoryOpen(false);
  }, [isOpen, initialData]);

  const validate = () => {
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError(t("incomeModal.validAmountError"));
      return false;
    }
    if (!source || source.trim().length === 0) {
      setError(t("incomeModal.sourceRequired"));
      return false;
    }
    if (!date) {
      setError(t("incomeModal.dateRequired"));
      return false;
    }
    // Check date is a valid date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      setError(t("incomeModal.dateRequired"));
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setError("");
    setSubmitting(true);

    try {
      await onSave({
        amount: parseFloat(amount),
        source: source.trim(),
        incomeDate: date,
        categoryId: categoryId || null,
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || t("incomeModal.saveFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currencySymbol = currency === "VND" ? "₫" : "$";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111c2d]/40 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl overflow-visible"
        style={{ animation: "fadeIn 0.2s ease-out" }}
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              {isEditMode ? t("incomeModal.editTitle") : t("incomeModal.title")}
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {isEditMode ? t("incomeModal.editSubtitle") : t("incomeModal.subtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Error banner */}
          {error && (
            <div className="rounded-sm bg-red-50 border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Amount */}
          <div className="rounded-md bg-bg-subtle shadow-sm border-b-2 border-primary">
            <div className="p-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("incomeModal.amount")}</label>
              <div className="mt-1 flex items-baseline text-text-primary">
                <span className="text-2xl font-bold text-primary">{currencySymbol}</span>
                <input
                  type="number"
                  className="w-full bg-transparent text-4xl font-bold text-text-primary placeholder-text-primary focus:outline-none ml-2"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="1000"
                />
              </div>
            </div>
          </div>

          {/* Income Source */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("incomeModal.incomeSource")}</label>
            <div className="flex items-center rounded-lg bg-bg-subtle px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-primary/20">
              <Briefcase className="mr-2.5 h-4 w-4 text-text-muted" />
              <input
                type="text"
                className="w-full bg-transparent text-sm font-medium text-text-primary placeholder-text-muted focus:outline-none"
                placeholder={t("incomeModal.sourcePlaceholder")}
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>
          </div>

          {/* Date + Category row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("incomeModal.date")}</label>
              <DatePicker value={date} onChange={setDate} />
            </div>

            <div className="relative" ref={categoryRef}>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("incomeModal.category")}</label>
              <div
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex cursor-pointer select-none items-center rounded-lg bg-bg-subtle px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-primary/20 hover:bg-[#e6edfa]"
              >
                <Shapes className="mr-2.5 h-4 w-4 text-text-muted shrink-0" />
                <span className={`flex-1 text-sm font-medium truncate ${categoryId ? "text-text-primary" : "text-text-muted"}`}>
                  {categoryId ? categories.find(c => String(c.id) === String(categoryId))?.name : t("incomeModal.categoryPlaceholder", "Select a category")}
                </span>
                <ChevronDown className={`h-4 w-4 text-text-muted shrink-0 transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
              </div>

              {isCategoryOpen && (
                <div className="absolute top-[100%] left-0 right-0 z-10 mt-2 overflow-hidden rounded-sm border border-border-default bg-white shadow-lg animate-in fade-in slide-in-from-top-2">
                  <div className="max-h-60 overflow-y-auto py-1">
                    {categories.length === 0 ? (
                      <div className="px-4 py-2.5 text-sm text-text-muted">{t("expenseModal.noCategories")}</div>
                    ) : (
                      categories.map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => { setCategoryId(String(cat.id)); setIsCategoryOpen(false); }}
                          className={`cursor-pointer px-4 py-2.5 text-sm font-medium transition-colors hover:bg-bg-subtle ${
                            String(categoryId) === String(cat.id) ? "bg-[#f0f4ff] text-primary" : "text-text-primary"
                          }`}
                        >
                          {cat.name}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-sm px-4 py-2 text-sm font-bold text-text-primary transition hover:bg-gray-100"
          >
            {t("incomeModal.cancel")}
          </button>
          <PrimaryButton onClick={handleSubmit} disabled={submitting} className="px-6">
            {submitting
              ? t("incomeModal.saving")
              : isEditMode
                ? t("incomeModal.updateTransaction")
                : t("incomeModal.saveTransaction")}
          </PrimaryButton>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
