import { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react";
import notificationService from "../services/modules/notificationService";
import invitationService from "../services/modules/invitationService";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── Lấy thông báo từ API ────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!localStorage.getItem("accessToken")) return;
    try {
      const data = await notificationService.getNotifications();
      setNotifications(Array.isArray(data) ? data : data?.data ?? []);
    } catch (err) {
      console.error("[NotificationContext] Lỗi khi lấy thông báo:", err);
    }
  }, []);

  // ── Lấy invitations pending ─────────────────────────────────────────
  const fetchInvitations = useCallback(async () => {
    if (!localStorage.getItem("accessToken")) return;
    try {
      const res = await invitationService.getMyInvitations();
      // res.data is expected to be { success: true, data: [...] }
      const responseData = res?.data;
      const list = responseData?.data || responseData || [];
      setPendingInvitations(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("[NotificationContext] Lỗi khi lấy invitations:", err);
    }
  }, []);

  // ── Init fetch ──────────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      await Promise.all([fetchNotifications(), fetchInvitations()]);
      setLoading(false);
    }
    init();
  }, [fetchNotifications, fetchInvitations]);

  // Backend uses is_read (boolean), not unread
  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications]
  );

  // Tổng badge count = unread notifications + pending invitations
  const totalBadgeCount = useMemo(
    () => unreadCount + pendingInvitations.length,
    [unreadCount, pendingInvitations]
  );

  // ── Đánh dấu tất cả đã đọc ────────────────────────────────────────
  const markAllAsRead = useCallback(async () => {
    try {
      const unread = notifications.filter((item) => !item.is_read);
      await Promise.all(unread.map((item) => notificationService.markAsRead(item.id)));
      setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
    } catch (err) {
      console.error("[NotificationContext] Lỗi khi đánh dấu đã đọc:", err);
    }
  }, [notifications]);

  // ── Đánh dấu một thông báo đã đọc ──────────────────────────────────
  const markAsRead = useCallback(async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_read: true } : item))
      );
    } catch (err) {
      console.error("[NotificationContext] Lỗi khi đánh dấu đã đọc:", err);
    }
  }, []);

  // ── Refetch cả notifications + invitations ─────────────────────────
  const refetch = useCallback(async () => {
    await Promise.all([fetchNotifications(), fetchInvitations()]);
  }, [fetchNotifications, fetchInvitations]);

  const value = useMemo(
    () => ({
      notifications,
      pendingInvitations,
      unreadCount,
      totalBadgeCount,
      loading,
      dropdownOpen,
      setDropdownOpen,
      markAllAsRead,
      markAsRead,
      refetch,
      refetchInvitations: fetchInvitations,
      refetchNotifications: fetchNotifications,
    }),
    [notifications, pendingInvitations, unreadCount, totalBadgeCount, loading, dropdownOpen, markAllAsRead, markAsRead, refetch, fetchInvitations, fetchNotifications]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
