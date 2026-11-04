import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Coins, UserPlus, LogIn, Eye, EyeOff, ShieldCheck, ChevronDown, KeyRound, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import RiskConsentModal from '../components/RiskConsentModal'

const TABS = {
  SIGNUP: 'signup',
  LOGIN: 'login',
}

export default function Welcome() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState(TABS.SIGNUP)
  const [showPin, setShowPin] = useState(false)
  const [showKitePin, setShowKitePin] = useState(false)
  const [zerodhaOpen, setZerodhaOpen] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    pin: '',
    loginId: '',
    password: '',
    zerodhaClientId: '',
    kitePin: '',
  })
  const [error, setError] = useState('')
  const [zerodhaError, setZerodhaError] = useState('')
  const [pendingProfile, setPendingProfile] = useState(null)

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (tab === TABS.SIGNUP) {
      if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.pin.trim()) {
        setError('Please fill in all fields to create your account.')
        return
      }
      if (form.pin.length < 4) {
        setError('PIN must be at least 4 digits.')
        return
      }
      setPendingProfile({
        name: form.fullName.trim(),
        email: form.email.trim(),
        provider: 'New Demat',
      })
    } else {
      if (!form.loginId.trim() || !form.password.trim()) {
        setError('Enter your Email / User ID and PIN.')
        return
      }
      setPendingProfile({
        name: form.loginId.trim(),
        email: form.loginId.trim(),
        provider: 'Website',
      })
    }
  }

  function handleZerodhaAuthorize(e) {
    e.preventDefault()
    setZerodhaError('')
    if (!form.zerodhaClientId.trim() || !form.kitePin.trim()) {
      setZerodhaError('Enter your Zerodha Client ID / API Key and Kite PIN.')
      return
    }
    setPendingProfile({
      name: form.zerodhaClientId.trim(),
      email: '',
      provider: 'Zerodha',
    })
  }

  function acceptConsent() {
    const profile = {
      ...pendingProfile,
      consentAt: new Date().toISOString(),
    }
    login(profile)
    setPendingProfile(null)
    navigate('/', { replace: true })
  }

  function cancelConsent() {
    setPendingProfile(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface lg:flex-row">
      {/* Brand panel */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50/40 p-12 lg:flex">
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-base font-bold text-white shadow-sm">
            Au
          </div>
          <div>
            <p className="text-lg font-bold leading-none text-ink">GoldN Silver</p>
            <p className="mt-1 text-xs text-muted">Precious Metals Trading</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <Coins size={24} />
          </div>
          <h1 className="text-3xl font-bold leading-tight text-ink">
            Trade gold &amp; silver, risk-free.
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Practice with virtual cash across ETFs, Sovereign Gold Bonds, and mutual funds.
            Learn the markets before you ever spend a real rupee.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-amber-700">
            <ShieldCheck size={16} />
            Educational paper-trading only
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm font-semibold text-amber-800 shadow-sm backdrop-blur">
            <Coins size={16} className="text-amber-600" />
            Our official Trading partner is Zerodha.
          </div>
        </div>

        <p className="relative text-xs text-muted">
          No real money. No real trades. Just real learning.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-surface px-5 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-white shadow-sm">
              Au
            </div>
            <div>
              <p className="text-base font-bold leading-none text-ink">GoldN Silver</p>
              <p className="mt-0.5 text-[11px] text-muted">Precious Metals Trading</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-ink">Welcome</h2>
          <p className="mt-1 text-sm text-muted">
            Create an account or log in to start paper trading.
          </p>

          {/* Tabs */}
          <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-surface-2 p-1">
            <button
              type="button"
              onClick={() => { setTab(TABS.SIGNUP); setError('') }}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
                tab === TABS.SIGNUP
                  ? 'bg-surface text-ink shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <UserPlus size={16} />
              Create new demat
            </button>
            <button
              type="button"
              onClick={() => { setTab(TABS.LOGIN); setError('') }}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
                tab === TABS.LOGIN
                  ? 'bg-surface text-ink shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <LogIn size={16} />
              Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {tab === TABS.SIGNUP ? (
              <>
                <Field
                  label="Full Name"
                  value={form.fullName}
                  onChange={(v) => update('fullName', v)}
                  placeholder="Arjun Mehta"
                  autoComplete="name"
                />
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => update('email', v)}
                  placeholder="arjun@example.com"
                  autoComplete="email"
                />
                <Field
                  label="Phone Number"
                  type="tel"
                  value={form.phone}
                  onChange={(v) => update('phone', v)}
                  placeholder="98765 43210"
                  autoComplete="tel"
                />
                <PinField
                  label="Desired PIN"
                  value={form.pin}
                  onChange={(v) => update('pin', v)}
                  show={showPin}
                  onToggle={() => setShowPin((s) => !s)}
                  placeholder="••••"
                  autoComplete="new-password"
                />
              </>
            ) : (
              <>
                <Field
                  label="Email / User ID"
                  value={form.loginId}
                  onChange={(v) => update('loginId', v)}
                  placeholder="arjun@example.com"
                  autoComplete="username"
                />
                <PinField
                  label="PIN / Password"
                  value={form.password}
                  onChange={(v) => update('password', v)}
                  show={showPin}
                  onToggle={() => setShowPin((s) => !s)}
                  placeholder="••••••"
                  autoComplete="current-password"
                />
              </>
            )}

            {error && (
              <p className="text-sm font-medium text-loss">{error}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-amber-600 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700"
            >
              {tab === TABS.SIGNUP ? 'Create Demat Account' : 'Login'}
            </button>
          </form>

          {/* Zerodha integration panel */}
          <div className="mt-5 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => { setZerodhaOpen((o) => !o); setZerodhaError('') }}
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-ink transition hover:bg-surface-2"
            >
              <span className="flex items-center gap-2">
                <KeyRound size={16} className="text-amber-600" />
                Login with Zerodha demat
              </span>
              <ChevronDown
                size={16}
                className={`text-muted transition ${zerodhaOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {zerodhaOpen && (
              <form onSubmit={handleZerodhaAuthorize} className="space-y-4 border-t border-border p-4">
                <Field
                  label="Zerodha Client ID / API Key"
                  value={form.zerodhaClientId}
                  onChange={(v) => update('zerodhaClientId', v)}
                  placeholder="AB1234 or your API key"
                  autoComplete="off"
                />
                <PinField
                  label="Kite PIN"
                  value={form.kitePin}
                  onChange={(v) => update('kitePin', v)}
                  show={showKitePin}
                  onToggle={() => setShowKitePin((s) => !s)}
                  placeholder="••••"
                  autoComplete="off"
                />

                {zerodhaError && (
                  <p className="text-sm font-medium text-loss">{zerodhaError}</p>
                )}

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 py-2.5 text-sm font-bold text-amber-700 transition hover:bg-amber-100"
                >
                  <ExternalLink size={16} />
                  Authorize with Zerodha
                </button>

                <p className="text-center text-xs leading-relaxed text-muted">
                  You will be redirected to Zerodha Kite to authorize access to your demat
                  account. This is a simulated connection for paper-trading only.
                </p>
              </form>
            )}
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted">
            By continuing you accept the risk disclaimer. This is an educational
            paper-trading platform — no real money is used.
          </p>
        </div>
      </div>

      {pendingProfile && (
        <RiskConsentModal
          userName={pendingProfile.name}
          onAccept={acceptConsent}
          onCancel={cancelConsent}
        />
      )}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text', autoComplete }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-ink outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
      />
    </label>
  )
}

function PinField({ label, value, onChange, show, onToggle, placeholder, autoComplete }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-muted">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 pr-10 text-ink outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted hover:text-ink"
          aria-label={show ? 'Hide' : 'Show'}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  )
}
