import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check, X, UserPlus, Loader2 } from "lucide-react";
import NotificationItem from "./NotificationItem";
import invitationService from "../../services/modules/invitationService";
import { useToast } from "../../contexts/ToastContext";
import { useNotifications } from "../../contexts/NotificationContext";

function MiniInvitationCard({ invitation, onAccept, onReject, processing }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-start gap-3 border-b border-bg-badge bg-bg-subtle px-5 py-4">
      <span className="grid h-10 w-10 shrink-0 place-content-center rounded-full bg-blue-100 text-blue-600">
        <UserPlus size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-text-primary">
          {invitation.household_name}
        </p>
        <p className="text-xs text-text-secondary mt-0.5">
          {t("invitation.invitedBy", "Invited by")} <span className="font-medium">{invitation.inviter_name}</span>
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onAccept(invitation.id)}
            disabled={processing}
            className="inline-flex items-center gap-1.5 rounded bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
          >
            {processing === "accepting" ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
            {t("invitation.accept", "Accept")}
          </button>
          <button
            type="button"
            onClick={() => onReject(invitation.id)}
            disabled={processing}
            className="inline-flex items-center gap-1.5 rounded border border-border-default px-3 py-1.5 text-xs font-semibold text-text-secondary transition hover:bg-bg-surface disabled:opacity-50"
          >
            {processing === "rejecting" ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
            {t("invitation.reject", "Decline")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NotificationDropdown({
  notifications,
  pendingInvitations = [],
  onMarkAllRead,
  onItemClick,
  onViewAll,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { refetch } = useNotifications();
  const [processingIds, setProcessingIds] = useState({});

  const handleViewAll = () => {
    onViewAll?.();
    navigate("/notifications");
  };

  const handleAccept = async (id) => {
    setProcessingIds((prev) => ({ ...prev, [id]: "accepting" }));
    try {
      await invitationService.acceptInvitation(id);
      toast.success(t("invitation.acceptSuccess", "You have joined the household!"));
      // Tải lại trang để cập nhật toàn bộ dữ liệu (dashboard, household) theo household mới
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
    <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-[360px] overflow-hidden rounded-sm border border-border-light bg-bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-bg-badge px-5 py-4">
        <h3 className="text-lg font-bold text-text-primary">{t("notifications.title")}</h3>
        <button type="button" onClick={onMarkAllRead} className="text-xs font-semibold text-primary">
          {t("notifications.markAllAsRead")}
        </button>
      </div>

      <div className="max-h-[365px] overflow-y-auto">
        {pendingInvitations.map((inv) => (
          <MiniInvitationCard
            key={inv.id}
            invitation={inv}
            onAccept={handleAccept}
            onReject={handleReject}
            processing={processingIds[inv.id]}
          />
        ))}
        {notifications.map((item) => (
          <NotificationItem key={item.id} item={item} onSelect={onItemClick} />
        ))}
        {notifications.length === 0 && pendingInvitations.length === 0 && (
          <div className="py-8 text-center text-sm text-text-secondary">
            {t("notifications.noNotifications", "No notifications")}
          </div>
        )}
      </div>

      <button type="button" onClick={handleViewAll}
        className="w-full bg-bg-subtle px-4 py-3 text-center text-xs font-semibold uppercase tracking-[1.2px] text-text-muted">
        {t("notifications.viewAllNotifications")}
      </button>
    </div>
  );
}
