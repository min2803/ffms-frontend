import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCurrentYear } from "../../utils/dateTime";
import useAuth from "../../hooks/useAuth";

function getPasswordScore(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

function RegisterPage() {
  const { t } = useTranslation();
  const currentYear = getCurrentYear();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { register, loading, error: authError } = useAuth();

  const passwordScore = useMemo(() => getPasswordScore(password), [password]);
  const strengthLabels = [t("auth.weak"), t("auth.weak"), t("auth.medium"), t("auth.strong"), t("auth.veryStrong")];
  const strengthLabel = strengthLabels[passwordScore] || t("auth.weak");
  const showPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (trimmedName.length < 2) nextErrors.fullName = t("auth.pleaseEnterFullName");
    if (!emailRegex.test(trimmedEmail)) nextErrors.email = t("auth.pleaseEnterValidEmail");
    if (password.length < 8) nextErrors.password = t("auth.passwordMinLength");
    if (password !== confirmPassword) nextErrors.confirmPassword = t("auth.passwordsDoNotMatch");

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      register({ name: trimmedName, email: trimmedEmail, password })
        .then(() => {
          navigate("/login", { state: { successMessage: t("auth.createdSuccess") } });
        })
        .catch((err) => {
          setFieldErrors({ api: err?.response?.data?.message || t("auth.registrationFailed") });
        });
    }
  };

  return (
    <div className="relative min-h-screen bg-bg-subtle">
      <main className="flex min-h-[calc(100vh-120px)] items-center justify-center p-6">
        <div className="w-full max-w-[480px]">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 grid h-12 w-12 place-content-center rounded-sm bg-gradient-to-br from-primary to-primary-2 shadow-button-sm">
              <span className="text-text-inverse">A</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-text-primary">{t("auth.createAccount")}</h1>
            <p className="mt-2 text-sm text-text-secondary">{t("auth.joinEcosystem")}</p>
          </div>

          <div className="rounded-sm bg-bg-surface p-8 shadow-card">
            <div className="rounded-xs bg-bg-subtle p-1">
              <div className="grid grid-cols-2 gap-1">
                <Link to="/login" className="rounded-[6px] py-2 text-center text-sm font-semibold text-text-muted">{t("auth.login")}</Link>
                <button className="rounded-[6px] bg-bg-surface py-2 text-sm font-semibold text-primary shadow-soft">{t("auth.register")}</button>
              </div>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-text-secondary">{t("auth.fullName")}</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t("auth.fullNamePlaceholder")}
                  className="mt-1.5 w-full rounded-xs border border-transparent border-b-2 bg-bg-subtle px-4 py-3.5 text-base text-text-primary placeholder:text-input-placeholder outline-none" />
                {fieldErrors.fullName && <p className="mt-1 text-xs text-state-error">{fieldErrors.fullName}</p>}
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-text-secondary">{t("auth.emailAddress")}</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("auth.emailPlaceholder")}
                  className="mt-1.5 w-full rounded-xs border border-transparent border-b-2 bg-bg-subtle px-4 py-3.5 text-base text-text-primary placeholder:text-input-placeholder outline-none" />
                {fieldErrors.email && <p className="mt-1 text-xs text-state-error">{fieldErrors.email}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-text-secondary">{t("auth.password")}</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password123"
                    className="mt-1.5 w-full rounded-xs border border-transparent border-b-2 bg-bg-subtle px-4 py-3 text-base text-text-primary outline-none" />
                  {fieldErrors.password && <p className="mt-1 text-xs text-state-error">{fieldErrors.password}</p>}
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-text-secondary">{t("auth.confirmPassword")}</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="password321"
                    className={`mt-1.5 w-full rounded-xs border border-transparent border-b-2 bg-bg-subtle px-4 py-3 text-base text-text-primary outline-none ${showPasswordMismatch || fieldErrors.confirmPassword ? "border-state-error" : ""}`} />
                </div>
              </div>

              {(showPasswordMismatch || fieldErrors.confirmPassword) && (
                <div className="flex items-center gap-2 text-xs font-medium text-state-error">
                  <AlertCircle size={12} /><span>{t("auth.passwordsDoNotMatch")}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase text-text-secondary">{t("auth.strength")}: {strengthLabel}</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((bar) => (
                    <span key={bar} className={`h-1 w-8 rounded-full ${bar <= passwordScore ? "bg-state-success" : "bg-input-placeholder"}`} />
                  ))}
                </div>
              </div>

              {fieldErrors.api && (
                <div className="flex items-center gap-2 text-xs font-medium text-state-error"><AlertCircle size={12} /><span>{fieldErrors.api}</span></div>
              )}
              {authError && (
                <div className="flex items-center gap-2 text-xs font-medium text-state-error"><AlertCircle size={12} /><span>{authError}</span></div>
              )}

              <button type="submit" disabled={loading}
                className="w-full rounded-sm bg-gradient-to-br from-primary to-primary-2 py-4 text-base font-bold text-text-inverse shadow-button-sm disabled:opacity-50">
                {loading ? t("auth.creatingAccount") : t("auth.createAccountBtn")}
              </button>
            </form>
          </div>

          <p className="mx-auto mt-6 max-w-[360px] text-center text-xs text-text-secondary">
            {t("auth.termsAgreementRegister")}{" "}
            <a href="#!" className="font-semibold text-primary">{t("auth.termsOfService")}</a>{" "}
            {t("auth.and")}{" "}
            <a href="#!" className="font-semibold text-primary">{t("auth.privacyPolicy")}</a>.
          </p>
        </div>
      </main>

      <footer className="border-t border-border-light bg-bg-footer py-12">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-12 text-[11px] font-semibold uppercase tracking-[0.55px] text-text-muted">
          <p>{t("auth.copyright", { year: currentYear })}</p>
          <div className="flex gap-8 opacity-80">
            <a href="#!">{t("auth.termsOfService")}</a>
            <a href="#!">{t("auth.privacyPolicy")}</a>
            <a href="#!">{t("auth.cookieSettings")}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default RegisterPage;
