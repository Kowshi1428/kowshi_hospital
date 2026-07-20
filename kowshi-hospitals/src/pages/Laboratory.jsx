import React, { useMemo, useState, useEffect } from 'react'
import { Search, FlaskConical, Plus, Trash2, Edit } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'

const statusVariant = {
  Completed: 'success',
  Processing: 'default',
  Pending: 'outline',
}

const DEPARTMENTS = [
  'Hematology',
  'Biochemistry',
  'Microbiology',
  'Cardiology',
  'Neurology',
  'Oncology',
  'Maternity',
  'General Medicine'
]

export default function Laboratory() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isPatient = user.role === 'patient'

  const [labTests, setLabTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  // New test form state
  const [isOrderOpen, setIsOrderOpen] = useState(false)
  const [newOrder, setNewOrder] = useState({
    patient: '',
    test: '',
    department: 'Biochemistry',
    doctor: ''
  })
  const [formError, setFormError] = useState('')

  // Selected test for editing status/results
  const [selected, setSelected] = useState(null)
  const [updatedResult, setUpdatedResult] = useState('')

  const fetchLabTests = async () => {
    try {
      const res = await api.get('/laboratory')
      setLabTests(res)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch lab records:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLabTests()
  }, [])

  const filtered = useMemo(
    () =>
      labTests.filter(
        (t) =>
          t.patient.toLowerCase().includes(query.toLowerCase()) || t.test.toLowerCase().includes(query.toLowerCase())
      ),
    [labTests, query]
  )

  const counts = useMemo(() => {
    return {
      completed: labTests.filter((t) => t.status === 'Completed').length,
      processing: labTests.filter((t) => t.status === 'Processing').length,
      pending: labTests.filter((t) => t.status === 'Pending').length,
    }
  }, [labTests])

  const handleOrderSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!newOrder.patient || !newOrder.test || !newOrder.doctor) {
      setFormError('Please fill out all required fields')
      return
    }

    try {
      await api.post('/laboratory', newOrder)
      setIsOrderOpen(false)
      setNewOrder({
        patient: '',
        test: '',
        department: 'Biochemistry',
        doctor: ''
      })
      fetchLabTests()
    } catch (err) {
      setFormError(err.message || 'Failed to order lab test')
    }
  }

  const handleUpdateStatus = async (id, status, result) => {
    try {
      const fields = { status }
      if (result !== undefined) {
        fields.result = result
      }
      await api.put(`/laboratory/${id}`, fields)
      setSelected(null)
      fetchLabTests()
    } catch (err) {
      alert(err.message || 'Failed to update lab order')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this lab test order?')) return
    try {
      await api.delete(`/laboratory/${id}`)
      setSelected(null)
      fetchLabTests()
    } catch (err) {
      alert(err.message || 'Failed to delete record')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Laboratory Orders</h2>
          <p className="text-sm text-muted-foreground">{labTests.length} test orders tracked</p>
        </div>
        {!isPatient && (
          <Button size="sm" onClick={() => setIsOrderOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            New Order
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
              <FlaskConical className="h-4 w-4" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-foreground">{counts.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500/10 text-primary-300">
              <FlaskConical className="h-4 w-4" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-foreground">{counts.processing}</p>
              <p className="text-xs text-muted-foreground">Processing</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
              <FlaskConical className="h-4 w-4" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-foreground">{counts.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Test Orders</CardTitle>
            <CardDescription>Ordered by attending physicians</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patient or test…" className="pl-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Test Name</TableHead>
                <TableHead>Ordered By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Result Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    Loading laboratory records...
                  </TableCell>
                </TableRow>
              ) : filtered.map((t) => (
                <TableRow key={t.id} className="cursor-pointer" onClick={() => { setSelected(t); setUpdatedResult(t.result) }}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{t.id}</TableCell>
                  <TableCell className="text-sm font-medium text-foreground">{t.patient}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.test}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.doctor}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(t.date || t.createdAt)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{t.result}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[t.status]}>{t.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setSelected(t); setUpdatedResult(t.result) }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(t.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    No laboratory records found matching filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Order Dialog */}
      <Dialog open={isOrderOpen} onOpenChange={setIsOrderOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Order Laboratory Test</DialogTitle>
            <DialogDescription>
              Submit a laboratory diagnostic request for a patient.
            </DialogDescription>
          </DialogHeader>
          {formError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg text-center">
              {formError}
            </div>
          )}
          <form onSubmit={handleOrderSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground font-display">Patient Name *</label>
              <Input
                value={newOrder.patient}
                onChange={(e) => setNewOrder({ ...newOrder, patient: e.target.value })}
                placeholder="Patient Full Name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground font-display">Laboratory Unit</label>
                <select
                  value={newOrder.department}
                  onChange={(e) => setNewOrder({ ...newOrder, department: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-border text-sm text-white focus:outline-none"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground font-display font-medium">Attending Specialist *</label>
                <Input
                  value={newOrder.doctor}
                  onChange={(e) => setNewOrder({ ...newOrder, doctor: e.target.value })}
                  placeholder="e.g. Dr. Suresh Babu"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground font-display">Requested Diagnostic Test *</label>
              <Input
                value={newOrder.test}
                onChange={(e) => setNewOrder({ ...newOrder, test: e.target.value })}
                placeholder="e.g. MRI Brain with Contrast"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOrderOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Test Status/Results Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-[450px]">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500/10 text-primary-300">
                    <FlaskConical className="h-5 w-5" />
                  </div>
                  <div>
                    <DialogTitle>{selected.patient}</DialogTitle>
                    <DialogDescription>{selected.test} ({selected.id})</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Laboratory</span>
                    <span className="font-semibold text-foreground">{selected.department}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Requested By</span>
                    <span className="font-semibold text-foreground">{selected.doctor}</span>
                  </div>
                </div>                 {isPatient ? (
                  <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-border">
                    <span className="text-xs font-semibold text-muted-foreground block">Diagnostic Findings Report</span>
                    <p className="text-xs text-white mt-1 whitespace-pre-wrap font-mono">{selected.result || "Pending Analysis"}</p>
                  </div>
                 ) : (
                  <>
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-medium text-muted-foreground">Order Status</label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          size="sm"
                          variant={selected.status === 'Pending' ? 'default' : 'outline'}
                          onClick={() => handleUpdateStatus(selected.id, 'Pending')}
                          className="text-xs"
                        >
                          Pending
                        </Button>
                        <Button
                          size="sm"
                          variant={selected.status === 'Processing' ? 'default' : 'outline'}
                          onClick={() => handleUpdateStatus(selected.id, 'Processing')}
                          className="text-xs"
                        >
                          Processing
                        </Button>
                        <Button
                          size="sm"
                          variant={selected.status === 'Completed' ? 'success' : 'outline'}
                          onClick={() => handleUpdateStatus(selected.id, 'Completed', updatedResult)}
                          className="text-xs"
                        >
                          Complete
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Diagnostic Findings / Results</label>
                      <textarea
                        value={updatedResult}
                        onChange={(e) => setUpdatedResult(e.target.value)}
                        rows={3}
                        placeholder="Enter diagnostic report details..."
                        className="w-full p-2.5 rounded-lg bg-slate-900 border border-border text-xs text-white focus:outline-none"
                      />
                    </div>
                  </>
                 )}
              </div>

              <DialogFooter className="pt-2">
                {isPatient ? (
                  <Button className="w-full" onClick={() => setSelected(null)}>
                    Close Report
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setSelected(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleUpdateStatus(selected.id, selected.status, updatedResult)}>
                      Save Changes
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
