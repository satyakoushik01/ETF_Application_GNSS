import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Compass,
  Landmark,
  Briefcase,
  Receipt,
  X,
} from 'lucide-react'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/etfs', label: 'Explore ETFs', icon: Compass },
  { to: '/bonds', label: 'Explore Bonds', icon: Landmark },
  { to: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { to: '/orders', label: 'Orders', icon: Receipt },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}
      <aside
        className={`inset-y-0 left-0 z-40 w-64 flex-col border-r border-border bg-surface ${
          open ? 'fixed flex' : 'hidden lg:static lg:flex'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-bg">
              Æ
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">Aether</p>
              <p className="mt-0.5 text-[11px] text-muted">ETFs & Bonds</p>
            </div>
          </div>
          <button className="rounded-md p-1 text-muted lg:hidden" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <nav className="mt-2 flex-1 space-y-1 px-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-accent-dim text-accent'
                    : 'text-muted hover:bg-surface-2 hover:text-ink'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="m-3 rounded-xl border border-border bg-bg p-3">
          <p className="text-[11px] tracking-wide text-muted uppercase">Paper trading</p>
          <p className="mt-1 text-sm leading-snug">Virtual cash · mock NSE / BSE</p>
        </div>
      </aside>
    </>
  )
}
