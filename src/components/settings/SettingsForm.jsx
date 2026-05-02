import { useState, useEffect } from "react";
import { User, Shield, Lock, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { genderOptions as defaultGenderOptions } from "../../data/settingsData";
import { SectionCard } from "../shared";
import PrimaryButton from "../shared/PrimaryButton";
import ChangePasswordModal from "./ChangePasswordModal";
import SettingsSectionHeading from "./SettingsSectionHeading";
import { SettingsTextField, SettingsSelectField } from "./SettingsFormFields";

export default function SettingsForm({ initialData, genderOptions = defaultGenderOptions, onSave }) {
  const { t } = useTranslation();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", dob: "", gender: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Sync form with initialData when it changes (e.g. after getMe refreshes)
  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
    }
  }, [initialData?.fullName, initialData?.phone, initialData?.dob, initialData?.gender]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleDiscard = () => {
    if (initialData) setForm({ ...initialData });
    setErrors({});
  };

  const validatePhone = (phone) => {
    const normalized = phone.replace(/[^\d+]/g, "");
    return /^\+?\d{10,15}$/.test(normalized);
  };

  const validateDob = (dob) => {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dob.trim());
    if (!match) return false;

    const month = Number(match[1]);
    const day = Number(match[2]);
    const year = Number(match[3]);
    const date = new Date(year, month - 1, day);
    const isValidDate =
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day;

    return isValidDate && date <= new Date();
  };

  const validatePersonalInfo = () => {
    const nextErrors = {};

    if (!form.fullName || form.fullName.trim().length === 0) {
      nextErrors.fullName = t("settings.errorFullName", "Họ tên không được để trống.");
    }

    if (form.phone && !validatePhone(form.phone)) {
      nextErrors.phone = t("settings.errorPhone", "Số điện thoại không hợp lệ.");
    }

    if (form.dob && !validateDob(form.dob)) {
      nextErrors.dob = t("settings.errorDob", "Ngày sinh không hợp lệ (MM/DD/YYYY).");
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validatePersonalInfo()) return;
    setSaving(true);
    try {
      if (onSave) {
        await onSave(form);
      }
    } catch {
      // Toast is handled by parent
    } finally {
      setSaving(false);
    }
  };

  // Localized gender options
  const localizedGenderOptions = [
    { value: "", label: t("settings.selectGender", "-- Chọn --") },
    { value: "male", label: t("settings.male") },
    { value: "female", label: t("settings.female") },
    { value: "other", label: t("settings.other") },
  ];

  return (
    <div className="space-y-8">
      <section>
        <SettingsSectionHeading icon={User} title={t("settings.personalInfo")} />
        <div className="rounded-sm bg-bg-subtle p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <SettingsTextField
              id="settings-full-name"
              label={t("settings.fullName")}
              value={form.fullName || ""}
              onChange={handleChange("fullName")}
              autoComplete="name"
              error={errors.fullName}
            />
            <SettingsSelectField
              id="settings-gender"
              label={t("settings.gender")}
              value={form.gender}
              onChange={handleChange("gender")}
              error={errors.gender}
            >
              {localizedGenderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </SettingsSelectField>
            <SettingsTextField
              id="settings-phone"
              label={t("settings.phone")}
              value={form.phone}
              onChange={handleChange("phone")}
              autoComplete="tel"
              error={errors.phone}
            />
            <SettingsTextField
              id="settings-dob"
              label={t("settings.dateOfBirth")}
              value={form.dob}
              onChange={handleChange("dob")}
              placeholder="MM/DD/YYYY"
              autoComplete="bday"
              error={errors.dob}
            />
          </div>
        </div>
      </section>

      <section>
        <SettingsSectionHeading icon={Shield} title={t("settings.securityAccess")} />
        <SectionCard className="overflow-hidden shadow-soft">
          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-bg-subtle/60"
          >
            <span className="flex items-center gap-4">
              <span className="grid h-10 w-10 shrink-0 place-content-center rounded-full bg-bg-tint-soft text-primary">
                <Lock className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-base font-semibold text-text-primary">
                  {t("settings.changePassword")}
                </span>
                <span className="mt-0.5 block text-sm text-text-secondary">
                  {t("settings.changePasswordDesc", "Cập nhật mật khẩu thường xuyên để bảo mật")}
                </span>
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-text-muted" />
          </button>
        </SectionCard>
      </section>

      <div className="flex flex-col-reverse items-stretch justify-end gap-4 border-t border-border-light pt-8 sm:flex-row">
        <button
          type="button"
          onClick={handleDiscard}
          disabled={saving}
          className="rounded-sm bg-bg-badge px-8 py-3 text-base font-semibold text-text-primary transition hover:opacity-90"
        >
          {t("settings.discard", "Hủy")}
        </button>
        <PrimaryButton type="button" onClick={handleSaveChanges} disabled={saving} className="px-8 py-3 text-base">
          {saving ? t("common.loading", "Đang lưu...") : t("settings.saveChanges", "Lưu thay đổi")}
        </PrimaryButton>
      </div>

      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </div>
  );
}
