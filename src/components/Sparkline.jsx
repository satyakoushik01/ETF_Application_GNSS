export default function Sparkline({ data = [], positive = true, className = '' }) {
  if (!data.length) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const w = 88
  const h = 28
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((v - min) / span) * (h - 4) - 2
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox={`0  0 ${w} ${h}`} className={`h-7 w-[88px] ${className}`} aria-hidden>
      <polyline
        fill="none"
        stroke={positive ? '#16a34a' : '#dc2626'}
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  )
}
