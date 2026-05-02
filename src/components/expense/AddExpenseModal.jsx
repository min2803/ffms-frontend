import { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../contexts/AppContext";
import PrimaryButton from "../shared/PrimaryButton";
import categoryService from "../../services/modules/categoryService";
import DatePicker from "../ui/DatePicker";

/**
 * Expense Modal – supports both Create and Update.
 *
 * @param {boolean}  isOpen       – controls visibility
 * @param {Function} onClose      – called to close the modal
 * @param {Function} onSubmit     – (payload) => Promise  — create or update
 * @param {Object|null} initialData – null = create mode, object = edit mode
 *   initialData shape: { id, amount, category_id, expense_date, description }
 */
export default function AddExpenseModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const { t } = useTranslation();
  const { currency } = useAppContext();
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const categoryRef = useRef(null);

  const isEditMode = Boolean(initialData);

  // Fetch categories when modal opens (cache in state)
  useEffect(() => {
    if (!isOpen) return;
    categoryService
      .getCategories()
      .then((res) => {
        const list = Array.isArray(res) ? res : res?.data ?? [];
        setCategories(list.filter((c) => c.type?.toLowerCase() === "expense"));
      })
      .catch(() => setCategories([]));
  }, [isOpen]);

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

  // Reset / populate form when modal opens or initialData changes
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setAmount(String(initialData.amount ?? ""));
      setSelectedCategory(String(initialData.category_id ?? initialData.categoryId ?? ""));
      const rawDate = initialData.expense_date || initialData.expenseDate || "";
      setExpenseDate(rawDate ? new Date(rawDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
      setDescription(initialData.description ?? "");
    } else {
      setAmount("");
      setSelectedCategory("");
      setExpenseDate(new Date().toISOString().split("T")[0]);
      setDescription("");
    }
    setError("");
    setSubmitting(false);
    setIsCategoryOpen(false);
  }, [isOpen, initialData]);

  const validate = () => {
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError(t("expenseModal.validAmountError"));
      return false;
    }
    if (!selectedCategory) {
      setError(t("expenseModal.selectCategoryError"));
      return false;
    }
    // Check category exists in list
    const catExists = categories.some(c => String(c.id) === String(selectedCategory));
    if (!catExists) {
      setError(t("expenseModal.selectCategoryError"));
      return false;
    }
    if (!expenseDate) {
      setError(t("expenseModal.selectDateError"));
      return false;
    }
    // Check date is valid
    const parsedDate = new Date(expenseDate);
    if (isNaN(parsedDate.getTime())) {
      setError(t("expenseModal.selectDateError"));
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setError("");
    setSubmitting(true);

    try {
      await onSubmit({
        categoryId: parseInt(selectedCategory),
        amount: parseFloat(amount),
        description: description.trim() || null,
        expenseDate,
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || t("expenseModal.saveFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currencySymbol = currency === "VND" ? "₫" : "$";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111c2d]/50 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-md rounded-lg bg-white shadow-2xl overflow-hidden flex flex-col"
        style={{ animation: "fadeIn 0.2s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-primary px-6 py-4 text-white">
          <h2 className="text-base font-semibold">
            {isEditMode ? t("expenseModal.editTitle") : t("expenseModal.title")}
          </h2>
          <button onClick={onClose} disabled={submitting} className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Error banner */}
          {error && (
            <div className="rounded-sm bg-red-50 border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("expenseModal.transactionAmount")}</label>
            <div className="flex items-center rounded-sm bg-bg-subtle px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-primary/20">
              <span className="mr-2 text-sm font-bold text-text-primary">{currencySymbol}</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-text-primary placeholder-text-muted focus:outline-none"
                placeholder="0"
                min="0"
                step="1000"
              />
            </div>
          </div>

          {/* Category dropdown */}
          <div className="relative" ref={categoryRef}>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-text-secondary">
              {t("expenseModal.expenseCategory")}
            </label>
            <div
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex cursor-pointer select-none items-center justify-between rounded-sm bg-bg-subtle px-3.5 py-3 transition-colors hover:bg-[#e6edfa]"
            >
              <span className={`text-sm font-medium ${selectedCategory ? "text-text-primary" : "text-text-muted"}`}>
                {selectedCategory ? categories.find(c => String(c.id) === String(selectedCategory))?.name : t("expenseModal.selectCategory")}
              </span>
              <ChevronDown className={`h-4 w-4 text-text-muted transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
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
                        onClick={() => { setSelectedCategory(String(cat.id)); setIsCategoryOpen(false); }}
                        className={`cursor-pointer px-4 py-2.5 text-sm font-medium transition-colors hover:bg-bg-subtle ${
                          String(selectedCategory) === String(cat.id) ? "bg-[#f0f4ff] text-primary" : "text-text-primary"
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

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("expenseModal.transactionDate")}</label>
            <DatePicker value={expenseDate} onChange={setExpenseDate} />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("expenseModal.optionalNote")}</label>
            <div className="flex rounded-sm bg-bg-subtle px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-primary/20">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-text-primary placeholder-text-muted focus:outline-none resize-none"
                placeholder={t("expenseModal.notePlaceholder")}
                rows="2"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-2">
          <button onClick={onClose} disabled={submitting} className="rounded-sm px-4 py-2 text-sm font-bold text-text-primary transition hover:bg-gray-100">
            {t("expenseModal.cancel")}
          </button>
          <PrimaryButton onClick={handleSubmit} disabled={submitting} className="px-6">
            {submitting
              ? t("expenseModal.saving")
              : isEditMode
                ? t("expenseModal.updateExpense")
                : t("expenseModal.saveExpense")}
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
