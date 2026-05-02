export function getCurrentYear() {
  return new Date().getFullYear();
}

export function getCurrentMonthYear(locale = "vi-VN") {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
  }).format(new Date());
}

export function getCurrentMonthName(locale = "vi-VN") {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
  }).format(new Date());
}

export function getCurrentQuarterLabel() {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3) + 1;
  return `Q${quarter} Fiscal Year`;
}

export function getCurrentDateLabel(locale = "vi-VN") {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date());
}

export function getDateDaysAgo(days = 0) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export function formatDate(date, locale = "vi-VN") {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatDateWithTime(date, locale = "vi-VN") {
  return `${formatDate(date, locale)} • ${new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)}`;
}
