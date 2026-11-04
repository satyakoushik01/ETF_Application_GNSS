import Sparkline from './Sparkline'
import { formatINR, formatPct, pnlClass } from '../lib/format'

const kindConfig = {
  etf: {
    extraCols: [
      { key: 'category', label: 'Metal' },
      { key: 'return1y', label: '1Y Return', isPct: true },
      { key: 'expense', label: 'Expense' },
    ],
  },
  bond: {
    extraCols: [
      { key: 'coupon', label: 'Coupon', suffix: '%' },
      { key: 'maturity', label: 'Maturity' },
      { key: 'rating', label: 'Rating', isBadge: true },
    ],
  },
  mf: {
    extraCols: [
      { key: 'category', label: 'Metal' },
      { key: 'return1y', label: '1Y CAGR', isPct: true },
      { key: 'return3y', label: '3Y CAGR', isPct: true },
    ],
  },
}

function metalBadge(category) {
  const isGold = category === 'Gold'
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-xs font-medium ${
        isGold ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
      }`}
    >
      {category}
    </span>
  )
}

export default function AssetTable({ rows, kind, onTrade }) {
  const config = kindConfig[kind] || kindConfig.etf

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border text-[11px] font-semibold tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3">Instrument</th>
              {config.extraCols.map((col) => (
                <th key={col.key} className="px-4 py-3">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3">LTP</th>
              <th className="px-4 py-3">Change</th>
              <th className="px-4 py-3">Trend</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/60 transition last:border-0 hover:bg-amber-50/40"
              >
                <td className="px-4 py-3">
                  <p className="font-semibold text-ink">{row.symbol}</p>
                  <p className="max-w-[260px] truncate text-xs text-muted">{row.name}</p>
                </td>
                {config.extraCols.map((col) => {
                  const val = row[col.key]
                  return (
                    <td key={col.key} className="px-4 py-3">
                      {col.isBadge ? (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {val}
                        </span>
                      ) : col.key === 'category' ? (
                        metalBadge(val)
                      ) : col.isPct ? (
                        <span className={`font-medium ${pnlClass(val)}`}>
                          {formatPct(val)}
                        </span>
                      ) : col.suffix ? (
                        `${val}${col.suffix}`
                      ) : (
                        val
                      )}
                    </td>
                  )
                })}
                <td className="px-4 py-3 font-semibold text-ink">{formatINR(row.ltp)}</td>
                <td className={`px-4 py-3 font-medium ${pnlClass(row.changePct)}`}>
                  {formatPct(row.changePct)}
                </td>
                <td className="px-4 py-3">
                  <Sparkline data={row.spark} positive={row.changePct >= 0} />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onTrade(row)}
                    className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700"
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
