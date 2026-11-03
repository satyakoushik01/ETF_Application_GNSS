import { useMemo, useState } from 'react'
import { ArrowUpRight, Landmark, PieChart } from 'lucide-react'
import { Link } from 'react-router-dom'
import Sparkline from '../components/Sparkline'
import OrderModal from '../components/OrderModal'
import { usePortfolio } from '../context/PortfolioContext'
import { formatINR, formatPct, formatSignedINR, pnlClass } from '../lib/format'

export default function Dashboard() {
  const { holdings, etfs, bonds, netValue, invested, totalPnl, todayPnl } = usePortfolio()
  const [trade, setTrade] = useState(null)

  const movers = useMemo(() => {
    return [...etfs, ...bonds].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct)).slice(0, 5)
  }, [etfs, bonds])

  const etfValue = holdings.filter((h) => !h.asset.coupon).reduce((s, h) => s + h.current, 0)
  const bondValue = holdings.filter((h) => h.asset.coupon).reduce((s, h) => s + h.current, 0)
  const etfShare = netValue ? (etfValue / netValue) * 100 : 0
  const bondShare = netValue ? (bondValue / netValue) * 100 : 0

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">A clean view of your ETF and bond book.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs tracking-wide text-muted uppercase">Invested</p>
          <p className="mt-2 text-2xl font-semibold">{formatINR(invested)}</p>
          <p className="mt-1 text-sm text-muted">Capital deployed in holdings</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs tracking-wide text-muted uppercase">Total P&L</p>
          <p className={`mt-2 text-2xl font-semibold ${pnlClass(totalPnl)}`}>{formatSignedINR(totalPnl)}</p>
          <p className={`mt-1 text-sm ${pnlClass(totalPnl)}`}>
            {invested ? formatPct((totalPnl / invested) * 100) : '0.00%'} overall
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs tracking-wide text-muted uppercase">Today</p>
          <p className={`mt-2 text-2xl font-semibold ${pnlClass(todayPnl)}`}>{formatSignedINR(todayPnl)}</p>
          <p className="mt-1 text-sm text-muted">Unrealised day change</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-border bg-surface p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <PieChart size={16} className="text-accent" />
            <h2 className="font-semibold">Allocation</h2>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-bg">
            <div className="h-full bg-accent" style={{ width: `${etfShare}%` }} />
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted">
                <span className="h-2 w-2 rounded-full bg-accent" /> ETFs
              </span>
              <span>
                {formatINR(etfValue)} · {etfShare.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted">
                <span className="h-2 w-2 rounded-full bg-border" /> Bonds
              </span>
              <span>
                {formatINR(bondValue)} · {bondShare.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Top movers</h2>
            <Link to="/etfs" className="flex items-center gap-1 text-xs text-accent">
              Explore <ArrowUpRight size={14} />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {movers.map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.symbol}</p>
                  <p className="truncate text-xs text-muted">{m.name}</p>
                </div>
                <Sparkline data={m.spark} positive={m.changePct >= 0} />
                <div className="w-24 text-right">
                  <p className="text-sm">{formatINR(m.ltp)}</p>
                  <p className={`text-xs ${pnlClass(m.changePct)}`}>{formatPct(m.changePct)}</p>
                </div>
                <button
                  onClick={() => setTrade(m)}
                  className="hidden rounded-lg border border-border px-2 py-1 text-xs text-muted hover:text-ink sm:block"
                >
                  Trade
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Holdings snapshot</h2>
          <Link to="/portfolio" className="text-xs text-accent">
            View portfolio
          </Link>
        </div>
        {holdings.length === 0 ? (
          <p className="text-sm text-muted">No holdings yet. Explore ETFs or bonds to start.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {holdings.map((h) => (
              <button
                key={h.asset.id}
                onClick={() => setTrade(h.asset)}
                className="rounded-xl border border-border bg-bg p-4 text-left hover:border-accent/40"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{h.asset.symbol}</p>
                    <p className="text-xs text-muted">
                      {h.qty} units · Avg {formatINR(h.avgPrice)}
                    </p>
                  </div>
                  {h.asset.coupon ? (
                    <Landmark size={14} className="text-muted" />
                  ) : null}
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <p className="text-sm">{formatINR(h.current)}</p>
                  <p className={`text-sm ${pnlClass(h.pnl)}`}>{formatSignedINR(h.pnl)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {trade && <OrderModal asset={trade} onClose={() => setTrade(null)} />}
    </div>
  )
}
