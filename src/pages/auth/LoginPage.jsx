import { useState } from "react";
import { AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCurrentYear } from "../../utils/dateTime";
import useAuth from "../../hooks/useAuth";

function LoginPage() {
  const { t } = useTranslation();
  const currentYear = getCurrentYear();
  const location = useLocation();
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const successMessage = location.state?.successMessage ?? "";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !password) {
      setLoginError(t("auth.invalidCredentials"));
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setLoginError(t("auth.invalidCredentials"));
      return;
    }

    try {
      setLoginError("");
      const response = await login({ email: trimmedEmail, password });
      const role = response?.data?.user?.role_name || response?.data?.user?.role || response?.user?.role_name || response?.user?.role;
      if (role) localStorage.setItem("userRole", role);
      navigate(role === "admin" ? "/dashboard-admin" : "/dashboard");
    } catch (err) {
      setLoginError(err?.response?.data?.message || t("auth.invalidCredentials"));
    }
  };

  const displayError = loginError || authError;

  return (
    <div className="relative min-h-screen bg-bg-subtle">
      <main className="flex min-h-[calc(100vh-120px)] items-center justify-center p-6">
        <div className="w-full max-w-[480px]">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 grid h-12 w-12 place-content-center rounded-sm bg-gradient-to-br from-primary to-primary-2 shadow-button-sm">
              <span className="text-text-inverse">A</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-text-primary">{t("auth.welcomeBack")}</h1>
            <p className="mt-2 text-sm text-text-secondary">{t("auth.secureAccess")}</p>
          </div>

          <div className="rounded-sm bg-bg-surface p-8 shadow-card">
            <div className="rounded-xs bg-bg-subtle p-1">
              <div className="grid grid-cols-2 gap-1">
                <button className="rounded-[6px] bg-bg-surface py-2 text-sm font-semibold text-primary shadow-soft">{t("auth.login")}</button>
                <Link to="/register" className="rounded-[6px] py-2 text-center text-sm font-semibold text-text-muted">{t("auth.register")}</Link>
              </div>
            </div>

            {successMessage && (
              <div className="mt-6 flex items-center gap-2 text-xs font-medium text-emerald-700">
                <AlertCircle size={12} /><span>{successMessage}</span>
              </div>
            )}
            {displayError && (
              <div className="mt-6 flex items-center gap-2 text-xs font-medium text-state-error">
                <AlertCircle size={12} /><span>{displayError}</span>
              </div>
            )}

            <form className={`${displayError || successMessage ? "mt-4" : "mt-8"} space-y-6`} onSubmit={handleSubmit}>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-text-secondary">{t("auth.emailAddress")}</label>
                <input type="email" placeholder={t("auth.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}
                  className="mt-1.5 w-full rounded-xs border border-transparent border-b-2 bg-bg-subtle px-4 py-3.5 text-base text-text-primary placeholder:text-input-placeholder outline-none disabled:opacity-50" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-text-secondary">{t("auth.password")}</label>
                  <Link to="/forgot-password" className="text-[11px] font-semibold uppercase text-primary">{t("auth.forgot")}</Link>
                </div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder={t("auth.passwordPlaceholder")} value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}
                    className="mt-1.5 w-full rounded-xs border border-transparent border-b-2 bg-bg-subtle px-4 py-3.5 pr-10 text-base text-text-primary placeholder:text-input-placeholder outline-none disabled:opacity-50" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-input-icon"
                    aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-gradient-to-br from-primary to-primary-2 py-4 text-base font-bold text-text-inverse shadow-button-sm disabled:opacity-50">
                {loading ? t("auth.signingIn") : t("auth.signIn")}
                {!loading && <ArrowRight size={14} />}
              </button>
            </form>
          </div>

          <p className="mx-auto mt-6 max-w-[360px] text-center text-xs text-text-secondary">
            {t("auth.termsAgreement")}{" "}
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

export default LoginPage;
