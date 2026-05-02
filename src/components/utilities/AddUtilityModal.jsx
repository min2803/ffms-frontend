import { useState, useEffect } from "react";
import { X, Zap, Droplets } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../contexts/AppContext";
import PrimaryButton from "../shared/PrimaryButton";
import DatePicker from "../ui/DatePicker";

/**
 * Add Utility Reading Modal — supports electricity (kWh) and water (m³).
 */
export default function AddUtilityModal({ isOpen, onClose, onSave, utilityType = "electricity" }) {
  const { t } = useTranslation();
  const { currency } = useAppContext();

  const [value, setValue] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal opens or type changes
  useEffect(() => {
    if (isOpen) {
      setValue("");
      setCost("");
      setError("");
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const d = String(now.getDate()).padStart(2, "0");
      setDate(`${y}-${m}-${d}`);
    }
  }, [isOpen, utilityType]);

  const isElectricity = utilityType === "electricity";
  const unitLabel = isElectricity ? "kWh" : "m³";
  const TypeIcon = isElectricity ? Zap : Droplets;
  const headerColor = isElectricity ? "bg-amber-500" : "bg-sky-500";
  const currencySymbol = currency === "VND" ? "₫" : "$";

  const handleSubmit = async () => {
    if (!value || parseFloat(value) <= 0) {
      setError(t("utilityModal.errorValue", "Vui lòng nhập số lượng hợp lệ"));
      return;
    }
    if (!cost || parseFloat(cost) <= 0) {
      setError(t("utilityModal.errorCost", "Vui lòng nhập số tiền hợp lệ"));
      return;
    }
    if (!date) {
      setError(t("utilityModal.errorDate", "Vui lòng chọn ngày"));
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await onSave({
        type: utilityType,
        value: parseFloat(value),
        cost: parseFloat(cost),
        date,
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || t("utilityModal.saveFailed", "Lưu thất bại"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111c2d]/50 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-md rounded-lg bg-white shadow-2xl overflow-visible flex flex-col"
        style={{ animation: "fadeIn 0.2s ease-out" }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between ${headerColor} px-6 py-4 text-white rounded-t-lg`}>
          <div className="flex items-center gap-2.5">
            <TypeIcon className="h-5 w-5" />
            <h2 className="text-base font-semibold">
              {isElectricity
                ? t("utilityModal.titleElectricity", "Thêm Chỉ Số Điện")
                : t("utilityModal.titleWater", "Thêm Chỉ Số Nước")}
            </h2>
          </div>
          <button onClick={onClose} disabled={submitting} className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Value (kWh / m³) */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-text-secondary">
              {isElectricity
                ? t("utilityModal.labelKwh", "Số kWh")
                : t("utilityModal.labelM3", "Số m³")}
            </label>
            <div className="flex items-center rounded-lg bg-bg-subtle px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-primary/20">
              <span className="mr-2 text-sm font-semibold text-text-muted">{unitLabel}</span>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full bg-transparent text-sm font-medium text-text-primary placeholder-text-muted focus:outline-none"
                placeholder={isElectricity ? "VD: 150" : "VD: 12.5"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          </div>

          {/* Cost */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-text-secondary">
              {t("utilityModal.labelCost", "Số tiền")}
            </label>
            <div className="flex items-center rounded-lg bg-bg-subtle px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-primary/20">
              <span className="mr-2 text-sm font-semibold text-text-muted">{currencySymbol}</span>
              <input
                type="number"
                min="0"
                step="1"
                className="w-full bg-transparent text-sm font-medium text-text-primary placeholder-text-muted focus:outline-none"
                placeholder="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-text-secondary">
              {t("utilityModal.labelDate", "Ngày ghi nhận")}
            </label>
            <DatePicker value={date} onChange={setDate} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-border-default px-6 py-4">
          <PrimaryButton onClick={handleSubmit} disabled={submitting}>
            {submitting
              ? t("common.loading", "Đang lưu...")
              : t("utilityModal.save", "Lưu Chỉ Số")}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
