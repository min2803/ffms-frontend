import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import UserLayout from "../../components/layout/UserLayout";
import { Sidebar, Header } from "../../components/dashboard";
import { SettingsProfile, SettingsForm } from "../../components/settings";
import { getNavigationItems } from "../../data/navigation";
import { useNotifications } from "../../contexts/NotificationContext";
import { useAppContext } from "../../contexts/AppContext";
import { useToast } from "../../contexts/ToastContext";
import useAuth from "../../hooks/useAuth";
import { userService } from "../../services";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { language } = useAppContext();
  const toast = useToast();
  const [sidebarCollapsed] = useState(false);
  const { unreadCount } = useNotifications();
  const { user, getMe } = useAuth();

  const navItems = getNavigationItems("settings", undefined, t);

  useEffect(() => {
    getMe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Helper: convert DB date (YYYY-MM-DD or ISO) → display format MM/DD/YYYY
  const formatDobForDisplay = (dbDate) => {
    if (!dbDate) return "";
    const d = new Date(dbDate);
    if (isNaN(d.getTime())) return "";
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  // Helper: convert display date MM/DD/YYYY → DB format YYYY-MM-DD
  const formatDobForDb = (displayDate) => {
    if (!displayDate) return null;
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(displayDate.trim());
    if (!match) return null;
    return `${match[3]}-${match[1]}-${match[2]}`;
  };

  // Map DB fields → form fields
  const profileForForm = user
    ? {
        fullName: user.full_name || user.name || "",
        phone: user.phone_number || "",
        dob: formatDobForDisplay(user.date_of_birth),
        gender: user.gender || "",
      }
    : undefined;

  const profileForDisplay = user
    ? {
        name: user.full_name || user.name || "",
        role: user.role_name || t("household.members"),
        status: t("settings.activeMember"),
        uid: user.display_id || user.id || "",
        avatar: user.avatar_url || "",
        joinedDate: user.created_at
          ? new Date(user.created_at).toLocaleDateString(
              language === "vi" ? "vi-VN" : "en-US",
              { year: "numeric", month: "short", day: "numeric" }
            )
          : "",
      }
    : {};

  const handleSaveSettings = async (data) => {
    try {
      await userService.updateProfile({
        name: data.fullName,
        full_name: data.fullName,
        phone_number: data.phone || "",
        date_of_birth: formatDobForDb(data.dob),
        email: user?.email,
      });
      await getMe(); // Refresh user data to reflect changes immediately
      toast.success(t("settings.saveSuccess", "Cập nhật thông tin thành công!"));
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || t("settings.saveFailed", "Cập nhật thất bại");
      toast.error(msg);
      throw err; // Re-throw so SettingsForm knows it failed
    }
  };

  return (
    <UserLayout
      sidebar={<Sidebar navItems={navItems} collapsed={sidebarCollapsed} />}
      header={
        <Header
          title={t("settings.title")}
          subtitle={t("settings.subtitle")}
          notificationCount={unreadCount}
          titleClassName="!text-[30px] !leading-9 !tracking-[-0.02em]"
          subtitleClassName="!mt-1 !text-base !text-text-secondary"
        />
      }
      sidebarCollapsed={sidebarCollapsed}
    >
      <div className="mx-auto w-full max-w-[1024px] space-y-8 pb-2">
        <SettingsProfile profile={profileForDisplay} />
        <SettingsForm initialData={profileForForm} onSave={handleSaveSettings} />
      </div>
    </UserLayout>
  );
}
