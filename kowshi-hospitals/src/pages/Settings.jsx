import React from 'react'
import { Building2, Bell, Shield, Palette, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

function Switch({ defaultChecked, className }) {
  return (
    <SwitchPrimitive.Root
      defaultChecked={defaultChecked}
      className={cn(
        'relative h-5 w-9 shrink-0 rounded-full bg-secondary border border-border transition-colors data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500',
        className
      )}
    >
      <SwitchPrimitive.Thumb className="block h-3.5 w-3.5 translate-x-0.5 rounded-full bg-white shadow transition-transform duration-200 data-[state=checked]:translate-x-[18px]" />
    </SwitchPrimitive.Root>
  )
}

const toggles = [
  { label: 'Critical patient alerts', description: 'Push notification when a patient is flagged critical', defaultChecked: true },
  { label: 'Pharmacy reorder alerts', description: 'Notify when stock falls below reorder threshold', defaultChecked: true },
  { label: 'Appointment reminders', description: 'Send reminders 24 hours before scheduled visits', defaultChecked: true },
  { label: 'Billing overdue notices', description: 'Weekly digest of overdue invoices', defaultChecked: false },
  { label: 'Staff shift change emails', description: 'Email summary at every shift handover', defaultChecked: false },
]

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage facility details and platform preferences</p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500/10 text-primary-300">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Facility Information</CardTitle>
            <CardDescription>Basic details shown across the platform</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Hospital name" defaultValue="Kowshi Hospitals" />
          <Field label="Campus" defaultValue="Anna Nagar Campus, Chennai" />
          <Field label="Registration ID" defaultValue="TN-HOSP-20191187" />
          <Field label="Support line" defaultValue="+91 44 4567 8900" />
          <Field label="Total bed capacity" defaultValue="292" />
          <Field label="Departments" defaultValue="6 active departments" />
          <div className="sm:col-span-2">
            <Button size="sm">Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose what the operations team is alerted about</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          {toggles.map((t, idx) => (
            <React.Fragment key={t.label}>
              <div className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </div>
                <Switch defaultChecked={t.defaultChecked} />
              </div>
              {idx < toggles.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Access & Roles</CardTitle>
              <CardDescription>Role-based permissions for staff accounts</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Admins, physicians, nurses, pharmacy and billing staff each have scoped access to relevant modules.</p>
            <Button size="sm" variant="secondary">
              Manage Roles
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Shift Schedule</CardTitle>
              <CardDescription>Default shift windows applied hospital-wide</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Morning 07:00–15:00 · Evening 15:00–23:00 · Night 23:00–07:00</p>
            <Button size="sm" variant="secondary">
              Edit Shifts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Field({ label, defaultValue }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <Input defaultValue={defaultValue} />
    </div>
  )
}
