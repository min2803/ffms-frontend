import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserLayout from "../../components/layout/UserLayout";
import { Sidebar, Header } from "../../components/dashboard";
import { EditHouseholdModal, HouseholdInfo, MemberManagement } from "../../components/household";
import { getNavigationItems } from "../../data/navigation";
import useHousehold from "../../hooks/useHousehold";
import { useNotifications } from "../../contexts/NotificationContext";
import { useAppContext } from "../../contexts/AppContext";

export default function EditHouseholdPage() {
  const { t } = useTranslation();
  const { language } = useAppContext();
  const [sidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const navItems = getNavigationItems("household", undefined, t);
  const { household, loading, error, updateHousehold } = useHousehold();
  const { unreadCount } = useNotifications();

  const EXISTING_HOUSEHOLD_NAMES = [];
  const PERMISSION_MEMBERS = (household?.members || []).map((m) => ({
    id: m.user_id,
    name: m.name,
    role: m.role,
  }));

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
          <div className="lg:col-span-12 py-10 text-center font-medium text-text-secondary">{t("common.loading")}</div>
        ) : error ? (
          <div className="lg:col-span-12 py-10 text-center font-medium text-red-500">{t("common.errorPrefix")} {error}</div>
        ) : household ? (
          <>
            <div className="lg:col-span-4">
              <HouseholdInfo
                name={household.name}
                description={household.description}
                createdOn={household.created_at ? new Date(household.created_at).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US") : ""}
                status={t("common.active").toUpperCase()}
                onEdit={() => {}}
              />
            </div>
            <div className="lg:col-span-8">
              <MemberManagement members={household.members || []} onAddMember={() => {}} onShowAll={() => {}} />
            </div>
          </>
        ) : (
          <div className="lg:col-span-12 py-10 text-center font-medium text-text-secondary">{t("household.noHouseholdData")}</div>
        )}
      </div>
      {household && (
        <EditHouseholdModal
          isOpen
          initialName={household.name}
          initialDescription={household.description}
          existingHouseholdNames={EXISTING_HOUSEHOLD_NAMES}
          permissionMembers={PERMISSION_MEMBERS}
          onClose={() => navigate("/household")}
          onSave={async (data) => {
            await updateHousehold(household.id, data);
            navigate("/household");
          }}
        />
      )}
    </UserLayout>
  );
}
