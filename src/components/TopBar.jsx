import { Menu, Wallet, TrendingUp, Activity } from 'lucide-react'
import { formatINR, formatSignedINR, pnlClass } from '../lib/format'
import { usePortfolio } from '../context/PortfolioContext'
import { useAuth } from '../context/AuthContext'

export default function TopBar({ onMenu }) {
  const { cash, netValue, todayPnl } = usePortfolio()
  const { user } = useAuth()
  const todayPct = netValue ? (todayPnl / netValue) * 100 : 0

  const stats = [
    {
      label: 'Virtual Balance',
      value: formatINR(cash, 0),
      hint: 'Cash available',
      icon: Wallet,
    },
    {
      label: 'Net Portfolio Value',
      value: formatINR(netValue),
      hint: 'Mark to market',
      icon: TrendingUp,
    },
    {
      label: "Today's P&L",
      value: formatSignedINR(todayPnl),
      hint: `${todayPct >= 0 ? '+' : ''}${todayPct.toFixed(2)}% today`,
      icon: Activity,
      tone: pnlClass(todayPnl),
    },
  ]

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
        <button
          onClick={onMenu}
          className="rounded-lg border border-border p-2 text-muted lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-ink">
            Welcome back, {user?.name?.split(' ')[0] || 'Trader'}
          </p>
          <p className="text-xs text-muted">Markets open · Mock feed</p>
        </div>
        <div className="ml-auto text-right sm:hidden">
          <p className="text-xs text-muted">Virtual cash</p>
          <p className="text-sm font-semibold text-ink">{formatINR(cash, 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px border-t border-border bg-border sm:grid-cols-3">
        {stats.map(({ label, value, hint, icon: Icon, tone }) => (
          <div key={label} className="flex items-center gap-3 bg-surface px-4 py-3 lg:px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Icon size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium tracking-wide text-muted uppercase">{label}</p>
              <p className={`truncate text-base font-bold ${tone || 'text-ink'}`}>{value}</p>
              <p className={`text-xs ${tone || 'text-muted'}`}>{hint}</p>
            </div>
          </div>
        ))}
      </div>
    </header>
  )
}
