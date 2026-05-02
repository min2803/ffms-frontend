import { useState, useEffect } from "react";
import { BriefcaseBusiness, ChevronDown, ChevronRight, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";

/**
 * Sidebar navigation component.
 *
 * @param {Object}   props
 * @param {Array}    props.navItems        – [{ id, label, icon: LucideComponent, active? }]
 * @param {boolean}  props.collapsed       – whether the sidebar is in collapsed mode
 */
export default function Sidebar({ navItems = [], collapsed = false, brandLabel = "Family Office" }) {
  const [expanded, setExpanded] = useState({});
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const initialExpanded = {};
    navItems.forEach(item => {
      if (item.active && item.subItems?.length) {
        initialExpanded[item.id] = true;
      }
    });
    setExpanded(prev => ({ ...prev, ...initialExpanded }));
  }, [navItems]);

  const handleToggle = (e, item) => {
    if (item.subItems && item.subItems.length > 0) {
      e.preventDefault();
      setExpanded(prev => ({ ...prev, [item.id]: !prev[item.id] }));
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="mb-6 flex items-center gap-2.5 px-4 pt-5">
        <div className="grid h-9 w-9 shrink-0 place-content-center rounded-sm bg-primary text-text-inverse">
          <BriefcaseBusiness size={18} />
        </div>
        {!collapsed && (
          <div>
            <p className="text-lg font-bold leading-none tracking-tight">FFMS</p>
            <p className="text-[10px] font-semibold uppercase tracking-[1.2px] text-text-muted">
              {brandLabel}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 pb-4 text-[13px] font-medium text-text-muted">
        {navItems.map((item) => {
          const Icon = item.icon;
          const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
          const isExpanded = expanded[item.id];

          return (
            <div key={item.id} className="space-y-1">
              <Link
                to={item.href || "#!"}
                onClick={(e) => handleToggle(e, item)}
                className={`flex w-full items-center gap-2.5 rounded-sm px-3 py-2.5 text-left transition ${
                  item.active
                    ? "bg-primary text-text-inverse shadow-soft"
                    : "hover:bg-bg-surface/80 text-text-muted"
                }`}
              >
                <Icon size={16} />
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {!collapsed && hasSubItems && (
                  isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                )}
              </Link>

              {!collapsed && hasSubItems && isExpanded && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((sub) => (
                    <Link
                      key={sub.id}
                      to={sub.href}
                      className={`block rounded-sm px-3 py-2 text-sm font-semibold transition ${
                        sub.active
                          ? "text-primary bg-bg-subtle"
                          : "text-text-soft hover:text-text-primary hover:bg-gray-50"
                      }`}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-border-default px-3 py-3">
        <button
          type="button"
          onClick={handleLogout}
          className={`flex w-full items-center gap-2.5 rounded-sm px-3 py-2.5 text-[13px] font-medium text-text-muted transition hover:bg-state-error/10 hover:text-state-error ${
            collapsed ? "justify-center" : ""
          }`}
          title={t("settings.logout")}
        >
          <LogOut size={16} />
          {!collapsed && <span>{t("settings.logout")}</span>}
        </button>
      </div>
    </div>
  );
}

