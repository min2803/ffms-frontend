import { Bell, DollarSign } from "lucide-react";
import { useEffect, useRef } from "react";
import { NotificationDropdown } from "../notification";
import { useNotifications } from "../../contexts/NotificationContext";
import { useAppContext } from "../../contexts/AppContext";
import FlagIcon from "../ui/FlagIcon";

export default function Header({
  title,
  subtitle,
  notificationCount = 0,
  titleClassName = "",
  subtitleClassName = "",
  children,
}) {
  const {
    notifications,
    pendingInvitations,
    unreadCount,
    dropdownOpen,
    setDropdownOpen,
    markAllAsRead,
    markAsRead,
  } = useNotifications();
  const { language, currency, toggleLanguage, toggleCurrency } = useAppContext();
  const containerRef = useRef(null);
  const count = notificationCount || unreadCount;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [setDropdownOpen]);

  return (
    <div className="flex h-full items-center justify-between">
      <div>
        <h1
          className={`text-2xl font-bold tracking-tight text-text-primary ${titleClassName}`}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={`text-sm text-text-muted ${subtitleClassName}`}
          >
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children && (
          <div className="hidden items-center gap-2 tablet:flex">
            {children}
          </div>
        )}

        <button
          type="button"
          onClick={toggleLanguage}
          className="grid h-10 w-10 place-content-center rounded-full transition hover:bg-bg-subtle"
          title={language === "en" ? "Switch to Vietnamese" : "Chuyển sang Tiếng Anh"}
        >
          <FlagIcon lang={language} />
        </button>

        <button
          type="button"
          onClick={toggleCurrency}
          className="inline-flex h-10 items-center gap-1 rounded-full px-2 transition hover:bg-bg-subtle"
          title={currency === "VND" ? "Switch to USD" : "Chuyển sang VND"}
        >
          <DollarSign size={16} className="text-primary" />
          <span className="text-xs font-bold text-primary">
            {currency === "VND" ? "VND" : "USD"}
          </span>
        </button>

        <div className="relative" ref={containerRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="relative grid h-10 w-10 place-content-center rounded-full text-text-muted hover:bg-bg-subtle"
          >
            <Bell size={18} />
            {count > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-state-error ring-2 ring-bg-surface" />
            )}
          </button>

          {dropdownOpen ? (
            <NotificationDropdown
              notifications={notifications}
              pendingInvitations={pendingInvitations}
              onMarkAllRead={markAllAsRead}
              onItemClick={markAsRead}
              onViewAll={() => setDropdownOpen(false)}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
