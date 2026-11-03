import { usePortfolio } from '../context/PortfolioContext'
import { formatINR } from '../lib/format'

export default function Orders() {
  const { orders } = usePortfolio()

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-muted">Executed virtual trades across ETFs and bonds.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border text-[11px] tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Instrument</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Side</th>
                <th className="px-4 py-3 font-medium">Qty</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border/70 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                  <td className="px-4 py-3 text-muted">{o.time}</td>
                  <td className="px-4 py-3 font-medium">{o.symbol}</td>
                  <td className="px-4 py-3 text-muted">{o.type}</td>
                  <td className={`px-4 py-3 font-semibold ${o.side === 'BUY' ? 'text-gain' : 'text-loss'}`}>
                    {o.side}
                  </td>
                  <td className="px-4 py-3">{o.qty}</td>
                  <td className="px-4 py-3">{formatINR(o.price)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent">{o.status}</span>
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
