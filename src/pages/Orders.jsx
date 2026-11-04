import { usePortfolio } from '../context/PortfolioContext'
import { formatINR } from '../lib/format'

export default function Orders() {
  const { orders } = usePortfolio()

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Orders</h1>
        <p className="mt-1 text-sm text-muted">
          Executed virtual trades across gold and silver instruments.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border text-[11px] font-semibold tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Instrument</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Side</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-border/60 transition last:border-0 hover:bg-amber-50/40"
                >
                  <td className="px-4 py-3 font-mono text-xs text-ink">{o.id}</td>
                  <td className="px-4 py-3 text-muted">{o.time}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{o.symbol}</td>
                  <td className="px-4 py-3 text-muted">{o.type}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${o.side === 'BUY' ? 'text-gain' : 'text-loss'}`}
                  >
                    {o.side}
                  </td>
                  <td className="px-4 py-3 text-ink">{o.qty}</td>
                  <td className="px-4 py-3 text-ink">{formatINR(o.price)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
