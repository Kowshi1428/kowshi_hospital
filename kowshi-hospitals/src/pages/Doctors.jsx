import React, { useMemo, useState, useEffect } from 'react'
import { Search, Star, Phone, Clock, Plus, Trash2, Edit2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  'On Duty': 'success',
  'Off Duty': 'outline',
  'On Leave': 'warning',
}

const SPECIALTIES = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Oncology',
  'General Medicine',
  'Maternity',
  'Emergency Medicine'
]

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  // Add Staff form modal
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newDoc, setNewDoc] = useState({
    name: '',
    specialty: 'General Medicine',
    experience: '',
    status: 'On Duty',
    shift: '08:00 - 16:00',
    phone: ''
  })
  const [formError, setFormError] = useState('')

  // Edit status modal
  const [selected, setSelected] = useState(null)

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors')
      setDoctors(res)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch doctors:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const filtered = useMemo(
    () =>
      doctors.filter(
        (d) =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.specialty.toLowerCase().includes(query.toLowerCase())
      ),
    [doctors, query]
  )

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!newDoc.name || !newDoc.experience || !newDoc.phone) {
      setFormError('Please fill out all required fields')
      return
    }

    try {
      await api.post('/doctors', newDoc)
      setIsAddOpen(false)
      setNewDoc({
        name: '',
        specialty: 'General Medicine',
        experience: '',
        status: 'On Duty',
        shift: '08:00 - 16:00',
        phone: ''
      })
      fetchDoctors()
    } catch (err) {
      setFormError(err.message || 'Failed to add doctor')
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/doctors/${id}`, { status })
      setSelected(null)
      fetchDoctors()
    } catch (err) {
      alert(err.message || 'Failed to update duty status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this doctor from the roster?')) return
    try {
      await api.delete(`/doctors/${id}`)
      setSelected(null)
      fetchDoctors()
    } catch (err) {
      alert(err.message || 'Failed to delete record')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Doctors & Staff</h2>
          <p className="text-sm text-muted-foreground">{doctors.length} specialists on the roster</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search doctors…" className="w-56 pl-9" />
          </div>
          <Button size="sm" onClick={() => setIsAddOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            Add Staff
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          Loading specialists roster...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((d) => (
            <Card key={d.id} className="group transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-glow">
              <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback className="text-sm">{initials(d.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.specialty}</p>
                  </div>
                </div>
                <Badge 
                  variant={statusVariant[d.status]} 
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => setSelected(d)}
                >
                  {d.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-secondary/50 py-2">
                    <p className="font-display text-sm font-bold text-foreground">{d.experience}y</p>
                    <p className="text-[10px] text-muted-foreground">Experience</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 py-2">
                    <p className="font-display text-sm font-bold text-foreground">{d.patients}</p>
                    <p className="text-[10px] text-muted-foreground">Patients</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 py-2">
                    <p className="flex items-center justify-center gap-1 font-display text-sm font-bold text-foreground">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      {d.rating}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Rating</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {d.shift}
                  </span>
                  <span className="font-mono">{d.id}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="secondary" className="flex-1" onClick={() => window.open(`tel:${d.phone}`)}>
                    <Phone className="h-3.5 w-3.5" />
                    Contact
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => handleDelete(d.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
              No specialists match your search criteria.
            </div>
          )}
        </div>
      )}

      {/* Add Staff Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
            <DialogDescription>
              Register a new physician or specialist to the hospital roster.
            </DialogDescription>
          </DialogHeader>
          {formError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg text-center">
              {formError}
            </div>
          )}
          <form onSubmit={handleAddSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Specialist Name *</label>
              <Input
                value={newDoc.name}
                onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                placeholder="e.g. Dr. Kavitha Suresh"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Specialty</label>
                <select
                  value={newDoc.specialty}
                  onChange={(e) => setNewDoc({ ...newDoc, specialty: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-border text-sm text-white focus:outline-none"
                >
                  {SPECIALTIES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Experience (Years) *</label>
                <Input
                  type="number"
                  value={newDoc.experience}
                  onChange={(e) => setNewDoc({ ...newDoc, experience: e.target.value })}
                  placeholder="10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Duty Status</label>
                <select
                  value={newDoc.status}
                  onChange={(e) => setNewDoc({ ...newDoc, status: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-border text-sm text-white focus:outline-none"
                >
                  <option value="On Duty">On Duty</option>
                  <option value="Off Duty">Off Duty</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Duty Shift *</label>
                <Input
                  value={newDoc.shift}
                  onChange={(e) => setNewDoc({ ...newDoc, shift: e.target.value })}
                  placeholder="09:00 - 17:00"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Contact Phone *</label>
              <Input
                value={newDoc.phone}
                onChange={(e) => setNewDoc({ ...newDoc, phone: e.target.value })}
                placeholder="e.g. +91 98450 10102"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Register Specialist</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-[400px]">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{initials(selected.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle>{selected.name}</DialogTitle>
                    <DialogDescription>{selected.specialty}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-4 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground font-display">Update Duty Status</label>
                  <select
                    value={selected.status}
                    onChange={(e) => handleStatusUpdate(selected.id, e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-border text-sm text-white focus:outline-none mt-1"
                  >
                    <option value="On Duty">On Duty</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground font-display font-medium"> Roster Duty Shift </label>
                  <div className="text-sm font-mono bg-secondary/30 p-2 rounded-lg text-slate-300">
                    {selected.shift}
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" className="w-full" onClick={() => setSelected(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
