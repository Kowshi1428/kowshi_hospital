import React from 'react'
import { Menu, Search, Bell, ChevronDown, Plus, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export default function Topbar({ onMenuClick, title, subtitle }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userName = user.name || 'Admin'
  const userInitials = userName.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()

  const handleSignOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-secondary lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="hidden min-w-0 lg:block">
        <h1 className="truncate font-display text-base font-bold text-foreground">{title}</h1>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="relative ml-auto flex max-w-md flex-1 items-center lg:ml-6">
        <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-muted-foreground" />
        <Input placeholder="Search patients, doctors, records…" className="pl-9" />
      </div>

      <Button size="sm" className="hidden sm:inline-flex">
        <Plus className="h-3.5 w-3.5" />
        New Patient
      </Button>

      <button className="relative rounded-lg border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
        <Bell className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-border py-1 pl-1 pr-2 hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar className="h-7 w-7">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-medium leading-tight text-foreground">{userName}</p>
            <p className="text-[10px] leading-tight text-muted-foreground">Hospital Admin</p>
          </div>
          <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile settings</DropdownMenuItem>
          <DropdownMenuItem>Notification preferences</DropdownMenuItem>
          <DropdownMenuItem>Shift schedule</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleSignOut}>
            <LogOut className="h-3.5 w-3.5 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
