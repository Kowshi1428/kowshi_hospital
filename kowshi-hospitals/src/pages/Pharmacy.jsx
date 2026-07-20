import React, { useMemo, useState, useEffect } from 'react'
import { Search, Pill, Plus, AlertTriangle, Trash2, Edit } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
import { formatDate, cn } from '@/lib/utils'

const statusVariant = {
  'In Stock': 'success',
  'Low Stock': 'warning',
  Critical: 'destructive',
}

export default function Pharmacy() {
  const [pharmacyInventory, setPharmacyInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  // Add medication form
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newMed, setNewMed] = useState({
    name: '',
    category: '',
    stock: '',
    reorderLevel: '',
    unit: 'Tablets',
    expiry: ''
  })
  const [formError, setFormError] = useState('')

  // Edit stock dialog
  const [selected, setSelected] = useState(null)
  const [editStock, setEditStock] = useState('')

  const fetchInventory = async () => {
    try {
      const res = await api.get('/pharmacy')
      setPharmacyInventory(res)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch pharmacy inventory:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const filtered = useMemo(
    () =>
      pharmacyInventory.filter(
        (m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.category.toLowerCase().includes(query.toLowerCase())
      ),
    [pharmacyInventory, query]
  )

  const critical = pharmacyInventory.filter((m) => m.status === 'Critical')

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!newMed.name || !newMed.category || !newMed.stock || !newMed.reorderLevel || !newMed.unit || !newMed.expiry) {
      setFormError('Please fill out all required fields')
      return
    }

    try {
      await api.post('/pharmacy', newMed)
      setIsAddOpen(false)
      setNewMed({
        name: '',
        category: '',
        stock: '',
        reorderLevel: '',
        unit: 'Tablets',
        expiry: ''
      })
      fetchInventory()
    } catch (err) {
      setFormError(err.message || 'Failed to add medication')
    }
  }

  const handleUpdateStock = async () => {
    if (!editStock || isNaN(Number(editStock))) {
      alert('Please enter a valid stock count')
      return
    }

    try {
      await api.put(`/pharmacy/${selected.id}`, { stock: Number(editStock) })
      setSelected(null)
      fetchInventory()
    } catch (err) {
      alert(err.message || 'Failed to update stock')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this medication from inventory?')) return
    try {
      await api.delete(`/pharmacy/${id}`)
      setSelected(null)
      fetchInventory()
    } catch (err) {
      alert(err.message || 'Failed to delete item')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Pharmacy Inventory</h2>
          <p className="text-sm text-muted-foreground">{pharmacyInventory.length} SKUs tracked across the formulary</p>
        </div>
        <Button size="sm" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Add Medication
        </Button>
      </div>

      {critical.length > 0 && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div>
              <p className="text-sm font-medium text-destructive">Critical stock alert</p>
              <p className="text-xs text-destructive/80">
                {critical.map((m) => m.name).join(', ')} {critical.length > 1 ? 'are' : 'is'} below safe reorder
                thresholds. Purchase orders recommended today.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Formulary</CardTitle>
            <CardDescription>Stock levels against reorder thresholds</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search medication…" className="pl-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    Loading pharmacy inventory...
                  </TableCell>
                </TableRow>
              ) : filtered.map((m) => {
                const pct = Math.min(100, Math.round((m.stock / (m.reorderLevel * 3)) * 100))
                return (
                  <TableRow key={m.id} className="cursor-pointer" onClick={() => { setSelected(m); setEditStock(String(m.stock)) }}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                          <Pill className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{m.name}</p>
                          <p className="font-mono text-[11px] text-muted-foreground">{m.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.category}</TableCell>
                    <TableCell className="min-w-[10rem]">
                      <div className="flex items-center justify-between text-xs mono-tabular">
                        <span className="text-foreground">
                          {m.stock} {m.unit}
                        </span>
                        <span className="text-muted-foreground">reorder @ {m.reorderLevel}</span>
                      </div>
                      <Progress
                        value={pct}
                        className="mt-1.5 h-1.5"
                        indicatorClassName={cn(
                          m.status === 'Critical' ? 'bg-destructive' : m.status === 'Low Stock' ? 'bg-warning' : 'bg-success'
                        )}
                      />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(m.expiry)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[m.status]}>{m.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setSelected(m); setEditStock(String(m.stock)) }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(m.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    No medications match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Medication Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add Medication to Inventory</DialogTitle>
            <DialogDescription>
              Register a new pharmaceutical item to the formulary stock.
            </DialogDescription>
          </DialogHeader>
          {formError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg text-center">
              {formError}
            </div>
          )}
          <form onSubmit={handleAddSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Medication Name *</label>
              <Input
                value={newMed.name}
                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                placeholder="e.g. Amoxicillin 500mg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Category *</label>
                <Input
                  value={newMed.category}
                  onChange={(e) => setNewMed({ ...newMed, category: e.target.value })}
                  placeholder="e.g. Antibiotic"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Unit</label>
                <select
                  value={newMed.unit}
                  onChange={(e) => setNewMed({ ...newMed, unit: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-border text-sm text-white focus:outline-none"
                >
                  <option>Tablets</option>
                  <option>Capsules</option>
                  <option>Vials</option>
                  <option>Units</option>
                  <option>Sachets</option>
                  <option>Bottles</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Current Stock *</label>
                <Input
                  type="number"
                  value={newMed.stock}
                  onChange={(e) => setNewMed({ ...newMed, stock: e.target.value })}
                  placeholder="1000"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Reorder Level *</label>
                <Input
                  type="number"
                  value={newMed.reorderLevel}
                  onChange={(e) => setNewMed({ ...newMed, reorderLevel: e.target.value })}
                  placeholder="200"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Expiry Date *</label>
              <Input
                type="date"
                value={newMed.expiry}
                onChange={(e) => setNewMed({ ...newMed, expiry: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add to Inventory</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Stock Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-[380px]">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                    <Pill className="h-5 w-5" />
                  </div>
                  <div>
                    <DialogTitle>{selected.name}</DialogTitle>
                    <DialogDescription className="font-mono text-xs">{selected.id} · {selected.category}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-4 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Current Stock</span>
                    <span className="font-bold text-foreground text-sm">{selected.stock} {selected.unit}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Reorder Level</span>
                    <span className="font-bold text-foreground text-sm">{selected.reorderLevel} {selected.unit}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Expiry</span>
                    <span className="font-medium text-foreground">{formatDate(selected.expiry)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Current Status</span>
                    <Badge variant={statusVariant[selected.status]}>{selected.status}</Badge>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <label className="text-xs font-medium text-muted-foreground">Update Stock Count</label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="number"
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      placeholder="Enter new stock count"
                      className="flex-1"
                    />
                    <Button onClick={handleUpdateStock}>Update</Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10 mr-auto" onClick={() => handleDelete(selected.id)}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove Item
                </Button>
                <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
