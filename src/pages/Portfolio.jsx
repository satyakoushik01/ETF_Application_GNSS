import { useState } from 'react'
import { usePortfolio } from '../context/PortfolioContext'

export default function Portfolio() {
  const { positions, orders } = usePortfolio()
  const [activeTab, setActiveTab] = useState('positions') // 'positions' or 'orders'

  return (
    <div className="space-y-6 p-6">
      {/* Header & Navigation Tabs */}
      <div className="border-b border-border">
        <h1 className="text-2xl font-bold text-ink">Portfolio</h1>
        <p className="mt-1 text-sm text-muted">
          Track your current gold & silver holdings and order history.
        </p>

        <div className="mt-4 flex gap-6">
          <button
            onClick={() => setActiveTab('positions')}
            className={`pb-3 text-sm font-semibold transition ${
              activeTab === 'positions'
                ? 'border-b-2 border-amber-500 text-amber-700'
                : 'text-muted hover:text-ink'
            }`}
          >
            Holdings &amp; Positions ({positions?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-semibold transition ${
              activeTab === 'orders'
                ? 'border-b-2 border-amber-500 text-amber-700'
                : 'text-muted hover:text-ink'
            }`}
          >
            Order History ({orders?.length || 0})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'positions' ? (
        /* --- POSITIONS TABLE --- */
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted">
                <th className="py-3 px-2">Instrument</th>
                <th className="py-3 px-2">Qty</th>
                <th className="py-3 px-2">Avg</th>
                <th className="py-3 px-2">LTP</th>
                <th className="py-3 px-2">Invested</th>
                <th className="py-3 px-2">Current</th>
                <th className="py-3 px-2">P&amp;L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {positions?.map((pos) => (
                <tr key={pos.id || pos.symbol} className="hover:bg-surface-2">
                  <td className="py-3 px-2 font-semibold text-ink">{pos.symbol}</td>
                  <td className="py-3 px-2">{pos.qty}</td>
                  <td className="py-3 px-2">₹{pos.avgPrice}</td>
                  <td className="py-3 px-2">₹{pos.ltp}</td>
                  <td className="py-3 px-2">₹{pos.invested}</td>
                  <td className="py-3 px-2">₹{pos.current}</td>
                  <td className={`py-3 px-2 font-medium ${pos.pnl >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {pos.pnl >= 0 ? `+₹${pos.pnl}` : `-₹${Math.abs(pos.pnl)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* --- ORDERS TABLE --- */
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted">
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Time</th>
                <th className="py-3 px-2">Instrument</th>
                <th className="py-3 px-2">Side</th>
                <th className="py-3 px-2">Qty</th>
                <th className="py-3 px-2">Price</th>
                <th className="py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders?.map((ord) => (
                <tr key={ord.id} className="hover:bg-surface-2">
                  <td className="py-3 px-2 font-mono text-xs text-muted">{ord.id}</td>
                  <td className="py-3 px-2 text-xs">{ord.time}</td>
                  <td className="py-3 px-2 font-semibold text-ink">{ord.symbol}</td>
                  <td className="py-3 px-2">
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                      ord.side === 'BUY' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {ord.side}
                    </span>
                  </td>
                  <td className="py-3 px-2">{ord.qty}</td>
                  <td className="py-3 px-2">₹{ord.price}</td>
                  <td className="py-3 px-2">
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
                      {ord.status || 'Executed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}