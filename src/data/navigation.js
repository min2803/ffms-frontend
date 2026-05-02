import {
  ChartNoAxesCombined,
  Cog,
  HandCoins,
  House,
  NotebookText,
  Wrench,
  WalletCards,
} from "lucide-react";

const BASE_NAV_ITEMS = [
  { id: "dashboard", labelKey: "nav.dashboard", href: "/dashboard", icon: ChartNoAxesCombined },
  { id: "household", labelKey: "nav.household", href: "/household", icon: House },
  { id: "income", labelKey: "nav.income", href: "/income", icon: HandCoins },
  {
    id: "expense",
    labelKey: "nav.expense",
    href: "#!",
    icon: NotebookText,
    subItems: [
      { id: "expense-personal", labelKey: "nav.expensePersonal", href: "/expense/personal" },
      { id: "expense-family", labelKey: "nav.expenseFamily", href: "/expense/family" },
    ],
  },
  { id: "budget", labelKey: "nav.budget", href: "/budget", icon: WalletCards },
  { id: "utilities", labelKey: "nav.utilities", href: "/utilities", icon: Wrench },
  { id: "settings", labelKey: "nav.settings", href: "/settings", icon: Cog },
];

export function getNavigationItems(activeId, activeSubId, t) {
  return BASE_NAV_ITEMS.map((item) => ({
    ...item,
    label: t ? t(item.labelKey) : item.labelKey,
    active: item.id === activeId,
    subItems: item.subItems?.map((sub) => ({
      ...sub,
      label: t ? t(sub.labelKey) : sub.labelKey,
      active: sub.id === activeSubId,
    })),
  }));
}

export const householdNavItems = getNavigationItems("household");
