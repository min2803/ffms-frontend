import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserLayout from "../../components/layout/UserLayout";
import { Sidebar, Header } from "../../components/dashboard";
import { AddMemberModal, HouseholdInfo, MemberManagement } from "../../components/household";
import { getNavigationItems } from "../../data/navigation";
import useHousehold from "../../hooks/useHousehold";
import { useNotifications } from "../../contexts/NotificationContext";
import { useToast } from "../../contexts/ToastContext";
import { useAppContext } from "../../contexts/AppContext";
import { getAvatarUrl } from "../../utils/avatar";
import invitationService from "../../services/modules/invitationService";

export default function AddMemberPage() {
  const { t } = useTranslation();
  const { language } = useAppContext();
  const [sidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const navItems = getNavigationItems("household", undefined, t);
  const { household, loading, error } = useHousehold();
  const { unreadCount } = useNotifications();
  const toast = useToast();

  // Existing member IDs to disable them in search results
  const existingMemberIds = (household?.members || []).map((m) => m.user_id);

  const householdInfo = household
    ? {
        ...household,
        createdOn: household.created_at
          ? new Date(household.created_at).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US")
          : "",
        status: t("common.active").toUpperCase(),
        members: (household.members || []).map((m) => ({
          id: m.user_id,
          membershipId: m.membership_id,
          name: m.name,
          email: m.email,
          role: m.role,
          avatar: getAvatarUrl(m.name, 40),
        })),
      }
    : null;

  const handleSubmit = async (userIds) => {
    if (!household?.id || userIds.length === 0) return;

    try {
      const res = await invitationService.createInvitations(household.id, userIds);
      const data = res?.data || res;
      const created = data?.created || [];
      const errors = data?.errors || [];

      if (created.length > 0) {
        toast.success(
          created.length === 1
            ? t("invitation.sentOne", "Invitation sent successfully!")
            : t("invitation.sentMany", { count: created.length }) || `${created.length} invitations sent!`
        );
      }
      if (errors.length > 0) {
        toast.error(
          `${errors.length} ${t("invitation.failedToSend", "invitation(s) failed to send")}`
        );
      }

      navigate("/household");
    } catch (err) {
      toast.error(err?.response?.data?.message || t("invitation.sendFailed", "Failed to send invitations"));
    }
  };

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
        ) : householdInfo ? (
          <>
            <div className="lg:col-span-4">
              <HouseholdInfo name={householdInfo.name} description={householdInfo.description} createdOn={householdInfo.createdOn} status={householdInfo.status} onEdit={() => {}} />
            </div>
            <div className="lg:col-span-8">
              <MemberManagement members={householdInfo.members} onAddMember={() => {}} onShowAll={() => {}} />
            </div>
          </>
        ) : (
          <div className="lg:col-span-12 py-10 text-center font-medium text-text-secondary">{t("household.noHouseholdData")}</div>
        )}
      </div>

      <AddMemberModal
        isOpen
        onClose={() => navigate("/household")}
        onSubmit={handleSubmit}
        existingMemberIds={existingMemberIds}
      />
    </UserLayout>
  );
}
