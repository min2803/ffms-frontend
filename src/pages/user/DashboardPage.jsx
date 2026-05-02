import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Lightbulb,
  TrendingDown,
  TrendingUp,
  Zap,
  DatabaseZap,
  HandCoins,
  NotebookText,
  WalletCards,
} from "lucide-react";
import UserLayout from "../../components/layout/UserLayout";
import {
  Sidebar,
  Header,
  BudgetAlert,
  KpiCards,
  FinancialChart,
  AiInsights,
  RecentActivity,
  AssetAllocation,
} from "../../components/dashboard";
import { getNavigationItems } from "../../data/navigation";
import { getCurrentQuarterLabel } from "../../utils/dateTime";
import useDashboard from "../../hooks/useDashboard";
import { useNotifications } from "../../contexts/NotificationContext";
import { useAppContext } from "../../contexts/AppContext";
import householdService from "../../services/modules/householdService";
import { formatCurrency } from "../../utils/formatCurrency";

const iconMap = { TrendingUp, TrendingDown, Zap, Lightbulb };

function DashboardPage() {
  const { t } = useTranslation();
  const { currency, language } = useAppContext();
  const [sidebarCollapsed] = useState(false);
  const [flowView, setFlowView] = useState("income");
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");
  const now = new Date();
  const { summary, loading, error, refetch } = useDashboard({ month: now.getMonth() + 1, year: now.getFullYear() });
  const { unreadCount } = useNotifications();

  const isEmpty = !loading && !error && summary && summary.totalIncome === 0 && summary.totalExpense === 0;

  const fmt = (amount) => formatCurrency(amount, currency, language);

  const handleSeedData = async () => {
    setSeeding(true);
    setSeedMsg("");
    try {
      const res = await householdService.seedData();
      const msg = res?.data?.message || res?.message || t("dashboard.sampleDataSuccess");
      setSeedMsg(msg);
      await refetch();
    } catch {
      setSeedMsg(t("dashboard.sampleDataError"));
    } finally {
      setSeeding(false);
    }
  };

  // Build KPI cards from raw numeric values instead of parsing pre-formatted VND strings
  // (parseFloat on locale-formatted "10.000.000 VND" returns 10 — a critical bug)
  const preparedKpiCards = summary?.kpiCards?.map((card, idx) => {
    const rawValues = [
      summary.totalIncome ?? 0,
      summary.totalExpense ?? 0,
      (summary.totalIncome ?? 0) - (summary.totalExpense ?? 0),
    ];
    return {
      ...card,
      value: fmt(rawValues[idx] ?? 0),
      icon: iconMap[card.iconName] || Lightbulb,
    };
  }) || [];

  const navItems = getNavigationItems("dashboard", undefined, t);
  const quarterLabel = getCurrentQuarterLabel();

  const headerSubtitle = (
    <>
      {t("dashboard.reviewingPerformance")}{" "}
      <span className="font-medium text-primary">{quarterLabel}</span>
    </>
  );

  return (
    <UserLayout
      sidebar={<Sidebar navItems={navItems} collapsed={sidebarCollapsed} />}
      header={
        <Header
          title={t("dashboard.title")}
          subtitle={headerSubtitle}
          notificationCount={unreadCount}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
    >
      <div className="w-full space-y-5">
        {loading ? (
           <div className="py-10 text-center font-medium text-text-secondary">
             {t("dashboard.loadingDashboard")}
           </div>
        ) : error ? (
           <div className="py-10 text-center font-medium text-red-500">
             {t("common.errorPrefix")} {error}
           </div>
        ) : summary?.message ? (
           <div className="py-20 text-center space-y-4">
              <div className="text-xl font-semibold text-text-primary">{summary.message}</div>
              <p className="text-text-secondary">{t("dashboard.startByAdding")}</p>
           </div>
        ) : (
          <>
            {summary?.budgetWarning && (
              <BudgetAlert
                title={summary.budgetWarning.title || t("dashboard.budgetWarning")}
                message={summary.budgetWarning.message || ""}
                actionLabel={summary.budgetWarning.actionLabel || t("dashboard.adjust")}
              />
            )}

            {isEmpty && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-text-primary">{t("dashboard.welcomeTitle")}</h2>
                  <p className="mt-1 text-sm text-text-secondary">{t("dashboard.welcomeSubtitle")}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
                  <Link to="/income" className="group rounded-md border border-border-default bg-bg-surface p-6 shadow-soft transition hover:border-primary hover:shadow-md">
                    <div className="mb-3 inline-grid h-10 w-10 place-content-center rounded-xs bg-emerald-50 text-emerald-600">
                      <HandCoins size={20} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("dashboard.step1")}</p>
                    <p className="mt-1 text-base font-bold text-text-primary">{t("dashboard.step1Title")}</p>
                    <p className="mt-1 text-sm text-text-secondary">{t("dashboard.step1Desc")}</p>
                  </Link>

                  <Link to="/expense/personal" className="group rounded-md border border-border-default bg-bg-surface p-6 shadow-soft transition hover:border-primary hover:shadow-md">
                    <div className="mb-3 inline-grid h-10 w-10 place-content-center rounded-xs bg-rose-50 text-rose-600">
                      <NotebookText size={20} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("dashboard.step2")}</p>
                    <p className="mt-1 text-base font-bold text-text-primary">{t("dashboard.step2Title")}</p>
                    <p className="mt-1 text-sm text-text-secondary">{t("dashboard.step2Desc")}</p>
                  </Link>

                  <Link to="/budget" className="group rounded-md border border-border-default bg-bg-surface p-6 shadow-soft transition hover:border-primary hover:shadow-md">
                    <div className="mb-3 inline-grid h-10 w-10 place-content-center rounded-xs bg-blue-50 text-blue-600">
                      <WalletCards size={20} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("dashboard.step3")}</p>
                    <p className="mt-1 text-base font-bold text-text-primary">{t("dashboard.step3Title")}</p>
                    <p className="mt-1 text-sm text-text-secondary">{t("dashboard.step3Desc")}</p>
                  </Link>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-border-default" />
                  <span className="text-xs font-medium text-text-muted">{t("dashboard.orExploreWithSampleData")}</span>
                  <div className="h-px flex-1 bg-border-default" />
                </div>

                <div className="text-center">
                  {seedMsg && (
                    <p className="mb-3 text-sm font-medium text-emerald-600">{seedMsg}</p>
                  )}
                  <button
                    onClick={handleSeedData}
                    disabled={seeding}
                    className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-bg-surface px-5 py-2.5 text-sm font-semibold text-text-primary shadow-sm transition hover:bg-bg-subtle disabled:opacity-50"
                  >
                    <DatabaseZap size={16} className="text-primary" />
                    {seeding ? t("dashboard.creatingData") : t("dashboard.createSampleData")}
                  </button>
                </div>
              </div>
            )}

            <KpiCards cards={preparedKpiCards} />

            <section className="grid grid-cols-1 desktop:grid-cols-12 gap-5">
              <div className="desktop:col-span-8">
                <FinancialChart
                  activeView={flowView}
                  onViewChange={setFlowView}
                  dataMap={summary?.flowData || { income: [], expense: [] }}
                  tabs={[
                    { id: "income", label: t("dashboard.income") },
                    { id: "expense", label: t("dashboard.expense") },
                  ]}
                  labels={summary?.months || []}
                  title={t("dashboard.financialFlow")}
                  subtitle={t("dashboard.netCashFlow")}
                />
              </div>
              <div className="desktop:col-span-4">
                <AiInsights insights={summary?.aiInsights || []} />
              </div>
            </section>

            <section className="grid grid-cols-1 tablet:grid-cols-2 gap-5">
              <RecentActivity activities={summary?.activities || []} />
              <AssetAllocation data={(summary?.assetAllocation || []).map((item, i) => ({
                label: item.name || item.label || t("common.unknown"),
                percent: parseFloat(item.percentage ?? item.percent ?? 0),
                amount: fmt(item.value ?? 0),
                color: ["#10b981", "#6366f1", "#f59e0b", "#ef4444"][i % 4],
              }))} />
            </section>
          </>
        )}
      </div>
    </UserLayout>
  );
}

export default DashboardPage;
