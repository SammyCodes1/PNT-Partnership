/** Set a symbol such as "$" or "₦" when you are ready. Blank shows plain numbers. */
export const CURRENCY_SYMBOL = ""

export function formatAmount(value: number) {
  const formatted = new Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0)
  return CURRENCY_SYMBOL ? `${CURRENCY_SYMBOL}${formatted}` : formatted
}

export function fundingPercent(raised: number, goal: number) {
  if (goal <= 0) return 0
  return Math.min(100, Math.round((raised / goal) * 100))
}
