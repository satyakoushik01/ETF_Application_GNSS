import { useState } from 'react'
import OrderModal from '../components/OrderModal'
import { usePortfolio } from '../context/PortfolioContext'
import { formatINR, formatPct, formatSignedINR, pnlClass } from '../lib/format'

export default function Portfolio() {
  const { holdings, netValue, invested, totalPnl } = usePortfolio()
  const [trade, setTrade] = useState(null)

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Portfolio</h1>
          <p className="mt-1 text-sm text-muted">Current ETF and bond positions.</p>
        </div>
        <p className={`text-sm font-medium ${pnlClass(totalPnl)}`}>
          {formatSignedINR(totalPnl)} ({invested ? formatPct((totalPnl / invested) * 100) : '0%'})
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-border text-[11px] tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Instrument</th>
                <th className="px-4 py-3 font-medium">Qty</th>
                <th className="px-4 py-3 font-medium">Avg</th>
                <th className="px-4 py-3 font-medium">LTP</th>
                <th className="px-4 py-3 font-medium">Invested</th>
                <th className="px-4 py-3 font-medium">Current</th>
                <th className="px-4 py-3 font-medium">P&L</th>
                <th className="px-4 py-3 font-medium">Day P&L</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.asset.id} className="border-b border-border/70 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{h.asset.symbol}</p>
                    <p className="text-xs text-muted">{h.asset.coupon ? 'Bond' : 'ETF'}</p>
                  </td>
                  <td className="px-4 py-3">{h.qty}</td>
                  <td className="px-4 py-3">{formatINR(h.avgPrice)}</td>
                  <td className="px-4 py-3">{formatINR(h.asset.ltp)}</td>
                  <td className="px-4 py-3">{formatINR(h.invested)}</td>
                  <td className="px-4 py-3">{formatINR(h.current)}</td>
                  <td className={`px-4 py-3 ${pnlClass(h.pnl)}`}>
                    {formatSignedINR(h.pnl)}
                    <span className="block text-xs">{formatPct(h.pnlPct)}</span>
                  </td>
                  <td className={`px-4 py-3 ${pnlClass(h.dayPnl)}`}>{formatSignedINR(h.dayPnl)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setTrade(h.asset)}
                      className="rounded-lg bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-bg text-sm">
                <td className="px-4 py-3 font-medium" colSpan={4}>
                  Total
                </td>
                <td className="px-4 py-3 font-medium">{formatINR(invested)}</td>
                <td className="px-4 py-3 font-medium">{formatINR(netValue)}</td>
                <td className={`px-4 py-3 font-medium ${pnlClass(totalPnl)}`}>
                  {formatSignedINR(totalPnl)}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {trade && <OrderModal asset={trade} initialSide="SELL" onClose={() => setTrade(null)} />}
    </div>
  )
}
