import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import AssetTable from '../components/AssetTable'
import OrderModal from '../components/OrderModal'
import { usePortfolio } from '../context/PortfolioContext'

const filters = ['All', 'Index', 'Sector', 'Commodity', 'Debt', 'International']

export default function ExploreETFs() {
  const { etfs } = usePortfolio()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [trade, setTrade] = useState(null)

  const rows = useMemo(() => {
    return etfs.filter((e) => {
      const q = query.toLowerCase()
      const matchesQuery = e.symbol.toLowerCase().includes(q) || e.name.toLowerCase().includes(q)
      const matchesFilter = filter === 'All' || e.category === filter
      return matchesQuery && matchesFilter
    })
  }, [etfs, query, filter])

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Explore ETFs</h1>
        <p className="mt-1 text-sm text-muted">Index, sector, gold, and international ETFs.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search size={16} className="absolute top-3 left-3 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search NIFTYBEES, GOLDBEES..."
            className="w-full rounded-xl border border-border bg-surface py-2.5 pr-3 pl-9 text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                filter === f ? 'bg-accent text-bg' : 'bg-surface text-muted hover:text-ink'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <AssetTable rows={rows} kind="etf" onTrade={setTrade} />
      {trade && <OrderModal asset={trade} onClose={() => setTrade(null)} />}
    </div>
  )
}
