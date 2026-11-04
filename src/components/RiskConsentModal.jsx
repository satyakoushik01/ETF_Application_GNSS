import { useState } from 'react'
import { ShieldAlert, Check } from 'lucide-react'

export default function RiskConsentModal({ userName, onAccept, onCancel }) {
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <button className="absolute inset-0" onClick={onCancel} aria-label="Close overlay" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <ShieldAlert size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-ink">Important Risk &amp; Investment Disclaimer</h3>
            <p className="mt-0.5 text-xs text-muted">
              Please read carefully before continuing
            </p>
          </div>
        </div>

        <div className="mb-5 max-h-56 overflow-y-auto rounded-xl bg-surface-2 p-4 text-sm leading-relaxed text-muted">
          <p className="mb-2 text-ink">
            Welcome{userName ? `, ${userName}` : ''}.
          </p>
          <p className="mb-2">
            Precious metals instruments — including Gold &amp; Silver ETFs, Sovereign Gold
            Bonds (SGBs), and precious-metal Mutual Funds — are subject to market risks.
            Their value fluctuates with commodity prices, currency movements, and broader
            economic conditions. Past performance does not guarantee future results.
          </p>
          <p className="mb-2">
            This platform is intended solely for <strong>educational paper-trading</strong>{' '}
            using virtual cash and simulated market data. No real money is involved, and
            nothing here constitutes investment advice or a recommendation to buy or sell
            any security.
          </p>
          <p>
            By continuing you acknowledge these risks and confirm that your activity is for
            learning purposes only.
          </p>
        </div>

        <label className="mb-5 flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 transition hover:bg-surface-2">
          <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-border bg-surface checked:border-amber-600 checked:bg-amber-600"
            />
            <Check
              size={14}
              className="pointer-events-none absolute text-white opacity-0 transition peer-checked:opacity-100"
            />
          </span>
          <span className="text-sm leading-snug text-ink">
            I understand the risks involved in trading precious metals and agree to proceed.
          </span>
        </label>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-muted transition hover:bg-surface-2 hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!agreed}
            onClick={onAccept}
            className="flex-1 rounded-xl bg-amber-600 py-2.5 text-sm font-bold text-white transition enabled:hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue to Platform
          </button>
        </div>
      </div>
    </div>
  )
}
