import Sparkline from './Sparkline'
import { formatINR, formatPct, pnlClass } from '../lib/format'

export default function AssetTable({ rows, kind, onTrade }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-[11px] tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Instrument</th>
              {kind === 'bond' ? (
                <>
                  <th className="px-4 py-3 font-medium">Coupon</th>
                  <th className="px-4 py-3 font-medium">YTM</th>
                  <th className="px-4 py-3 font-medium">Rating</th>
                </>
              ) : (
                <>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">AUM</th>
                  <th className="px-4 py-3 font-medium">Expense</th>
                </>
              )}
              <th className="px-4 py-3 font-medium">LTP</th>
              <th className="px-4 py-3 font-medium">Change</th>
              <th className="px-4 py-3 font-medium">Trend</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border/70 last:border-0 hover:bg-surface-2/60">
                <td className="px-4 py-3">
                  <p className="font-medium">{row.symbol}</p>
                  <p className="max-w-[260px] truncate text-xs text-muted">{row.name}</p>
                </td>
                {kind === 'bond' ? (
                  <>
                    <td className="px-4 py-3">{row.coupon.toFixed(2)}%</td>
                    <td className="px-4 py-3 text-accent">{row.yield.toFixed(2)}%</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-bg px-2 py-0.5 text-xs">{row.rating}</span>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-muted">{row.category}</td>
                    <td className="px-4 py-3">{row.aum}</td>
                    <td className="px-4 py-3">{row.expense}%</td>
                  </>
                )}
                <td className="px-4 py-3 font-medium">{formatINR(row.ltp)}</td>
                <td className={`px-4 py-3 ${pnlClass(row.changePct)}`}>
                  {formatPct(row.changePct)}
                </td>
                <td className="px-4 py-3">
                  <Sparkline data={row.spark} positive={row.changePct >= 0} />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onTrade(row)}
                    className="rounded-lg bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent hover:text-bg"
                  >
                    Trade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
