import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

const DAYS_VI = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const DAYS_EN = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const MONTHS_VI = [
  "Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6",
  "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12",
];
const MONTHS_EN = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Get current date in Vietnam timezone (GMT+7) as YYYY-MM-DD */
function getNowVN() {
  const now = new Date();
  // Convert to VN time using Intl
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now); // returns "YYYY-MM-DD"
  return parts;
}

/** Parse VN today into { year, month (0-based), day } */
function getTodayVN() {
  const str = getNowVN(); // "YYYY-MM-DD"
  const [y, m, d] = str.split("-").map(Number);
  return { year: y, month: m - 1, day: d, str };
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

/**
 * Custom DatePicker – compact, uses Vietnam timezone (GMT+7).
 *
 * @param {string}   value      – "YYYY-MM-DD" date string
 * @param {Function} onChange   – (dateString) => void
 * @param {string}   className  – optional extra wrapper classes
 */
export default function DatePicker({ value, onChange, className = "" }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const todayVN = getTodayVN();

  // Parse value or default to VN today
  const parsed = value ? new Date(value + "T00:00:00") : null;
  const initYear = parsed ? parsed.getFullYear() : todayVN.year;
  const initMonth = parsed ? parsed.getMonth() : todayVN.month;
  const [viewYear, setViewYear] = useState(initYear);
  const [viewMonth, setViewMonth] = useState(initMonth);

  // Sync view when value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(value + "T00:00:00");
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dayNames = lang === "vi" ? DAYS_VI : DAYS_EN;
  const monthNames = lang === "vi" ? MONTHS_VI : MONTHS_EN;

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  // Previous month trailing days
  const prevMonthDays = getDaysInMonth(viewYear, viewMonth - 1);
  const trailingDays = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    trailingDays.push({ day: prevMonthDays - i, current: false });
  }

  // Current month days
  const currentDays = [];
  for (let d = 1; d <= daysInMonth; d++) {
    currentDays.push({ day: d, current: true });
  }

  // Next month leading days
  const totalCells = trailingDays.length + currentDays.length;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const leadingDays = [];
  for (let d = 1; d <= remaining; d++) {
    leadingDays.push({ day: d, current: false });
  }

  const allDays = [...trailingDays, ...currentDays, ...leadingDays];

  const selectedDate = value || "";
  const todayStr = todayVN.str; // VN timezone today

  const handleSelectDay = (dayObj) => {
    if (!dayObj.current) return;
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(dayObj.day).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else { setViewMonth(viewMonth - 1); }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else { setViewMonth(viewMonth + 1); }
  };

  const handleToday = () => {
    const vn = getTodayVN();
    setViewYear(vn.year);
    setViewMonth(vn.month);
    onChange(vn.str);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  // Format display value
  const displayValue = value
    ? new Date(value + "T00:00:00").toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
      day: "2-digit", month: "2-digit", year: "numeric",
    })
    : "";

  const isSelected = (dayObj) => {
    if (!dayObj.current || !value) return false;
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(dayObj.day).padStart(2, "0");
    return selectedDate === `${viewYear}-${mm}-${dd}`;
  };

  const isToday = (dayObj) => {
    if (!dayObj.current) return false;
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(dayObj.day).padStart(2, "0");
    return todayStr === `${viewYear}-${mm}-${dd}`;
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer select-none items-center rounded-lg bg-bg-subtle px-3 py-2.5 transition-colors hover:bg-[#e6edfa]"
      >
        <Calendar className="mr-2 h-3.5 w-3.5 text-text-muted shrink-0" />
        <span className={`flex-1 text-xs font-medium ${value ? "text-text-primary" : "text-text-muted"}`}>
          {displayValue || t("datePicker.placeholder", "Chọn ngày")}
        </span>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-[220px] overflow-hidden rounded-lg border border-border-default bg-white shadow-lg">
          {/* Month/Year Header */}
          <div className="flex items-center justify-between border-b border-border-default px-2.5 py-1.5">
            <span className="text-[11px] font-bold text-text-primary">
              {monthNames[viewMonth]} {viewYear}
            </span>
            <div className="flex items-center">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="flex h-5 w-5 items-center justify-center rounded text-text-muted transition-colors hover:bg-bg-subtle hover:text-primary"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="flex h-5 w-5 items-center justify-center rounded text-text-muted transition-colors hover:bg-bg-subtle hover:text-primary"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 border-b border-border-default px-1.5 py-1">
            {dayNames.map((d) => (
              <div key={d} className="text-center text-[8px] font-bold uppercase tracking-wide text-text-muted">
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 px-1.5 py-1">
            {allDays.map((dayObj, idx) => {
              const selected = isSelected(dayObj);
              const today = isToday(dayObj);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDay(dayObj)}
                  disabled={!dayObj.current}
                  className={`
                    flex h-6 w-full items-center justify-center rounded text-[11px] font-medium transition-all duration-100
                    ${!dayObj.current
                      ? "cursor-default text-text-soft/30"
                      : selected
                        ? "bg-primary text-white shadow-sm"
                        : today
                          ? "bg-bg-tint-soft text-primary font-bold ring-1 ring-primary/30"
                          : "text-text-primary hover:bg-bg-subtle cursor-pointer"
                    }
                  `}
                >
                  {dayObj.day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border-default px-2.5 py-1">
            <button
              type="button"
              onClick={handleClear}
              className="text-[9px] font-semibold text-text-muted transition-colors hover:text-state-error"
            >
              {t("datePicker.clear", "Xóa")}
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="text-[9px] font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              {t("datePicker.today", "Hôm nay")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
