import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Stethoscope,
  Pill,
  Receipt,
  BedDouble,
  FlaskConical,
  Settings,
  Activity,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { hospital } from '@/data/mockData'

const nav = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/appointments', label: 'Appointments', icon: CalendarClock },
  { to: '/doctors', label: 'Doctors & Staff', icon: Stethoscope },
  { to: '/wards', label: 'Wards & Beds', icon: BedDouble },
  { to: '/laboratory', label: 'Laboratory', icon: FlaskConical },
  { to: '/pharmacy', label: 'Pharmacy', icon: Pill },
  { to: '/billing', label: 'Billing', icon: Receipt },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card/95 backdrop-blur transition-transform duration-300 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-cyan shadow-glow">
              <Activity className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-display text-sm font-bold leading-tight text-foreground">{hospital.name}</p>
              <p className="text-[11px] leading-tight text-muted-foreground">{hospital.tagline}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-accent lg:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        <Separator />

        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin px-3 py-4">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary-500/12 text-primary-300 shadow-[inset_0_0_0_1px_rgba(62,107,250,0.25)]'
                    : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn('h-4 w-4 shrink-0 transition-colors', isActive ? 'text-primary-400' : 'text-muted-foreground group-hover:text-foreground')}
                  />
                  <span>{item.label}</span>
                  {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-400 shadow-glow" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <div className="rounded-xl border border-border bg-secondary/50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">System Status</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="text-xs text-foreground">All systems operational</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

function Separator() {
  return <div className="mx-5 h-px bg-border" />
}
