import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, X, UserPlus, Loader2 } from "lucide-react";
import UserLayout from "../../components/layout/UserLayout";
import { Header, Sidebar } from "../../components/dashboard";
import { SectionCard, SectionContainer } from "../../components/shared";
import { NotificationItem } from "../../components/notification";
import { useNotifications } from "../../contexts/NotificationContext";
import { useToast } from "../../contexts/ToastContext";
import { getNavigationItems } from "../../data/navigation";
import invitationService from "../../services/modules/invitationService";

/* ─────────────── Invitation Card ─────────────── */
function InvitationCard({ invitation, onAccept, onReject, accepting, rejecting }) {
  const { t } = useTranslation();
  const isProcessing = accepting || rejecting;

  return (
    <div className="flex items-start gap-4 rounded-sm border border-border-default bg-bg-surface p-4 transition hover:shadow-sm">
      {/* Icon */}
      <span className="grid h-10 w-10 shrink-0 place-content-center rounded-full bg-blue-100 text-blue-600">
        <UserPlus size={18} />
      </span>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-text-primary">
          {invitation.household_name}
        </p>
        <p className="mt-0.5 text-xs text-text-secondary">
          {t("invitation.invitedBy", "Invited by")} <span className="font-medium">{invitation.inviter_name}</span>
        </p>
        <p className="mt-0.5 text-[10px] text-text-muted">
          {invitation.created_at ? new Date(invitation.created_at).toLocaleString() : ""}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => onAccept(invitation.id)}
          disabled={isProcessing}
          className="inline-flex items-center gap-1.5 rounded-xs bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
        >
          {accepting ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
          {t("invitation.accept", "Accept")}
        </button>
        <button
          type="button"
          onClick={() => onReject(invitation.id)}
          disabled={isProcessing}
          className="inline-flex items-center gap-1.5 rounded-xs border border-border-default px-3 py-1.5 text-xs font-semibold text-text-secondary transition hover:bg-bg-subtle disabled:opacity-50"
        >
          {rejecting ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
          {t("invitation.reject", "Decline")}
        </button>
      </div>
    </div>
  );
}

/* ─────────────── Page ─────────────── */
export default function NotificationPage() {
  const { t } = useTranslation();
  const [sidebarCollapsed] = useState(false);
  const { notifications, pendingInvitations, unreadCount, totalBadgeCount, markAllAsRead, markAsRead, refetch } = useNotifications();
  const toast = useToast();
  const navItems = getNavigationItems("dashboard", undefined, t);

  // Track processing states per invitation
  const [processingIds, setProcessingIds] = useState({});

  const handleAccept = async (id) => {
    setProcessingIds((prev) => ({ ...prev, [id]: "accepting" }));
    try {
      await invitationService.acceptInvitation(id);
      toast.success(t("invitation.acceptSuccess", "You have joined the household!"));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast.error(err?.response?.data?.message || t("invitation.acceptFailed", "Failed to accept invitation"));
      setProcessingIds((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleReject = async (id) => {
    setProcessingIds((prev) => ({ ...prev, [id]: "rejecting" }));
    try {
      await invitationService.rejectInvitation(id);
      toast.info(t("invitation.rejectSuccess", "Invitation declined"));
      await refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || t("invitation.rejectFailed", "Failed to decline invitation"));
    } finally {
      setProcessingIds((prev) => ({ ...prev, [id]: null }));
    }
  };

  return (
    <UserLayout
      sidebar={<Sidebar navItems={navItems} collapsed={sidebarCollapsed} />}
      header={
        <Header
          title={t("notifications.title")}
          subtitle={t("notifications.subtitle")}
          notificationCount={totalBadgeCount}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {/* ── Pending Invitations Section ── */}
          {pendingInvitations.length > 0 && (
            <SectionCard className="mb-6 overflow-hidden">
              <div className="border-b border-bg-badge px-6 py-5">
                <SectionContainer
                  title={t("invitation.pendingTitle", "Pending Invitations")}
                  subtitle={t("invitation.pendingSubtitle", { count: pendingInvitations.length }) || `${pendingInvitations.length} invitation(s) waiting`}
                  className="mb-0"
                />
              </div>
              <div className="space-y-3 p-4">
                {pendingInvitations.map((inv) => (
                  <InvitationCard
                    key={inv.id}
                    invitation={inv}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    accepting={processingIds[inv.id] === "accepting"}
                    rejecting={processingIds[inv.id] === "rejecting"}
                  />
                ))}
              </div>
            </SectionCard>
          )}

          {/* ── Notifications Section ── */}
          <SectionCard className="overflow-hidden">
            <div className="border-b border-bg-badge px-6 py-5">
              <SectionContainer
                title={t("notifications.allNotifications")}
                subtitle={t("notifications.totalNotifications", { count: notifications.length })}
                action={
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-primary"
                  >
                    {t("notifications.markAllAsRead")}
                  </button>
                }
                className="mb-0"
              />
            </div>
            <div className="divide-y divide-bg-badge">
              {notifications.map((item) => (
                <NotificationItem key={item.id} item={item} onSelect={markAsRead} />
              ))}
              {notifications.length === 0 && (
                <div className="py-10 text-center text-sm text-text-secondary">
                  {t("notifications.noNotifications", "No notifications yet")}
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <SectionCard className="p-6">
            <SectionContainer title={t("notifications.summary")} className="mb-0" />
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-sm bg-bg-subtle p-4">
                <p className="text-[10px] font-bold uppercase tracking-[1px] text-text-muted">
                  {t("common.unread")}
                </p>
                <p className="mt-1 text-2xl font-bold text-text-primary">{unreadCount}</p>
              </div>
              <div className="rounded-sm bg-bg-subtle p-4">
                <p className="text-[10px] font-bold uppercase tracking-[1px] text-text-muted">
                  {t("invitation.pendingTitle", "Invitations")}
                </p>
                <p className="mt-1 text-2xl font-bold text-text-primary">{pendingInvitations.length}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard className="p-6">
            <SectionContainer title={t("notifications.quickActions")} className="mb-0" />
            <div className="space-y-3">
              <button
                type="button"
                onClick={markAllAsRead}
                className="w-full rounded-sm bg-bg-subtle px-4 py-3 text-sm font-semibold text-text-primary"
              >
                {t("notifications.markEverythingRead")}
              </button>
              <button
                type="button"
                onClick={() => alert(t("notifications.configureComingSoon"))}
                className="w-full rounded-sm bg-bg-badge px-4 py-3 text-sm font-semibold text-primary"
              >
                {t("notifications.configureChannels")}
              </button>
            </div>
          </SectionCard>
        </div>
      </div>
    </UserLayout>
  );
}
