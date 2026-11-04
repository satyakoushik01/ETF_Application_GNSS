import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Compass,
  Briefcase,
  Receipt,
  X,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/etfs', label: 'Gold & Silver ETFs', icon: Compass },
  { to: '/portfolio', label: 'Portfolio', icon: Briefcase },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/welcome', { replace: true })
  }

  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}
      <aside
        className={`inset-y-0 left-0 z-40 w-64 flex-col border-r border-border bg-surface ${
          open ? 'fixed flex' : 'hidden lg:static lg:flex'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-white shadow-sm">
              Au
            </div>
            <div>
              <p className="text-sm font-bold leading-none text-ink">GoldN Silver</p>
              <p className="mt-0.5 text-[11px] text-muted">Precious Metals Trading</p>
            </div>
          </div>
          <button className="rounded-md p-1 text-muted lg:hidden" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <nav className="mt-3 flex-1 space-y-1 px-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-muted hover:bg-surface-2 hover:text-ink'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="m-3 space-y-3">
          <div className="rounded-xl border border-border bg-surface-2 p-3">
            <p className="text-[11px] font-medium tracking-wide text-muted uppercase">
              Signed in
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-ink">{user?.name}</p>
            <p className="text-[11px] text-muted">{user?.provider}</p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-[11px] font-semibold tracking-wide text-amber-700 uppercase">
              Paper Trading
            </p>
            <p className="mt-1 text-sm leading-snug text-amber-800">
              Virtual cash · mock gold &amp; silver
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-ink"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>
    </>
  )
}