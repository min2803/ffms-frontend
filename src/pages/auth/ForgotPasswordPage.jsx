import { useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import authService from "../../services/modules/authService";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim();
    if (!trimmed) { setError(t("auth.pleaseEnterEmail")); return; }

    setLoading(true);
    try {
      const res = await authService.forgotPassword(trimmed);
      const data = res?.data ?? res;
      if (data?.resetToken) setResetToken(data.resetToken);
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || t("auth.somethingWentWrong"));
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (!resetToken.trim()) { setError(t("auth.pleaseEnterResetToken")); return; }
    if (newPassword.length < 8) { setError(t("auth.passwordMinLength")); return; }
    if (newPassword !== confirmPassword) { setError(t("auth.passwordsDoNotMatch")); return; }

    setLoading(true);
    try {
      await authService.resetPassword(resetToken.trim(), newPassword);
      setSuccess(t("auth.resetSuccess"));
      setStep(3);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || t("auth.somethingWentWrong"));
    } finally { setLoading(false); }
  };

  return (
    <div className="relative min-h-screen bg-bg-subtle">
      <main className="flex min-h-[calc(100vh-60px)] items-center justify-center p-6">
        <div className="w-full max-w-[480px]">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 grid h-12 w-12 place-content-center rounded-sm bg-gradient-to-br from-primary to-primary-2 shadow-button-sm">
              <span className="text-text-inverse">A</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              {step === 3 ? t("auth.allDone") : t("auth.resetPassword")}
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              {step === 1 && t("auth.enterEmailToReset")}
              {step === 2 && t("auth.enterTokenAndPassword")}
              {step === 3 && t("auth.passwordUpdated")}
            </p>
          </div>

          <div className="rounded-sm bg-bg-surface p-8 shadow-card">
            {error && (
              <div className="mb-4 flex items-center gap-2 text-xs font-medium text-state-error">
                <AlertCircle size={12} /><span>{error}</span>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleRequestReset} className="space-y-6">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-text-secondary">{t("auth.emailAddress")}</label>
                  <input type="email" placeholder={t("auth.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}
                    className="mt-1.5 w-full rounded-xs border border-transparent border-b-2 bg-bg-subtle px-4 py-3.5 text-base text-text-primary placeholder:text-input-placeholder outline-none disabled:opacity-50" />
                </div>
                <button type="submit" disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-gradient-to-br from-primary to-primary-2 py-4 text-base font-bold text-text-inverse shadow-button-sm disabled:opacity-50">
                  {loading ? t("auth.sending") : t("auth.getResetToken")}
                  {!loading && <ArrowRight size={14} />}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-text-secondary">{t("auth.resetToken")}</label>
                  <input type="text" placeholder={t("auth.pasteResetToken")} value={resetToken} onChange={(e) => setResetToken(e.target.value)} disabled={loading}
                    className="mt-1.5 w-full rounded-xs border border-transparent border-b-2 bg-bg-subtle px-4 py-3.5 text-sm text-text-primary placeholder:text-input-placeholder outline-none disabled:opacity-50 font-mono" />
                  <p className="mt-1 text-[10px] text-text-muted">{t("auth.tokenExpiresNote")}</p>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-text-secondary">{t("auth.newPassword")}</label>
                  <input type="password" placeholder={t("auth.passwordPlaceholder")} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={loading}
                    className="mt-1.5 w-full rounded-xs border border-transparent border-b-2 bg-bg-subtle px-4 py-3.5 text-base text-text-primary placeholder:text-input-placeholder outline-none disabled:opacity-50" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-text-secondary">{t("auth.confirmPassword")}</label>
                  <input type="password" placeholder={t("auth.passwordPlaceholder")} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading}
                    className="mt-1.5 w-full rounded-xs border border-transparent border-b-2 bg-bg-subtle px-4 py-3.5 text-base text-text-primary placeholder:text-input-placeholder outline-none disabled:opacity-50" />
                </div>
                <button type="submit" disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-gradient-to-br from-primary to-primary-2 py-4 text-base font-bold text-text-inverse shadow-button-sm disabled:opacity-50">
                  {loading ? t("auth.resetting") : t("auth.resetPasswordBtn")}
                  {!loading && <ArrowRight size={14} />}
                </button>
              </form>
            )}

            {step === 3 && (
              <div className="space-y-6 text-center">
                <div className="flex justify-center"><CheckCircle size={48} className="text-emerald-500" /></div>
                <p className="text-sm text-text-secondary">{success}</p>
                <Link to="/login"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-gradient-to-br from-primary to-primary-2 py-4 text-base font-bold text-text-inverse shadow-button-sm">
                  {t("auth.goToLogin")}<ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>

          {step !== 3 && (
            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                <ArrowLeft size={14} />{t("auth.backToLogin")}
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
