import { useState } from 'react'
import { X } from 'lucide-react'
import { formatINR, formatPct, pnlClass } from '../lib/format'
import { usePortfolio } from '../context/PortfolioContext'

export default function OrderModal({ asset, initialSide = 'BUY', onClose }) {
  const { cash, holdings, placeOrder } = usePortfolio()
  const [side, setSide] = useState(initialSide)
  const [qty, setQty] = useState(1)
  const [message, setMessage] = useState('')

  if (!asset) return null

  const holding = holdings.find((h) => h.asset.id === asset.id)
  const value = Number(qty || 0) * asset.ltp

  function submit(e) {
    e.preventDefault()
    const result = placeOrder({ asset, side, qty })
    setMessage(result.message)
    if (result.ok) {
      setTimeout(onClose, 700)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center">
      <button className="absolute inset-0" onClick={onClose} aria-label="Close overlay" />
      <form
        onSubmit={submit}
        className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted uppercase">
              {asset.category}
            </p>
            <h3 className="text-lg font-bold text-ink">{asset.symbol}</h3>
            <p className="text-sm text-muted">{asset.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-surface-2 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 flex items-end justify-between rounded-xl bg-amber-50 px-4 py-3">
          <div>
            <p className="text-xs text-amber-700">Last Traded Price</p>
            <p className="text-xl font-bold text-ink">{formatINR(asset.ltp)}</p>
          </div>
          <p className={`text-sm font-semibold ${pnlClass(asset.changePct)}`}>
            {formatPct(asset.changePct)}
          </p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-surface-2 p-1">
          {['BUY', 'SELL'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSide(s)}
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                side === s
                  ? s === 'BUY'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-loss text-white shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <label className="mb-4 block text-sm">
          <span className="mb-1.5 block font-medium text-muted">Quantity</span>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-ink outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          />
        </label>

        <div className="mb-4 space-y-1 text-sm text-muted">
          <div className="flex justify-between">
            <span>Order value</span>
            <span className="font-medium text-ink">{formatINR(value)}</span>
          </div>
          <div className="flex justify-between">
            <span>Available cash</span>
            <span className="font-medium text-ink">{formatINR(cash)}</span>
          </div>
          <div className="flex justify-between">
            <span>Holdings</span>
            <span className="font-medium text-ink">{holding?.qty ?? 0}</span>
          </div>
        </div>

        {message && <p className="mb-3 text-sm font-medium text-amber-700">{message}</p>}

        <button
          type="submit"
          className={`w-full rounded-xl py-2.5 text-sm font-bold transition ${
            side === 'BUY'
              ? 'bg-amber-600 text-white hover:bg-amber-700'
              : 'bg-loss text-white hover:bg-red-700'
          }`}
        >
          {side === 'BUY' ? 'Place buy order' : 'Place sell order'}
        </button>
      </form>
    </div>
  )
}
