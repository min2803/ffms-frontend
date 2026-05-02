import { useState } from "react";
import { useTranslation } from "react-i18next";
import UserLayout from "../../components/layout/UserLayout";
import { Sidebar } from "../../components/dashboard";
import { SectionCard } from "../../components/shared";
import { UserListToolbar, UserListTable } from "../../components/userManagement";
import { getAdminNavItems } from "../../data/dashboardAdminData";
import useUsers from "../../hooks/useUsers";
import { useAppContext } from "../../contexts/AppContext";
import { getAvatarUrl } from "../../utils/avatar";

export default function UserManagementPage() {
  const { t } = useTranslation();
  const { language } = useAppContext();
  const [sidebarCollapsed] = useState(false);
  const { users, pagination, loading, error, searchUsers, deleteUser, updateRole } = useUsers();

  const handleDelete = async (user) => {
    if (!window.confirm(t("admin.confirmDeleteUser", { name: user.name || user.email }))) return;
    try { await deleteUser(user.id); } catch { /* handled in hook */ }
  };

  const handleEdit = async (user) => {
    const newRoleId = user.role_id === 1 ? 2 : 1;
    const label = newRoleId === 1 ? t("admin.admin") : t("admin.user");
    if (!window.confirm(t("admin.confirmChangeRole", { name: user.name || user.email, role: label }))) return;
    try { await updateRole(user.id, newRoleId); } catch { /* handled in hook */ }
  };

  const headerContent = (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-text-primary uppercase">{t("admin.userManagement")}</h1>
      <p className="mt-1 text-sm font-medium text-text-secondary">{t("admin.userManagementSubtitle")}</p>
    </div>
  );

  return (
    <UserLayout
      sidebar={<Sidebar navItems={getAdminNavItems("users", t)} collapsed={sidebarCollapsed} brandLabel={t("common.systemControl")} />}
      header={headerContent}
      sidebarCollapsed={sidebarCollapsed}
      headerContainerClassName="max-w-[1320px] pb-6"
      contentContainerClassName="max-w-[1320px]"
    >
      <div className="rounded-lg bg-bg-subtle p-6 shadow-sm">
        <UserListToolbar onSearch={searchUsers} />
        <SectionCard className="overflow-hidden border-none shadow-sm">
          {loading ? (
            <div className="py-10 text-center font-medium text-text-secondary">{t("admin.loadingUsers")}</div>
          ) : error ? (
            <div className="py-10 text-center font-medium text-red-500">{t("common.errorPrefix")} {error}</div>
          ) : (
            <UserListTable
              users={users.map((u) => ({
                ...u,
                avatar: u.avatar || getAvatarUrl(u.name, 32),
                role: u.role_name || (u.role_id === 1 ? "admin" : "user"),
                status: t("common.active"),
                createdDate: u.created_at ? new Date(u.created_at).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US") : "",
              }))}
              total={pagination.total}
              page={pagination.page}
              limit={pagination.limit}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </SectionCard>
      </div>
    </UserLayout>
  );
}
