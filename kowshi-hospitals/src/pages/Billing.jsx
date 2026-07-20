import React, { useMemo, useState, useEffect } from 'react'
import { Search, Receipt, Plus, IndianRupee, Clock, AlertCircle, Trash2, Check } from 'lucide-react'
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
import StatCard from '@/components/dashboard/StatCard'
import { api } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'

const statusVariant = {
  Paid: 'success',
  Pending: 'warning',
  Overdue: 'destructive',
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

export default function Billing() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isPatient = user.role === 'patient'

  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  // Create Invoice form
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newInvoice, setNewInvoice] = useState({
    patient: '',
    department: 'General Medicine',
    amount: '',
    method: 'Card'
  })
  const [formError, setFormError] = useState('')

  // Selected invoice for edit/view
  const [selected, setSelected] = useState(null)

  const fetchInvoices = async () => {
    try {
      const res = await api.get('/billing')
      setInvoices(res)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch billing records:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  const filtered = useMemo(
    () => invoices.filter((i) => i.patient.toLowerCase().includes(query.toLowerCase()) || i.id.toLowerCase().includes(query.toLowerCase())),
    [invoices, query]
  )

  const totalRevenue = invoices.filter((i) => i.status === 'Paid').reduce((s, i) => s + i.amount, 0)
  const pending = invoices.filter((i) => i.status === 'Pending').reduce((s, i) => s + i.amount, 0)
  const overdue = invoices.filter((i) => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0)

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!newInvoice.patient || !newInvoice.amount) {
      setFormError('Please fill out all required fields')
      return
    }

    try {
      await api.post('/billing', newInvoice)
      setIsCreateOpen(false)
      setNewInvoice({
        patient: '',
        department: 'General Medicine',
        amount: '',
        method: 'Card'
      })
      fetchInvoices()
    } catch (err) {
      setFormError(err.message || 'Failed to create invoice')
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/billing/${id}`, { status })
      setSelected(null)
      fetchInvoices()
    } catch (err) {
      alert(err.message || 'Failed to update invoice')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice record?')) return
    try {
      await api.delete(`/billing/${id}`)
      setSelected(null)
      fetchInvoices()
    } catch (err) {
      alert(err.message || 'Failed to delete invoice')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Billing & Invoices</h2>
          <p className="text-sm text-muted-foreground">{invoices.length} invoices generated this period</p>
        </div>
        {!isPatient && (
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            Create Invoice
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Collected" value={formatCurrency(totalRevenue)} icon={IndianRupee} tone="success" />
        <StatCard label="Pending" value={formatCurrency(pending)} icon={Clock} tone="warning" />
        <StatCard label="Overdue" value={formatCurrency(overdue)} icon={AlertCircle} tone="destructive" />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>All patient billing records</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search invoice or patient…" className="pl-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                {!isPatient && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    Loading billing records...
                  </TableCell>
                </TableRow>
              ) : filtered.map((i) => (
                <TableRow key={i.id} className="cursor-pointer" onClick={() => setSelected(i)}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        <Receipt className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">{i.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-foreground">{i.patient}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{i.department}</TableCell>
                  <TableCell className="mono-tabular text-sm font-semibold text-foreground">{formatCurrency(i.amount)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{i.method}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(i.date || i.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[i.status]}>{i.status}</Badge>
                  </TableCell>
                  {!isPatient && (
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1">
                        {i.status !== 'Paid' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-success hover:text-success"
                            onClick={() => handleUpdateStatus(i.id, 'Paid')}
                            title="Mark as Paid"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(i.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    No invoices match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Invoice Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[430px]">
          <DialogHeader>
            <DialogTitle>Generate Invoice</DialogTitle>
            <DialogDescription>
              Create a new billing record for a patient treatment or service.
            </DialogDescription>
          </DialogHeader>
          {formError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg text-center">
              {formError}
            </div>
          )}
          <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Patient Name *</label>
              <Input
                value={newInvoice.patient}
                onChange={(e) => setNewInvoice({ ...newInvoice, patient: e.target.value })}
                placeholder="e.g. Arjun Menon"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Department</label>
                <select
                  value={newInvoice.department}
                  onChange={(e) => setNewInvoice({ ...newInvoice, department: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-border text-sm text-white focus:outline-none"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Payment Method</label>
                <select
                  value={newInvoice.method}
                  onChange={(e) => setNewInvoice({ ...newInvoice, method: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-border text-sm text-white focus:outline-none"
                >
                  <option value="Card">Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Insurance">Insurance</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Invoice Amount (INR) *</label>
              <Input
                type="number"
                value={newInvoice.amount}
                onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                placeholder="e.g. 84500"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Generate Invoice</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-[380px]">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div>
                    <DialogTitle>{selected.id}</DialogTitle>
                    <DialogDescription>{selected.patient}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-3 py-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Department</span>
                  <span className="font-medium text-foreground">{selected.department}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Invoice Amount</span>
                  <span className="font-bold text-foreground text-base">{formatCurrency(selected.amount)}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium text-foreground">{selected.method}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Date Generated</span>
                  <span className="font-medium text-foreground">{formatDate(selected.date || selected.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-muted-foreground">Payment Status</span>
                  <Badge variant={statusVariant[selected.status]}>{selected.status}</Badge>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {isPatient ? (
                  <Button className="w-full" onClick={() => setSelected(null)}>
                    Close Statement
                  </Button>
                ) : (
                  <>
                    {selected.status !== 'Paid' && (
                      <Button className="flex-1" size="sm" onClick={() => handleUpdateStatus(selected.id, 'Paid')}>
                        <Check className="h-3.5 w-3.5" />
                        Mark Paid
                      </Button>
                    )}
                    {selected.status === 'Pending' && (
                      <Button size="sm" variant="secondary" className="flex-1" onClick={() => handleUpdateStatus(selected.id, 'Overdue')}>
                        Mark Overdue
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(selected.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
