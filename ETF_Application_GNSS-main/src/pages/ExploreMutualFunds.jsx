import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import AssetTable from '../components/AssetTable'
import OrderModal from '../components/OrderModal'
import { usePortfolio } from '../context/PortfolioContext'

const filters = ['All', 'Gold', 'Silver']

export default function ExploreMutualFunds() {
  const { mutualFunds } = usePortfolio()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [trade, setTrade] = useState(null)

  const rows = useMemo(() => {
    return mutualFunds.filter((m) => {
      const q = query.toLowerCase()
      const matchesQuery = m.symbol.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)
      const matchesFilter = filter === 'All' || m.category === filter
      return matchesQuery && matchesFilter
    })
  }, [mutualFunds, query, filter])

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Gold & Silver Mutual Funds</h1>
        <p className="mt-1 text-sm text-muted">
          Index funds and funds of funds (FoFs) tracking gold and silver.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search size={16} className="absolute top-3 left-3 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Gold FoF, Silver FoF..."
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

      <AssetTable rows={rows} kind="mf" onTrade={setTrade} />
      {trade && <OrderModal asset={trade} onClose={() => setTrade(null)} />}
    </div>
  )
}
