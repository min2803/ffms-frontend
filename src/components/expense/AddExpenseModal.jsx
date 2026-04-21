import { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Calendar } from "lucide-react";
import PrimaryButton from "../shared/PrimaryButton";

export default function AddExpenseModal({ isOpen, onClose }) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const categoryRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const categories = [
    { value: "housing", label: "Housing & Rent" },
    { value: "groceries", label: "Groceries" },
    { value: "transport", label: "Transport" },
    { value: "utilities", label: "Utilities" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111c2d]/50 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-md rounded-[var(--radius-lg)] bg-white shadow-2xl overflow-hidden flex flex-col"
        style={{ animation: "fadeIn 0.2s ease-out" }}
      >
        {/* Header (Blue Background) */}
        <div className="flex items-center justify-between bg-[var(--color-primary)] px-6 py-4 text-white">
          <h2 className="text-base font-semibold">New Expense</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="p-6 space-y-5">
          {/* Transaction Amount */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Transaction Amount</label>
            <div className="flex items-center rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
              <span className="mr-2 text-sm font-bold text-[var(--color-text-primary)]">$</span>
              <input
                type="text"
                className="w-full bg-transparent text-sm font-medium text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Expense Category */}
          <div className="relative" ref={categoryRef}>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
              Expense Category
            </label>
            <div 
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex cursor-pointer select-none items-center justify-between rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-3.5 py-3 transition-colors hover:bg-[#e6edfa]"
            >
              <span className={`text-sm font-medium ${selectedCategory ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}`}>
                {selectedCategory ? categories.find(c => c.value === selectedCategory)?.label : "Select a category"}
              </span>
              <ChevronDown className={`h-4 w-4 text-[var(--color-text-muted)] transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
            </div>

            {/* Custom Dropdown Menu */}
            {isCategoryOpen && (
              <div className="absolute top-[100%] left-0 right-0 z-10 mt-2 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-white shadow-lg animate-in fade-in slide-in-from-top-2">
                <div className="max-h-60 overflow-y-auto py-1">
                  {categories.map((cat) => (
                    <div
                      key={cat.value}
                      onClick={() => {
                        setSelectedCategory(cat.value);
                        setIsCategoryOpen(false);
                      }}
                      className={`cursor-pointer px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--color-bg-subtle)] ${
                        selectedCategory === cat.value
                          ? "bg-[#f0f4ff] text-[var(--color-primary)]"
                          : "text-[var(--color-text-primary)]"
                      }`}
                    >
                      {cat.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Transaction Date */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Transaction Date</label>
            <div className="flex items-center justify-between rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
              <input
                type="text"
                className="w-full bg-transparent text-sm font-medium text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none"
                placeholder="mm/dd/yyyy"
              />
              <Calendar className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Optional Note</label>
            <div className="flex rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
              <textarea
                className="w-full bg-transparent text-sm font-medium text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none resize-none"
                placeholder="What was this for?"
                rows="2"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="rounded-[var(--radius-sm)] px-4 py-2 text-sm font-bold text-[var(--color-text-primary)] transition hover:bg-gray-100"
          >
            Cancel
          </button>
          <PrimaryButton onClick={onClose} className="px-6">
            Save Expense
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
