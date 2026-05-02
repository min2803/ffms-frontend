const VND_TO_USD_RATE = 1 / 26000;

export function formatCurrency(amount, currency = "VND", language = "en") {
  const numAmount = Number(amount) || 0;

  if (currency === "USD") {
    const usdAmount = numAmount * VND_TO_USD_RATE;
    return new Intl.NumberFormat(language === "vi" ? "vi-VN" : "en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usdAmount);
  }

  return new Intl.NumberFormat(language === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(numAmount);
}

export function formatVND(amount) {
  return formatCurrency(amount, "VND", "vi");
}
