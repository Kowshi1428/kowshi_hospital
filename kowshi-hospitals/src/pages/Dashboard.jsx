import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  Users,
  BedDouble,
  Clock,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
  UserPlus,
  FlaskConical,
  Pill,
  Receipt,
  Stethoscope,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import StatCard from '@/components/dashboard/StatCard'
import PulseStrip from '@/components/dashboard/PulseStrip'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import {
  kpis as mockKpis,
  admissionsTrend as mockAdmissionsTrend,
  revenueTrend as mockRevenueTrend,
  departments as mockDepartments,
  bedOccupancy as mockBedOccupancy,
  activityFeed as mockActivityFeed,
  appointments as mockAppointments,
  staffOnDuty as mockStaffOnDuty,
} from '@/data/mockData'
import { cn, formatCurrency, initials } from '@/lib/utils'

const activityIcon = {
  admission: UserPlus,
  inventory: Pill,
  lab: FlaskConical,
  billing: Receipt,
  discharge: Stethoscope,
  appointment: Clock,
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    kpis: mockKpis,
    admissionsTrend: mockAdmissionsTrend,
    revenueTrend: mockRevenueTrend,
    departments: mockDepartments,
    bedOccupancy: mockBedOccupancy,
    activityFeed: mockActivityFeed,
    appointments: mockAppointments,
    staffOnDuty: mockStaffOnDuty,
  })

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isPatient = user.role === 'patient'

  useEffect(() => {
    let active = true
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard')
        if (active) {
          setDashboardData(res)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
        if (active) {
          setLoading(false)
        }
      }
    }
    fetchData()
    return () => { active = false }
  }, [])

  if (isPatient) {
    const { patient, appointments = [], laboratory = [], invoices = [] } = dashboardData
    if (loading || !patient) {
      return <div className="py-20 text-center text-sm text-muted-foreground">Loading patient profile...</div>
    }

    const unpaidTotal = invoices.filter(inv => inv.status !== 'Paid').reduce((sum, inv) => sum + inv.amount, 0)
    
    return (
      <div className="space-y-6">
        {/* Patient Hero / welcome strip */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-cyan/10" />
          <CardContent className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <Badge variant="default" className="mb-3 bg-cyan text-slate-950 font-bold hover:bg-cyan/90">
                Patient Account Active
              </Badge>
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                Welcome back, <span className="text-gradient">{patient.name}</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your medical record ID is <span className="text-foreground font-mono font-semibold">{patient.id}</span>. 
                Please keep your primary contact number <span className="text-foreground font-mono">{patient.phone}</span> updated.
              </p>
            </div>
            
            <div className="w-full max-w-sm rounded-2xl border border-border bg-background/40 p-4 lg:w-80 flex flex-col gap-1 justify-center">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Outstanding Bills</span>
              <span className="text-2xl font-bold font-display text-foreground">{formatCurrency(unpaidTotal)}</span>
              <span className="text-[10px] text-slate-400 mt-1">Settle payments instantly via My Invoices tab</span>
            </div>
          </CardContent>
        </Card>

        {/* 3D stats row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Account Status" value={patient.status} icon={UserPlus} tone={patient.status === 'Discharged' ? 'success' : 'primary'} />
          <StatCard label="Assigned Doctor" value={patient.doctor || '—'} icon={Stethoscope} tone="cyan" />
          <StatCard label="Location / Room" value={patient.room || '—'} icon={BedDouble} tone="warning" />
          <StatCard label="Department" value={patient.department} icon={Activity} tone="success" />
        </div>

        {/* Dynamic Patient Details & Records Grid */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          
          {/* Appointments section */}
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My Appointments</CardTitle>
                <CardDescription>Scheduled consultations and clinical follow-ups</CardDescription>
              </div>
              <Button size="sm" onClick={() => navigate('/appointments')}>
                Book Consultation
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-t border-border overflow-x-auto">
                <table className="w-full text-left text-sm text-muted-foreground border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-secondary/20">
                      <th className="p-3 text-xs font-semibold uppercase text-slate-400">ID</th>
                      <th className="p-3 text-xs font-semibold uppercase text-slate-400">Doctor</th>
                      <th className="p-3 text-xs font-semibold uppercase text-slate-400">Department</th>
                      <th className="p-3 text-xs font-semibold uppercase text-slate-400">Date & Time</th>
                      <th className="p-3 text-xs font-semibold uppercase text-slate-400">Type</th>
                      <th className="p-3 text-xs font-semibold uppercase text-slate-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="border-b border-border/60 hover:bg-secondary/20 transition-all">
                        <td className="p-3 font-mono text-xs text-foreground">{apt.id}</td>
                        <td className="p-3 font-medium text-foreground">{apt.doctor}</td>
                        <td className="p-3 text-xs">{apt.department}</td>
                        <td className="p-3 text-xs">{apt.date} at {apt.time}</td>
                        <td className="p-3 text-xs">{apt.type}</td>
                        <td className="p-3 text-xs">
                          <Badge variant={apt.status === 'Confirmed' ? 'success' : apt.status === 'Cancelled' ? 'destructive' : 'warning'}>
                            {apt.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          No appointments booked.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Diagnostic & Lab results */}
          <Card>
            <CardHeader>
              <CardTitle>Medical & Lab Reports</CardTitle>
              <CardDescription>Recent diagnostic test logs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {laboratory.map((lab) => (
                <div key={lab.id} className="flex items-start gap-3 border-b border-border/40 pb-3 last:border-0 last:pb-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                    <FlaskConical className="h-4 w-4 text-cyan" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start gap-1">
                      <p className="text-xs font-semibold text-foreground truncate">{lab.test}</p>
                      <Badge variant={lab.status === 'Completed' ? 'success' : 'warning'} className="text-[9px] px-1.5 py-0">
                        {lab.status}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{lab.doctor} · {lab.department}</p>
                    <p className="text-[10px] font-mono text-slate-300 mt-1 bg-slate-950 p-1.5 rounded border border-slate-800">
                      Result: <span className="font-semibold text-white">{lab.result}</span>
                    </p>
                  </div>
                </div>
              ))}
              {laboratory.length === 0 && (
                <p className="text-xs text-center text-muted-foreground py-6">No diagnostic test logs on record.</p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    )
  }

  const {
    kpis,
    admissionsTrend,
    revenueTrend,
    departments,
    bedOccupancy,
    activityFeed,
    appointments,
    staffOnDuty,
  } = dashboardData
  return (
    <div className="space-y-6">
      {/* Hero / vitals strip */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-cyan/10" />
        <CardContent className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <Badge variant="default" className="mb-3">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-400" />
              </span>
              Live · Anna Nagar Campus
            </Badge>
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Good morning, Sathya. <span className="text-gradient">27 admissions</span> today.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Bed occupancy is at {kpis.bedOccupancyRate}% across all wards. {kpis.criticalAlerts} patients are flagged
              critical and 2 pharmacy items need urgent reorder.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm">
                <UserPlus className="h-3.5 w-3.5" />
                Admit Patient
              </Button>
              <Button size="sm" variant="secondary">
                View critical alerts
              </Button>
            </div>
          </div>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background/40 p-4 lg:w-80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Ward Pulse</span>
              <span className="font-mono text-muted-foreground">72 bpm avg</span>
            </div>
            <PulseStrip className="mt-2 h-10 w-full" />
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>Now</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Patients" value={kpis.totalPatients.toLocaleString()} delta={4.2} deltaLabel="vs last month" icon={Users} tone="primary" />
        <StatCard label="Bed Occupancy" value={kpis.bedOccupancyRate} suffix="%" delta={2.1} deltaLabel="vs last week" icon={BedDouble} tone="cyan" />
        <StatCard label="Avg. Wait Time" value={kpis.avgWaitTime} suffix="min" delta={-6.4} deltaLabel="vs last week" icon={Clock} tone="success" />
        <StatCard label="Revenue (MTD)" value={formatCurrency(kpis.revenueThisMonth)} delta={kpis.revenueChange} deltaLabel="vs last month" icon={IndianRupee} tone="warning" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Admissions vs Discharges</CardTitle>
              <CardDescription>Monthly patient flow, last 7 months</CardDescription>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground"><i className="h-2 w-2 rounded-full bg-primary-400 inline-block" /> Admissions</span>
              <span className="flex items-center gap-1.5 text-muted-foreground"><i className="h-2 w-2 rounded-full bg-cyan inline-block" /> Discharges</span>
            </div>
          </CardHeader>
          <CardContent className="h-72 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={admissionsTrend} margin={{ left: 4, right: 12, top: 4 }}>
                <defs>
                  <linearGradient id="admitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3e6bfa" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#3e6bfa" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dischargeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={36} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="admissions" stroke="#3e6bfa" strokeWidth={2} fill="url(#admitGrad)" />
                <Area type="monotone" dataKey="discharges" stroke="#22d3ee" strokeWidth={2} fill="url(#dischargeGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patients by Department</CardTitle>
            <CardDescription>Active caseload distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departments}
                  dataKey="patients"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {departments.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="-mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5">
              {departments.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: d.color }} />
                  <span className="truncate">{d.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Expenses</CardTitle>
            <CardDescription>Monthly financial performance (₹)</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrend} margin={{ left: 4, right: 12, top: 4 }} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  width={48}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<ChartTooltip currency />} />
                <Bar dataKey="revenue" fill="#3e6bfa" radius={[6, 6, 0, 0]} maxBarSize={28} />
                <Bar dataKey="expenses" fill="#334155" radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Live operational feed</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="max-h-64 space-y-4 overflow-y-auto scrollbar-thin pr-1">
            {activityFeed.map((item) => {
              const Icon = activityIcon[item.type] || Clock
              return (
                <div key={item.id} className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs leading-snug text-foreground">
                      <span className="font-medium">{item.actor}</span> {item.action}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: bed occupancy + appointments + staff */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Bed Occupancy by Ward</CardTitle>
              <CardDescription>Current census against capacity</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href="/wards" className="text-xs">
                View wards <ArrowRight className="h-3 w-3" />
              </a>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {bedOccupancy.map((w) => {
              const pct = Math.round((w.occupied / w.total) * 100)
              return (
                <div key={w.ward}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{w.ward}</span>
                    <span className="mono-tabular text-muted-foreground">
                      {w.occupied}/{w.total} beds · {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        pct > 90 ? 'bg-destructive' : pct > 70 ? 'bg-warning' : 'bg-primary-500'
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staff On Duty</CardTitle>
            <CardDescription>Current shift coverage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-border bg-secondary/40 p-3">
                <p className="font-display text-xl font-bold text-foreground">{staffOnDuty.doctors}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Doctors</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/40 p-3">
                <p className="font-display text-xl font-bold text-foreground">{staffOnDuty.nurses}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Nurses</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/40 p-3">
                <p className="font-display text-xl font-bold text-foreground">{staffOnDuty.support}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Support</p>
              </div>
            </div>
            <div className="rounded-xl border border-warning/25 bg-warning/5 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                <p className="text-xs text-warning/90">
                  ICU staffing is at 88% of recommended ratio for the night shift. Consider calling in relief staff.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's appointments table preview */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>{appointments.filter((a) => a.date === '2026-07-20').length} scheduled for July 20</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <a href="/appointments" className="text-xs">
              View all <ArrowRight className="h-3 w-3" />
            </a>
          </Button>
        </CardHeader>
        <CardContent className="space-y-1">
          {appointments
            .filter((a) => a.date === '2026-07-20')
            .map((a) => (
              <div
                key={a.id}
                className="flex flex-wrap items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary/40"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{initials(a.patient)}</AvatarFallback>
                </Avatar>
                <div className="min-w-[10rem] flex-1">
                  <p className="text-sm font-medium text-foreground">{a.patient}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.doctor} · {a.department}
                  </p>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{a.time}</span>
                <Badge variant="outline">{a.type}</Badge>
                <StatusBadge status={a.status} />
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    Confirmed: 'success',
    Pending: 'warning',
    Cancelled: 'destructive',
  }
  return <Badge variant={map[status] || 'outline'}>{status}</Badge>
}

function ChartTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-card">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="capitalize">{p.name}:</span>
          <span className="font-medium text-foreground mono-tabular">
            {currency ? formatCurrency(p.value) : p.value}
          </span>
        </p>
      ))}
    </div>
  )
}
