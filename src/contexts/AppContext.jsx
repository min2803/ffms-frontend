import { createContext, useCallback, useContext, useMemo, useState } from "react";
import i18n from "../i18n";

const AppContext = createContext(null);

const LANGUAGE_KEY = "app_language";
const CURRENCY_KEY = "app_currency";

export function AppProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem(LANGUAGE_KEY) || "en"
  );
  const [currency, setCurrency] = useState(
    () => localStorage.getItem(CURRENCY_KEY) || "VND"
  );

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const next = prev === "en" ? "vi" : "en";
      localStorage.setItem(LANGUAGE_KEY, next);
      i18n.changeLanguage(next);
      return next;
    });
  }, []);

  const toggleCurrency = useCallback(() => {
    setCurrency((prev) => {
      const next = prev === "VND" ? "USD" : "VND";
      localStorage.setItem(CURRENCY_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ language, currency, toggleLanguage, toggleCurrency }),
    [language, currency, toggleLanguage, toggleCurrency]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
