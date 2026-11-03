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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <button className="absolute inset-0" onClick={onClose} aria-label="Close overlay" />
      <form
        onSubmit={submit}
        className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs tracking-wide text-muted uppercase">{asset.category}</p>
            <h3 className="text-lg font-semibold">{asset.symbol}</h3>
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

        <div className="mb-4 flex items-end justify-between rounded-xl bg-surface-2 px-4 py-3">
          <div>
            <p className="text-xs text-muted">LTP</p>
            <p className="text-xl font-semibold">{formatINR(asset.ltp)}</p>
          </div>
          <p className={`text-sm font-medium ${pnlClass(asset.changePct)}`}>
            {formatPct(asset.changePct)}
          </p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-bg p-1">
          {['BUY', 'SELL'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSide(s)}
              className={`rounded-lg py-2 text-sm font-semibold ${
                side === s
                  ? s === 'BUY'
                    ? 'bg-accent text-bg'
                    : 'bg-loss text-white'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <label className="mb-4 block text-sm">
          <span className="mb-1.5 block text-muted">Quantity</span>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 outline-none focus:border-accent"
          />
        </label>

        <div className="mb-4 space-y-1 text-sm text-muted">
          <div className="flex justify-between">
            <span>Order value</span>
            <span className="text-ink">{formatINR(value)}</span>
          </div>
          <div className="flex justify-between">
            <span>Available cash</span>
            <span className="text-ink">{formatINR(cash)}</span>
          </div>
          <div className="flex justify-between">
            <span>Holdings</span>
            <span className="text-ink">{holding?.qty ?? 0}</span>
          </div>
        </div>

        {message && <p className="mb-3 text-sm text-accent">{message}</p>}

        <button
          type="submit"
          className={`w-full rounded-xl py-2.5 text-sm font-semibold ${
            side === 'BUY' ? 'bg-accent text-bg' : 'bg-loss text-white'
          }`}
        >
          {side === 'BUY' ? 'Place buy order' : 'Place sell order'}
        </button>
      </form>
    </div>
  )
}
