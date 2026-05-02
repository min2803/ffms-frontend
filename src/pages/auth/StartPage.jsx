import { ArrowRight, Building2, ChartNoAxesCombined, ReceiptText } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCurrentYear } from "../../utils/dateTime";

const familyImage = "https://placehold.co/800x288/e2e8f0/64748b?text=Family+Finance";
const avatarOne = "https://placehold.co/32x32/c7d2fe/4f46e5?text=A";
const avatarTwo = "https://placehold.co/32x32/ddd6fe/7c3aed?text=B";

function StartPage() {
  const { t } = useTranslation();
  const currentYear = getCurrentYear();
  const token = localStorage.getItem("accessToken");
  if (token) {
    const role = localStorage.getItem("userRole");
    return <Navigate to={role === "admin" ? "/dashboard-admin" : "/dashboard"} replace />;
  }

  return (
    <div className="min-h-screen bg-bg-page text-text-secondary">
      <header className="sticky top-0 z-20 border-b border-border-light bg-bg-sidebar/50 backdrop-blur-header">
        <nav className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-8">
            <span className="text-3xl font-bold tracking-tight text-text-primary">{t("common.brandName")}</span>
            <div className="hidden gap-6 text-sm text-text-muted md:flex">
              <a href="#!" className="hover:text-text-primary">{t("start.support")}</a>
              <a href="#!" className="hover:text-text-primary">{t("start.security")}</a>
              <a href="#!" className="hover:text-text-primary">{t("start.privacy")}</a>
            </div>
          </div>
          <Link to="/login" className="rounded-sm bg-gradient-to-br from-primary to-primary-2 px-6 py-2.5 text-sm font-semibold text-text-inverse shadow-button-sm">
            {t("start.getStarted")}
          </Link>
        </nav>
      </header>

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 right-0 h-[600px] w-[600px] rounded-full bg-primary-2 opacity-20 blur-glow-xl" />
        <div className="pointer-events-none absolute right-20 top-64 h-[400px] w-[400px] rounded-full bg-secondary opacity-20 blur-glow-lg" />

        <section className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-[1280px] items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:px-6">
          <div className="max-w-xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border-light bg-bg-badge px-3 py-1.5 text-[10px] font-bold uppercase tracking-[1px] text-text-secondary">
              {t("start.builtForFamilies")}
            </div>
            <h1 className="text-5xl leading-[1.05] font-extrabold tracking-tight text-text-primary md:text-7xl">
              {t("start.heroTitle")}{" "}
              <span className="text-primary">{t("start.heroTitleHighlight")}</span>
            </h1>
            <p className="mt-8 max-w-xl text-xl leading-8 text-text-secondary">
              {t("start.heroDescription")}
            </p>
            <Link to="/login" className="mt-10 inline-flex items-center gap-2 rounded-sm bg-gradient-to-br from-primary to-primary-2 px-8 py-4 text-xl font-bold text-text-inverse shadow-button-lg">
              {t("start.getStarted")}<ArrowRight size={18} />
            </Link>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -left-6 -top-6 h-32 w-32 rounded-lg bg-[rgb(108_248_187/0.3)] blur-glow-sm" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-[rgb(0_163_255/0.2)] blur-glow-md" />

            <div className="relative rounded-xl border border-border-light bg-bg-surface p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-content-center rounded-full bg-[rgb(0_163_255/0.2)] text-primary"><Building2 size={20} /></div>
                  <div>
                    <p className="text-xs font-bold uppercase text-text-secondary">{t("start.totalFamilyNetWorth")}</p>
                    <p className="text-3xl font-bold text-text-primary">428.500.000 ₫</p>
                  </div>
                </div>
                <div className="flex items-center pr-2">
                  <img className="-mr-2 h-8 w-8 rounded-full border-2 border-white object-cover" src={avatarOne} alt="" />
                  <img className="-mr-2 h-8 w-8 rounded-full border-2 border-white object-cover" src={avatarTwo} alt="" />
                  <span className="grid h-8 w-8 place-content-center rounded-full border-2 border-bg-surface bg-bg-badge text-[10px] font-bold text-text-primary">+2</span>
                </div>
              </div>

              <div className="mb-4 rounded-md bg-bg-subtle p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-content-center rounded-sm bg-bg-surface shadow-soft text-primary"><Building2 size={18} /></div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{t("start.monthlySavingsGoal")}</p>
                      <div className="mt-2 h-1.5 w-32 rounded-full bg-bg-progress-track"><div className="h-full w-2/3 rounded-full bg-state-success" /></div>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-state-success">67%</p>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="rounded-md bg-bg-subtle p-4">
                  <ChartNoAxesCombined className="mb-4 text-amber-500" size={20} />
                  <p className="text-xs text-text-secondary">{t("start.investmentGrowth")}</p>
                  <p className="text-3xl font-bold text-text-primary">+12.4%</p>
                </div>
                <div className="rounded-md bg-bg-subtle p-4">
                  <ReceiptText className="mb-4 text-red-500" size={20} />
                  <p className="text-xs text-text-secondary">{t("start.recentExpense")}</p>
                  <p className="text-3xl font-bold text-text-primary">-2.140.000 ₫</p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-md">
                <img className="h-72 w-full object-cover" src={familyImage} alt="Family financial dashboard" />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgb(0_98_157/0.6)] to-[rgb(0_98_157/0)]" />
                <p className="absolute bottom-4 left-4 text-xs text-text-inverse">{t("start.realtimeCollaboration")}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border-light bg-bg-footer">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col justify-between gap-6 px-4 py-10 text-text-soft md:flex-row md:items-center">
          <div>
            <p className="text-2xl font-bold text-text-primary">{t("common.brandName")}</p>
            <p className="mt-2 text-sm">{t("start.footerCopyright", { year: currentYear })}</p>
          </div>
          <div className="flex flex-wrap gap-8 text-[11px] font-normal uppercase tracking-[1.1px]">
            <a href="#!">{t("auth.termsOfService")}</a>
            <a href="#!">{t("auth.privacyPolicy")}</a>
            <a href="#!">{t("auth.cookieSettings")}</a>
            <a href="#!">{t("start.accessibility")}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StartPage;
