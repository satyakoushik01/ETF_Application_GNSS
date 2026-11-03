export function formatINR(value, digits = 2) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value)
}

export function formatCompactINR(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPct(value) {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatSignedINR(value) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${formatINR(Math.abs(value))}`
}

export function pnlClass(value) {
  if (value > 0) return 'text-gain'
  if (value < 0) return 'text-loss'
  return 'text-muted'
}
