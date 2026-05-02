/**
 * Reusable flag icon component using the `flag-icons` library.
 *
 * Usage:
 *   <FlagIcon lang="vi" />   → 🇻🇳
 *   <FlagIcon lang="en" />   → 🇺🇸
 *   <FlagIcon code="jp" />   → 🇯🇵  (direct ISO 3166-1 alpha-2)
 */

const LANG_TO_COUNTRY = {
  vi: "vn",
  en: "us",
};

export default function FlagIcon({ lang, code, className = "" }) {
  const countryCode = code || LANG_TO_COUNTRY[lang] || "us";

  return (
    <span
      className={`fi fi-${countryCode} inline-block h-4 w-6 rounded-sm bg-cover bg-center shadow-[0_0_0_1px_rgba(0,0,0,.08)] ${className}`}
      role="img"
      aria-label={countryCode.toUpperCase()}
    />
  );
}
