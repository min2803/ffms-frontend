const ROLE_STYLES = {
  ADMIN: "bg-role-admin-bg text-role-admin-text",
  EDITOR: "bg-role-editor-bg text-role-editor-text",
  VIEWER: "bg-role-viewer-bg text-role-viewer-text",
};

export default function RoleBadge({ role }) {
  const tone = ROLE_STYLES[role?.toUpperCase()] || ROLE_STYLES.VIEWER;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.5px] ${tone}`}
    >
      {role}
    </span>
  );
}
