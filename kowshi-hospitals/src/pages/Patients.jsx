import React, { useMemo, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, Plus, Phone, Eye, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { initials, formatDate } from '@/lib/utils'

const statusVariant = {
  Admitted: 'success',
  Outpatient: 'default',
  Discharged: 'outline',
}
const conditionVariant = {
  Critical: 'destructive',
  Stable: 'success',
  Recovering: 'warning',
  Recovered: 'outline',
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

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState('all')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(null)

  // Register Patient Form State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    department: 'General Medicine',
    doctor: '',
    status: 'Outpatient',
    room: '—',
    condition: 'Stable',
    phone: ''
  })
  const [formError, setFormError] = useState('')

  const location = useLocation()

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients')
      setPatients(res)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch patients:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('register') === 'true') {
      const statusParam = params.get('status') || 'Outpatient'
      setNewPatient(prev => ({
        ...prev,
        status: statusParam,
        room: statusParam === 'Admitted' ? '' : '—'
      }))
      setIsRegisterOpen(true)
    }
  }, [location])

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchesQuery =
        p.name.toLowerCase().includes(query.toLowerCase()) || p.id.toLowerCase().includes(query.toLowerCase())
      const matchesDept = dept === 'all' || p.department === dept
      const matchesStatus = status === 'all' || p.status === status
      return matchesQuery && matchesDept && matchesStatus
    })
  }, [patients, query, dept, status])

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!newPatient.name || !newPatient.age || !newPatient.doctor || !newPatient.phone) {
      setFormError('Please fill out all required fields')
      return
    }

    try {
      await api.post('/patients', newPatient)
      setIsRegisterOpen(false)
      setNewPatient({
        name: '',
        age: '',
        gender: 'Male',
        department: 'General Medicine',
        doctor: '',
        status: 'Outpatient',
        room: '—',
        condition: 'Stable',
        phone: ''
      })
      fetchPatients()
    } catch (err) {
      setFormError(err.message || 'Failed to register patient')
    }
  }

  const handleDeletePatient = async (mrn) => {
    if (!window.confirm('Are you sure you want to delete this patient record?')) return
    try {
      await api.delete(`/patients/${mrn}`)
      setSelected(null)
      fetchPatients()
    } catch (err) {
      alert(err.message || 'Failed to delete patient')
    }
  }

  const handleUpdateStatus = async (mrn, updatedFields) => {
    try {
      const updated = await api.put(`/patients/${mrn}`, updatedFields)
      setSelected(updated)
      fetchPatients()
    } catch (err) {
      alert(err.message || 'Failed to update patient record')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Patient Directory</h2>
          <p className="text-sm text-muted-foreground">{patients.length} total patients on record</p>
        </div>
        <Button size="sm" onClick={() => setIsRegisterOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Register Patient
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or MRN…"
              className="pl-9"
            />
          </div>
          <Select value={dept} onValueChange={setDept}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Admitted">Admitted</SelectItem>
              <SelectItem value="Outpatient">Outpatient</SelectItem>
              <SelectItem value="Discharged">Discharged</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{filtered.length} results</CardTitle>
          <CardDescription>Click a row to view the patient summary</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>MRN</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Attending</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    Loading patients directory...
                  </TableCell>
                </TableRow>
              ) : filtered.map((p) => (
                <TableRow key={p.id} className="cursor-pointer" onClick={() => setSelected(p)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{initials(p.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.age} yrs · {p.gender}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.id}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.department}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.doctor}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.room}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={conditionVariant[p.condition]}>{p.condition}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" onClick={() => setSelected(p)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeletePatient(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    No patients match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Register Patient Dialog */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Register New Patient</DialogTitle>
            <DialogDescription>
              Add a new patient profile to the care operations record directory.
            </DialogDescription>
          </DialogHeader>
          {formError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg text-center">
              {formError}
            </div>
          )}
          <form onSubmit={handleRegisterSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Full Name *</label>
                <Input
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  placeholder="e.g. Rahul Verma"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Age *</label>
                  <Input
                    type="number"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                    placeholder="54"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-border text-sm text-white focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Department</label>
                <select
                  value={newPatient.department}
                  onChange={(e) => setNewPatient({ ...newPatient, department: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-border text-sm text-white focus:outline-none"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Attending Doctor *</label>
                <Input
                  value={newPatient.doctor}
                  onChange={(e) => setNewPatient({ ...newPatient, doctor: e.target.value })}
                  placeholder="e.g. Dr. Priya Raman"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <select
                  value={newPatient.status}
                  onChange={(e) => {
                    const nextStatus = e.target.value;
                    setNewPatient({
                      ...newPatient,
                      status: nextStatus,
                      room: nextStatus === 'Admitted' ? '' : '—'
                    });
                  }}
                  className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-border text-sm text-white focus:outline-none"
                >
                  <option value="Admitted">Admitted</option>
                  <option value="Outpatient">Outpatient</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Room / Ward Bed</label>
                <Input
                  value={newPatient.room}
                  onChange={(e) => setNewPatient({ ...newPatient, room: e.target.value })}
                  placeholder="e.g. ICU-04"
                  disabled={newPatient.status !== 'Admitted'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Condition</label>
                <select
                  value={newPatient.condition}
                  onChange={(e) => setNewPatient({ ...newPatient, condition: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-border text-sm text-white focus:outline-none"
                >
                  <option value="Stable">Stable</option>
                  <option value="Recovering">Recovering</option>
                  <option value="Critical">Critical</option>
                  <option value="Recovered">Recovered</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Phone Number *</label>
                <Input
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                  placeholder="e.g. +91 98400 12345"
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsRegisterOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Registration</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View/Edit Summary Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback>{initials(selected.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle>{selected.name}</DialogTitle>
                    <DialogDescription className="font-mono">{selected.id}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                <InfoRow label="Age / Gender" value={`${selected.age} yrs · ${selected.gender}`} />
                <InfoRow label="Department" value={selected.department} />
                <InfoRow label="Attending Physician" value={selected.doctor} />
                <InfoRow label="Room / Bed" value={selected.room} />
                <InfoRow label="Admitted On" value={formatDate(selected.admitted || selected.createdAt)} />
                <InfoRow label="Contact" value={selected.phone} />
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <label className="text-xs font-medium text-muted-foreground">Update Patient Status</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <select
                    value={selected.status}
                    onChange={(e) => handleUpdateStatus(selected.id, { status: e.target.value })}
                    className="h-10 px-3 rounded-lg bg-slate-900 border border-border text-sm text-white focus:outline-none"
                  >
                    <option value="Admitted">Admitted</option>
                    <option value="Outpatient">Outpatient</option>
                    <option value="Discharged">Discharged</option>
                  </select>
                  <select
                    value={selected.condition}
                    onChange={(e) => handleUpdateStatus(selected.id, { condition: e.target.value })}
                    className="h-10 px-3 rounded-lg bg-slate-900 border border-border text-sm text-white focus:outline-none"
                  >
                    <option value="Stable">Stable</option>
                    <option value="Recovering">Recovering</option>
                    <option value="Critical">Critical</option>
                    <option value="Recovered">Recovered</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => window.open(`tel:${selected.phone}`)}>
                  <Phone className="h-3.5 w-3.5" />
                  Call Patient
                </Button>
                <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDeletePatient(selected.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Profile
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium text-foreground">{value}</p>
    </div>
  )
}
