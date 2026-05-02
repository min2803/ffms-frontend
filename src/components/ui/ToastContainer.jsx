import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";

const ICON_MAP = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLE_MAP = {
  success: {
    bg: "bg-emerald-50 border-emerald-200",
    icon: "text-emerald-500",
    text: "text-emerald-800",
    progress: "bg-emerald-400",
  },
  error: {
    bg: "bg-red-50 border-red-200",
    icon: "text-red-500",
    text: "text-red-800",
    progress: "bg-red-400",
  },
  warning: {
    bg: "bg-amber-50 border-amber-200",
    icon: "text-amber-500",
    text: "text-amber-800",
    progress: "bg-amber-400",
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    icon: "text-blue-500",
    text: "text-blue-800",
    progress: "bg-blue-400",
  },
};

function ToastItem({ toast, onRemove }) {
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const style = STYLE_MAP[toast.type] || STYLE_MAP.info;
  const Icon = ICON_MAP[toast.type] || Info;
  const duration = toast.duration || 3500;

  // Animate progress bar
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining > 0) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  // Exit animation before remove
  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), duration - 300);
    return () => clearTimeout(exitTimer);
  }, [duration]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => onRemove(toast.id), 200);
  };

  return (
    <div
      className={`
        pointer-events-auto flex items-start gap-3 w-80 rounded-xl border px-4 py-3.5
        shadow-lg backdrop-blur-sm transition-all duration-300 ease-out
        ${style.bg}
        ${exiting
          ? "translate-x-[120%] opacity-0 scale-95"
          : "translate-x-0 opacity-100 scale-100"
        }
      `}
      role="alert"
    >
      <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${style.icon}`} />
      <p className={`flex-1 text-sm font-medium leading-snug ${style.text}`}>
        {toast.message}
      </p>
      <button
        onClick={handleClose}
        className="shrink-0 rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100"
      >
        <X className={`h-4 w-4 ${style.text}`} />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] overflow-hidden rounded-b-xl">
        <div
          className={`h-full ${style.progress} transition-none`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/**
 * ToastContainer – render ở top-right, hiển thị stack toasts.
 * Đặt component này một lần ở root (App hoặc main).
 */
export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-9999 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}
