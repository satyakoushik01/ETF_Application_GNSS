import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Coins,
  CircleDollarSign,
  Globe,
  ArrowUpRight,
} from 'lucide-react'
import Sparkline from '../components/Sparkline'
import OrderModal from '../components/OrderModal'
import { usePortfolio } from '../context/PortfolioContext'
import { marketIndicators } from '../data/mockData'
import { formatINR, formatPct, pnlClass } from '../lib/format'

const FILTERS = ['All', 'Gold', 'Silver', 'International']

function LogoBadge({ etf }) {
  const isGold = etf.logoColor === 'amber'
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
        isGold
          ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
          : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
      }`}
    >
      {etf.logo}
    </div>
  )
}

function ChangePill({ pct }) {
  const up = pct >= 0
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
        up ? 'text-emerald-600' : 'text-rose-500'
      }`}
    >
      {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
      {formatPct(pct)}
    </span>
  )
}

function SectionHeader({ title, onSeeMore }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <button
        onClick={onSeeMore}
        className="flex items-center gap-0.5 text-xs font-semibold text-amber-600 transition hover:text-amber-700"
      >
        See more <ChevronRight size={14} />
      </button>
    </div>
  )
}

export default function ExploreETFs() {
  const { etfs } = usePortfolio()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [trade, setTrade] = useState(null)

  const zerodhaFunds = useMemo(
    () => etfs.filter((e) => e.amc === 'Zerodha Fund House'),
    [etfs],
  )
  const popularFunds = useMemo(
    () => etfs.filter((e) => ['GOLDBEES', 'SILVERBEES', 'TATSILV', 'ICICISILVER'].includes(e.symbol)),
    [etfs],
  )
  const mostBought = useMemo(
    () => [...etfs].sort((a, b) => b.buyCount - a.buyCount).slice(0, 4),
    [etfs],
  )

  function setCategoryFilter(cat) {
    setFilter(cat)
    setQuery('')
    requestAnimationFrame(() => {
      document.getElementById('all-etfs-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const rows = useMemo(() => {
    return etfs.filter((e) => {
      const q = query.toLowerCase()
      const matchesQuery =
        e.symbol.toLowerCase().includes(q) || e.name.toLowerCase().includes(q)
      const matchesFilter = filter === 'All' || e.category === filter
      return matchesQuery && matchesFilter
    })
  }, [etfs, query, filter])

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Market ticker */}
      <section className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <h3 className="text-xs font-bold tracking-wide text-muted uppercase">
            Live Market Indicators
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {marketIndicators.map((ind) => (
            <div
              key={ind.label}
              className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
            >
              <p className="text-[11px] font-medium text-muted">{ind.label}</p>
              <div className="mt-1 flex items-baseline gap-2">
                <p className="text-base font-bold text-ink">{ind.value}</p>
                <ChangePill pct={ind.changePct} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore categories */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-ink">Explore ETFs</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CategoryCard
            label="Gold"
            description="Track domestic gold prices"
            icon={Coins}
            bg="bg-amber-50"
            ring="ring-amber-200"
            iconColor="text-amber-700"
            onClick={() => setCategoryFilter('Gold')}
            active={filter === 'Gold'}
          />
          <CategoryCard
            label="Silver"
            description="Track domestic silver prices"
            icon={CircleDollarSign}
            bg="bg-slate-100"
            ring="ring-slate-300"
            iconColor="text-slate-600"
            onClick={() => setCategoryFilter('Silver')}
            active={filter === 'Silver'}
          />
          <CategoryCard
            label="International"
            description="Globally linked metal ETFs"
            icon={Globe}
            bg="bg-emerald-50"
            ring="ring-emerald-200"
            iconColor="text-emerald-700"
            onClick={() => setCategoryFilter('International')}
            active={filter === 'International'}
          />
        </div>
      </section>

      {/* Zerodha funds */}
      <section className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
        <SectionHeader title="ETFs by Zerodha" onSeeMore={() => setCategoryFilter('Gold')} />
        <div className="grid gap-3 sm:grid-cols-2">
          {zerodhaFunds.map((etf) => (
            <FundCard key={etf.id} etf={etf} onTrade={() => setTrade(etf)} />
          ))}
        </div>
      </section>

      {/* Popular ETFs */}
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <SectionHeader title="Popular ETFs" onSeeMore={() => setFilter('All')} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {popularFunds.map((etf) => (
            <PopularCard key={etf.id} etf={etf} onTrade={() => setTrade(etf)} />
          ))}
        </div>
      </section>

      {/* Most Bought */}
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <SectionHeader title="Most Bought ETFs" onSeeMore={() => setFilter('All')} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {mostBought.map((etf) => (
            <BoughtCard key={etf.id} etf={etf} onTrade={() => setTrade(etf)} />
          ))}
        </div>
      </section>

      {/* All ETFs table */}
      <section id="all-etfs-table" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-ink">All Gold &amp; Silver ETFs</h2>
          <div className="relative max-w-xs flex-1">
            <Search size={16} className="absolute top-2.5 left-3 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search GOLDBEES, SILVERBEES..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-ink outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
        </div>

        {/* Filter pills */}
        <div className="mb-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                filter === f
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <EtfTable rows={rows} onTrade={setTrade} />
      </section>

      {trade && <OrderModal asset={trade} onClose={() => setTrade(null)} />}
    </div>
  )
}

/* ---- Sub-components ---- */

function CategoryCard({ label, description, icon: Icon, bg, ring, iconColor, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition ${
        active
          ? 'border-amber-300 bg-amber-50 shadow-sm ring-1 ring-amber-200'
          : 'border-slate-100 bg-white hover:border-amber-200 hover:shadow-sm'
      }`}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg} ring-1 ${ring} ${iconColor}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-base font-bold text-ink">{label}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
    </button>
  )
}

function FundCard({ etf, onTrade }) {
  const navDelta = ((etf.ltp - etf.nav) / etf.nav) * 100
  return (
    <button
      onClick={onTrade}
      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 text-left transition hover:border-amber-300 hover:shadow-sm"
    >
      <LogoBadge etf={etf} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-ink">{etf.symbol}</p>
        <p className="truncate text-xs text-muted">{etf.name}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-ink">{formatINR(etf.ltp)}</p>
        <ChangePill pct={etf.changePct} />
      </div>
    </button>
  )
}

function PopularCard({ etf, onTrade }) {
  return (
    <button
      onClick={onTrade}
      className="rounded-xl border border-slate-100 bg-white p-4 text-left transition hover:border-amber-300 hover:shadow-sm"
    >
      <div className="flex items-center gap-2">
        <LogoBadge etf={etf} />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-ink">{etf.symbol}</p>
          <p className="truncate text-xs text-muted">{etf.amc}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Sparkline data={etf.spark} positive={etf.changePct >= 0} />
        <div className="text-right">
          <p className="text-sm font-semibold text-ink">{formatINR(etf.ltp)}</p>
          <ChangePill pct={etf.changePct} />
        </div>
      </div>
    </button>
  )
}

function BoughtCard({ etf, onTrade }) {
  const up = etf.changePct >= 0
  return (
    <button
      onClick={onTrade}
      className="relative rounded-xl border border-slate-100 bg-white p-4 text-left transition hover:border-amber-300 hover:shadow-sm"
    >
      <span className="absolute right-3 top-3 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 ring-1 ring-emerald-200">
        {etf.buyCount}+ buys
      </span>
      <div className="flex items-center gap-2">
        <LogoBadge etf={etf} />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-ink">{etf.symbol}</p>
          <p className="truncate text-xs text-muted">{etf.amc}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">{formatINR(etf.ltp)}</p>
        <span
          className={`inline-flex items-center gap-0.5 rounded-lg px-2 py-1 text-xs font-bold ${
            up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
          }`}
        >
          {up ? <ArrowUpRight size={13} /> : <TrendingDown size={13} />}
          {formatPct(etf.changePct)}
        </span>
      </div>
    </button>
  )
}

function EtfTable({ rows, onTrade }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="border-b border-slate-100 text-[11px] font-semibold tracking-wide text-muted uppercase">
          <tr>
            <th className="px-3 py-3">Company / Symbol</th>
            <th className="px-3 py-3 text-right">Market Price</th>
            <th className="px-3 py-3 text-right">1D Change</th>
            <th className="px-3 py-3 text-right">NAV / Delta</th>
            <th className="px-3 py-3 text-right">Volume</th>
            <th className="px-3 py-3 text-right">1Y Return</th>
            <th className="px-3 py-3 text-center">Trade</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const navDelta = ((row.ltp - row.nav) / row.nav) * 100
            return (
              <tr
                key={row.id}
                onClick={() => onTrade(row)}
                className="cursor-pointer border-b border-slate-100/70 transition last:border-0 hover:bg-amber-50/40"
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <LogoBadge etf={row} />
                    <div className="min-w-0">
                      <p className="font-semibold text-ink">{row.symbol}</p>
                      <p className="max-w-[200px] truncate text-xs text-muted">{row.name}</p>
                    </div>
                    <div className="hidden sm:block">
                      <Sparkline data={row.spark} positive={row.changePct >= 0} />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-right font-semibold text-ink">{formatINR(row.ltp)}</td>
                <td className="px-3 py-3 text-right">
                  <p className={`font-medium ${pnlClass(row.change)}`}>
                    {row.change >= 0 ? '+' : ''}{formatINR(row.change)}
                  </p>
                  <p className={`text-xs font-medium ${pnlClass(row.changePct)}`}>
                    {formatPct(row.changePct)}
                  </p>
                </td>
                <td className="px-3 py-3 text-right">
                  <p className="font-medium text-ink">{formatINR(row.nav)}</p>
                  <p className={`text-xs font-medium ${pnlClass(navDelta)}`}>
                    {navDelta >= 0 ? '+' : ''}{navDelta.toFixed(2)}%
                  </p>
                </td>
                <td className="px-3 py-3 text-right text-muted">{row.volume}</td>
                <td className={`px-3 py-3 text-right font-medium ${pnlClass(row.return1y)}`}>
                  {formatPct(row.return1y)}
                </td>
                <td className="px-3 py-3 text-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); onTrade(row) }}
                    className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700"
                  >
                    Buy
                  </button>
                </td>
              </tr>
            )
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-3 py-8 text-center text-sm text-muted">
                No ETFs match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center">
        <button className="flex items-center gap-1 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-100">
          View all ETFs <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
