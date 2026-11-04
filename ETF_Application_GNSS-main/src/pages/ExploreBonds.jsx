import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import AssetTable from '../components/AssetTable'
import OrderModal from '../components/OrderModal'
import { usePortfolio } from '../context/PortfolioContext'

const filters = ['All', 'SGB']

export default function ExploreBonds() {
  const { bonds } = usePortfolio()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [trade, setTrade] = useState(null)

  const rows = useMemo(() => {
    return bonds.filter((b) => {
      const q = query.toLowerCase()
      const matchesQuery =
        b.symbol.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q) ||
        b.issuer.toLowerCase().includes(q)
      const matchesFilter = filter === 'All' || b.category === filter
      return matchesQuery && matchesFilter
    })
  }, [bonds, query, filter])

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Sovereign Gold Bonds</h1>
        <p className="mt-1 text-sm text-muted">
          Government-backed gold bonds with 2.5% p.a. coupon and capital appreciation.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search size={16} className="absolute top-3 left-3 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search SGB 2031, SGB 2029..."
            className="w-full rounded-xl border border-border bg-surface py-2.5 pr-3 pl-9 text-sm text-ink outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === f
                  ? 'bg-amber-600 text-white'
                  : 'bg-surface text-muted hover:text-ink'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <AssetTable rows={rows} kind="bond" onTrade={setTrade} />
      {trade && <OrderModal asset={trade} onClose={() => setTrade(null)} />}
    </div>
  )
}
