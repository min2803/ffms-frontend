import { useState } from "react";
import { useTranslation } from "react-i18next";
import UserLayout from "../../components/layout/UserLayout";
import { Sidebar } from "../../components/dashboard";
import { HouseholdManagementKpis, HouseholdListTable } from "../../components/householdManagement";
import { getAdminNavItems } from "../../data/dashboardAdminData";
import useAdminData from "../../hooks/useAdminData";
import { useAppContext } from "../../contexts/AppContext";
import { getAvatarUrl } from "../../utils/avatar";

export default function HouseholdManagementPage() {
  const { t } = useTranslation();
  const { language } = useAppContext();
  const [sidebarCollapsed] = useState(false);
  const { data, loading, error } = useAdminData("household-management");

  const headerContent = (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-text-primary uppercase">{t("admin.householdManagement")}</h1>
      <p className="mt-1 text-sm font-medium text-text-secondary">{t("admin.householdManagementSubtitle")}</p>
    </div>
  );

  return (
    <UserLayout
      sidebar={<Sidebar navItems={getAdminNavItems("households", t)} collapsed={sidebarCollapsed} brandLabel={t("common.systemControl")} />}
      header={headerContent}
      sidebarCollapsed={sidebarCollapsed}
      headerContainerClassName="max-w-[1320px] pb-6"
      contentContainerClassName="max-w-[1320px]"
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-10 text-center font-medium text-text-secondary">{t("admin.loadingHouseholds")}</div>
        ) : error ? (
          <div className="py-10 text-center font-medium text-red-500">{t("common.errorPrefix")} {error}</div>
        ) : (
          <>
            <HouseholdManagementKpis kpis={data?.kpis || []} />
            <HouseholdListTable households={(data?.households || []).map((h) => ({
              ...h,
              ownerName: h.ownerName || h.owner_name || "—",
              ownerAvatar: h.ownerAvatar || getAvatarUrl(h.owner_name || h.ownerName, 28),
              memberCount: h.memberCount ?? h.member_count ?? 0,
              createdDate: h.createdDate || (h.created_at ? new Date(h.created_at).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US") : ""),
              tier: h.tier || "Standard Tier",
              customMemberBadge: h.customMemberBadge || "bg-blue-50 text-blue-700",
            }))} />
          </>
        )}
      </div>
    </UserLayout>
  );
}
