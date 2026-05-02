import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserLayout from "../../components/layout/UserLayout";
import { Sidebar, Header } from "../../components/dashboard";
import { HouseholdInfo, MemberManagement } from "../../components/household";
import { getNavigationItems } from "../../data/navigation";
import useHousehold from "../../hooks/useHousehold";
import { useNotifications } from "../../contexts/NotificationContext";
import { useAppContext } from "../../contexts/AppContext";
import { getAvatarUrl } from "../../utils/avatar";

export default function HouseholdPage() {
  const { t } = useTranslation();
  const { language } = useAppContext();
  const [sidebarCollapsed] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const navigate = useNavigate();
  const navItems = getNavigationItems("household", undefined, t);

  const { household, loading, error, removeMember } = useHousehold();
  const { unreadCount } = useNotifications();

  const householdInfo = household ? {
    ...household,
    createdOn: household.created_at ? new Date(household.created_at).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US") : "",
    status: t("common.active").toUpperCase(),
    members: (household.members || []).map((m) => ({
      id: m.user_id,
      membershipId: m.membership_id,
      name: m.name,
      email: m.email,
      role: m.role,
      avatar: getAvatarUrl(m.name, 40),
    })),
  } : null;

  return (
    <UserLayout
      sidebar={<Sidebar navItems={navItems} collapsed={sidebarCollapsed} />}
      header={
        <Header
          title={t("household.title")}
          subtitle={t("household.subtitle")}
          notificationCount={unreadCount}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {loading ? (
          <div className="lg:col-span-12 py-10 text-center font-medium text-text-secondary">
            {t("household.loadingHousehold")}
          </div>
        ) : error ? (
          <div className="lg:col-span-12 py-10 text-center font-medium text-red-500">
            {t("common.errorPrefix")} {error}
          </div>
        ) : householdInfo ? (
          <>
            <div className="lg:col-span-4">
              <HouseholdInfo
                name={householdInfo.name}
                description={householdInfo.description}
                createdOn={householdInfo.createdOn}
                status={householdInfo.status}
                onEdit={() => navigate("/household/edit")}
              />
            </div>
            <div className="lg:col-span-8">
              <MemberManagement
                members={householdInfo.members}
                showAll={showAllMembers}
                onAddMember={() => navigate("/household/add-member")}
                onShowAll={() => setShowAllMembers((v) => !v)}
                onRemove={(id) => removeMember(household.id, id)}
              />
            </div>
          </>
        ) : (
          <div className="lg:col-span-12 py-10 text-center font-medium text-text-secondary">{t("household.noHouseholdData")}</div>
        )}
      </div>
    </UserLayout>
  );
}
