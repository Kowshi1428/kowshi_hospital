import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Stethoscope,
  BedDouble,
  FlaskConical,
  Pill,
  Receipt,
  Settings as SettingsIcon,
  Activity,
  Menu,
  X,
  Bell,
  Search,
  Plus,
  ChevronDown,
  LogOut
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { hospital } from '@/data/mockData'

const navItems = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/appointments', label: 'Appointments', icon: CalendarClock },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/wards', label: 'Wards', icon: BedDouble },
  { to: '/laboratory', label: 'Laboratory', icon: FlaskConical },
  { to: '/pharmacy', label: 'Pharmacy', icon: Pill },
  { to: '/billing', label: 'Billing', icon: Receipt },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

export default function Navbar() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isPatient = user.role === 'patient'
  
  const userName = user.name || 'Admin'
  const userInitials = userName.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()

  const handleSignOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const activeNavItems = isPatient
    ? [
        { to: '/', label: 'My Dashboard', icon: LayoutDashboard, end: true },
        { to: '/appointments', label: 'My Appointments', icon: CalendarClock },
        { to: '/laboratory', label: 'Medical Records', icon: FlaskConical },
        { to: '/billing', label: 'My Invoices', icon: Receipt },
      ]
    : navItems

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-cyan shadow-glow">
              <Activity className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-sm font-bold leading-tight text-foreground">{hospital.name}</p>
              <p className="text-[10px] leading-tight text-muted-foreground">{hospital.tagline}</p>
            </div>
          </NavLink>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {activeNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                    isActive
                      ? 'bg-primary-500/10 text-primary-300 border border-primary-500/20 font-semibold'
                      : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
                  )
                }
              >
                <item.icon className="h-3.5 w-3.5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Section Actions & User */}
        <div className="flex items-center gap-3">
          
          {/* Search box (collapsible on mobile, hidden for patients) */}
          {!isPatient && (
            <div className="relative hidden md:flex max-w-[200px] items-center">
              <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input 
                placeholder="Search records..." 
                className="pl-8 h-8 text-xs bg-slate-900 border-border focus-visible:ring-1 focus-visible:ring-primary-500" 
              />
            </div>
          )}

          {!isPatient && (
            <Button size="sm" className="h-8 text-xs hidden sm:inline-flex gap-1" onClick={() => navigate('/patients')}>
              <Plus className="h-3.5 w-3.5" />
              New Patient
            </Button>
          )}

          {/* Notification Bell */}
          <button className="relative rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-destructive" />
          </button>

          {/* User Account Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-border py-1 pl-1 pr-2 hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-medium leading-tight text-foreground">{userName}</p>
                <p className="text-[9px] leading-tight text-muted-foreground">
                  {isPatient ? 'Patient Portal' : 'Hospital Staff'}
                </p>
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-border">
              <DropdownMenuLabel className="text-xs text-muted-foreground">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              {!isPatient && (
                <DropdownMenuItem className="text-xs focus:bg-slate-800" onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-xs focus:bg-slate-800" onClick={() => navigate('/')}>Dashboard</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="text-xs text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={handleSignOut}>
                <LogOut className="h-3.5 w-3.5 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-secondary xl:hidden"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-border bg-slate-950/95 py-3 px-4 space-y-1 animate-slide-down">
          {activeNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary-500/10 text-primary-300 font-semibold'
                    : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          
          {!isPatient && (
            <div className="pt-2 border-t border-border mt-2">
              <Button size="sm" className="w-full text-xs gap-1 py-1.5 h-auto" onClick={() => { setMobileMenuOpen(false); navigate('/patients') }}>
                <Plus className="h-3.5 w-3.5" />
                New Patient Registration
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
