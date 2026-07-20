import React, { useMemo, useState, useEffect } from 'react'
import { CalendarClock, Plus, Search, Clock3, Trash2, Check, X, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { initials } from '@/lib/utils'

const statusVariant = {
  Confirmed: 'success',
  Pending: 'warning',
  Cancelled: 'destructive',
}

const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Oncology',
  'General Medicine',
  'Maternity',
  'Emergency'
]

export default function Appointments() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isPatient = user.role === 'patient'

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  
  // Book Appointment Form State
  const [isBookOpen, setIsBookOpen] = useState(false)
  const [newAppt, setNewAppt] = useState({
    patient: isPatient ? user.name : '',
    doctor: '',
    department: 'General Medicine',
    date: new Date().toISOString().split('T')[0],
    time: '09:00 AM',
    type: 'Consultation'
  })
  const [formError, setFormError] = useState('')
  
  // Selected appointment for details/status updates
  const [selected, setSelected] = useState(null)

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments')
      setAppointments(res)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch appointments:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  // Extract unique sorted dates for Tab headers, fallback to today if empty
  const dates = useMemo(() => {
    const rawDates = [...new Set(appointments.map((a) => a.date))]
    if (rawDates.length === 0) {
      return [new Date().toISOString().split('T')[0]]
    }
    return rawDates.sort()
  }, [appointments])

  const [activeDate, setActiveDate] = useState('')

  // Sync activeDate with the first date when list loads
  useEffect(() => {
    if (dates.length > 0 && !activeDate) {
      setActiveDate(dates[0])
    }
  }, [dates, activeDate])

  const filtered = useMemo(() => {
    return appointments.filter(
      (a) =>
        a.date === activeDate &&
        (a.patient.toLowerCase().includes(query.toLowerCase()) ||
          a.doctor.toLowerCase().includes(query.toLowerCase()))
    )
  }, [appointments, activeDate, query])

  const counts = useMemo(() => {
    return {
      Confirmed: appointments.filter((a) => a.status === 'Confirmed').length,
      Pending: appointments.filter((a) => a.status === 'Pending').length,
      Cancelled: appointments.filter((a) => a.status === 'Cancelled').length,
    }
  }, [appointments])

  const handleBookSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!newAppt.patient || !newAppt.doctor || !newAppt.date || !newAppt.time) {
      setFormError('Please fill out all required fields')
      return
    }

    try {
      await api.post('/appointments', newAppt)
      setIsBookOpen(false)
      // Reset form fields
      setNewAppt({
        patient: isPatient ? user.name : '',
        doctor: '',
        department: 'General Medicine',
        date: new Date().toISOString().split('T')[0],
        time: '09:00 AM',
        type: 'Consultation'
      })
      fetchAppointments()
    } catch (err) {
      setFormError(err.message || 'Failed to book appointment')
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status })
      setSelected(null)
      fetchAppointments()
    } catch (err) {
      alert(err.message || 'Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and delete this appointment schedule?')) return
    try {
      await api.delete(`/appointments/${id}`)
      setSelected(null)
      fetchAppointments()
    } catch (err) {
      alert(err.message || 'Failed to delete appointment')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Appointment Schedule</h2>
          <p className="text-sm text-muted-foreground">{appointments.length} appointments across all departments</p>
        </div>
        <Button size="sm" onClick={() => setIsBookOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Book Appointment
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Confirmed</p>
            <p className="mt-1 font-display text-xl font-bold text-success">{counts.Confirmed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="mt-1 font-display text-xl font-bold text-warning">{counts.Pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Cancelled</p>
            <p className="mt-1 font-display text-xl font-bold text-destructive">{counts.Cancelled}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>Filter by date and search patient or doctor</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Loading schedules...
            </div>
          ) : (
            <Tabs value={activeDate} onValueChange={setActiveDate}>
              <TabsList>
                {dates.map((d) => (
                  <TabsTrigger key={d} value={d}>
                    {new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </TabsTrigger>
                ))}
              </TabsList>
              {dates.map((d) => (
                <TabsContent key={d} value={d} className="space-y-2">
                  {filtered.map((a) => (
                    <div
                      key={a.id}
                      className="flex flex-col gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-secondary/40 sm:flex-row sm:items-center cursor-pointer"
                      onClick={() => setSelected(a)}
                    >
                      <div className="flex items-center gap-3 sm:w-40">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500/10 text-primary-300">
                          <Clock3 className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-sm text-foreground">{a.time}</span>
                      </div>
                      <div className="flex flex-1 items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{initials(a.patient)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{a.patient}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {a.doctor} · {a.department}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Badge variant="outline">{a.type}</Badge>
                        <Badge variant={statusVariant[a.status]}>{a.status}</Badge>
                        <span className="font-mono text-[11px] text-muted-foreground">{a.id}</span>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(a.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <div className="flex flex-col items-center gap-2 py-10 text-center">
                      <CalendarClock className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No appointments match your search for this date.</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Book Appointment Dialog */}
      <Dialog open={isBookOpen} onOpenChange={setIsBookOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              Schedule a consultation or test appointment for a patient.
            </DialogDescription>
          </DialogHeader>
          {formError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg text-center">
              {formError}
            </div>
          )}
          <form onSubmit={handleBookSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Patient Name *</label>
              <Input
                value={newAppt.patient}
                onChange={(e) => setNewAppt({ ...newAppt, patient: e.target.value })}
                placeholder="Patient Full Name"
                disabled={isPatient}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Department</label>
                <select
                  value={newAppt.department}
                  onChange={(e) => setNewAppt({ ...newAppt, department: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-border text-sm text-white focus:outline-none"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Doctor Name *</label>
                <Input
                  value={newAppt.doctor}
                  onChange={(e) => setNewAppt({ ...newAppt, doctor: e.target.value })}
                  placeholder="Attending Specialist"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Date *</label>
                <Input
                  type="date"
                  value={newAppt.date}
                  onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Time *</label>
                <Input
                  value={newAppt.time}
                  onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })}
                  placeholder="e.g. 09:30 AM"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Appointment Type</label>
              <select
                value={newAppt.type}
                onChange={(e) => setNewAppt({ ...newAppt, type: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-border text-sm text-white focus:outline-none"
              >
                <option value="Consultation">Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Lab Review">Lab Review</option>
                <option value="Chemotherapy">Chemotherapy</option>
                <option value="Diagnostic">Diagnostic</option>
              </select>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsBookOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Schedule Appointment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Appointment Detail / Status Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-[400px]">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10 text-primary-300">
                    <CalendarClock className="h-5 w-5" />
                  </div>
                  <div>
                    <DialogTitle>{selected.patient}</DialogTitle>
                    <DialogDescription className="font-mono text-xs">{selected.id}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-3 py-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Attending Specialist</span>
                  <span className="font-medium text-foreground">{selected.doctor}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Department</span>
                  <span className="font-medium text-foreground">{selected.department}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Scheduled Slot</span>
                  <span className="font-medium text-foreground">{selected.date} at {selected.time}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Visit Type</span>
                  <span className="font-medium text-foreground">{selected.type}</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-muted-foreground">Current Status</span>
                  <Badge variant={statusVariant[selected.status]}>{selected.status}</Badge>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {!isPatient ? (
                  <>
                    <p className="text-xs font-medium text-muted-foreground">Modify Status</p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button size="sm" variant="success" className="flex items-center justify-center gap-1 text-[11px] h-9" onClick={() => handleStatusUpdate(selected.id, "Confirmed")}>
                        <Check className="h-3 w-3" /> Confirm
                      </Button>
                      <Button size="sm" variant="warning" className="flex items-center justify-center gap-1 text-[11px] h-9" onClick={() => handleStatusUpdate(selected.id, "Pending")}>
                        <AlertCircle className="h-3 w-3" /> Pending
                      </Button>
                      <Button size="sm" variant="destructive" className="flex items-center justify-center gap-1 text-[11px] h-9" onClick={() => handleStatusUpdate(selected.id, "Cancelled")}>
                        <X className="h-3 w-3" /> Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  selected.status !== 'Cancelled' && (
                    <Button size="sm" variant="destructive" className="w-full flex items-center justify-center gap-1.5 h-9" onClick={() => handleStatusUpdate(selected.id, "Cancelled")}>
                      <X className="h-3.5 w-3.5" /> Cancel Appointment
                    </Button>
                  )
                )}
              </div>

              {!isPatient && (
                <div className="mt-4 pt-4 border-t border-border flex justify-end">
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(selected.id)}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove Schedule
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
