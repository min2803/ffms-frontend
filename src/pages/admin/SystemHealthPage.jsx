import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import UserLayout from "../../components/layout/UserLayout";
import { Sidebar } from "../../components/dashboard";
import AdminHeader from "../../components/dashboardAdmin/AdminHeader";
import SystemHealthKpis from "../../components/dashboardAdmin/SystemHealthKpis";
import SystemHealthEventLog from "../../components/dashboardAdmin/SystemHealthEventLog";
import SystemHealthLatency from "../../components/dashboardAdmin/SystemHealthLatency";
import SystemHealthHistory from "../../components/dashboardAdmin/SystemHealthHistory";
import { getAdminNavItems } from "../../data/dashboardAdminData";
import useAdminData from "../../hooks/useAdminData";

export default function SystemHealthPage() {
  const { t } = useTranslation();
  const [sidebarCollapsed] = useState(false);
  const { data, loading, error, refetch } = useAdminData("health");

  const headerActions = (
    <button type="button" onClick={refetch}
      className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:opacity-90">
      <RefreshCw size={16} /><span>{t("admin.forceSync")}</span>
    </button>
  );

  return (
    <UserLayout
      sidebar={<Sidebar navItems={getAdminNavItems("system-health", t)} collapsed={sidebarCollapsed} brandLabel={t("common.systemControl")} />}
      header={<AdminHeader title={t("admin.systemHealth")} subtitle={t("admin.systemHealthSubtitle")} actions={headerActions} />}
      sidebarCollapsed={sidebarCollapsed}
      headerContainerClassName="max-w-[1320px]"
      contentContainerClassName="max-w-[1320px]"
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-10 text-center font-medium text-text-secondary">{t("admin.loadingMetrics")}</div>
        ) : error ? (
          <div className="py-10 text-center font-medium text-red-500">{t("common.errorPrefix")} {error}</div>
        ) : (
          <>
            <SystemHealthKpis data={data?.metrics} />
            <SystemHealthEventLog logs={data?.logs || []} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <SystemHealthLatency data={data?.latency || []} />
              <SystemHealthHistory history={data?.history || []} />
            </div>
          </>
        )}
      </div>
    </UserLayout>
  );
}
