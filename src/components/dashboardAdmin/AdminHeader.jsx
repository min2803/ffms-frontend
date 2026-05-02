import { Calendar, DollarSign, RefreshCw } from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";
import FlagIcon from "../ui/FlagIcon";

export default function AdminHeader({
  title = "System Overview",
  subtitle = "Real-time financial performance and health metrics.",
  actions,
}) {
  const { language, currency, toggleLanguage, toggleCurrency } = useAppContext();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          {title}
        </h1>
        <p className="mt-0.5 text-sm text-text-muted">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2">
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

        {actions !== undefined ? (
          actions
        ) : (
          <>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-sm border border-border-default bg-bg-surface px-3.5 py-2 text-xs font-semibold text-text-secondary shadow-soft transition hover:bg-bg-subtle"
            >
              <Calendar size={14} />
              <span>Last 24 Hours</span>
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                className="ml-1"
              >
                <path
                  d="M1 1l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-sm border border-border-default bg-bg-surface px-3.5 py-2 text-xs font-semibold text-text-secondary shadow-soft transition hover:bg-bg-subtle"
            >
              <RefreshCw size={14} />
              <span>Refresh Data</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
