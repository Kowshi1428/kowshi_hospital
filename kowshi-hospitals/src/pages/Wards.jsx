import React, { useState, useEffect } from 'react'
import { BedDouble, AlertTriangle, Plus, Minus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

export default function Wards() {
  const [bedOccupancy, setBedOccupancy] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchWards = async () => {
    try {
      const res = await api.get('/wards')
      setBedOccupancy(res)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch wards occupancy:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWards()
  }, [])

  const handleBedAdjust = async (wardName, current, delta, total) => {
    const updatedVal = Math.max(0, Math.min(total, current + delta))
    
    // Update local state first for fast response
    setBedOccupancy(prev => 
      prev.map(w => w.ward === wardName ? { ...w, occupied: updatedVal } : w)
    )

    try {
      await api.put(`/wards/${wardName}`, { occupied: updatedVal })
    } catch (err) {
      alert(err.message || 'Failed to update beds')
      fetchWards() // Reread
    }
  }

  const totalBeds = bedOccupancy.reduce((s, w) => s + w.total, 0)
  const totalOccupied = bedOccupancy.reduce((s, w) => s + w.occupied, 0)
  const overallPct = totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground">Wards & Bed Management</h2>
        <p className="text-sm text-muted-foreground">
          {loading ? 'Calculating bed capacities...' : `${totalOccupied} of ${totalBeds} beds occupied hospital-wide (${overallPct}%)`}
        </p>
      </div>

      {!loading && bedOccupancy.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Occupancy by Ward</CardTitle>
            <CardDescription>Capacity utilization across every ward</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bedOccupancy} layout="vertical" margin={{ left: 8, right: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="ward"
                  width={90}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--secondary))' }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null
                    const w = payload[0].payload
                    return (
                      <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-card">
                        <p className="font-medium text-foreground">{label}</p>
                        <p className="text-muted-foreground">
                          {w.occupied} / {w.total} beds occupied
                        </p>
                      </div>
                    )
                  }}
                />
                <Bar dataKey="occupied" radius={[0, 6, 6, 0]} maxBarSize={18}>
                  {bedOccupancy.map((w) => {
                    const pct = (w.occupied / w.total) * 100
                    return <Cell key={w.ward} fill={pct > 90 ? '#f87171' : pct > 70 ? '#fbbf24' : '#3e6bfa'} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          Loading wards levels...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {bedOccupancy.map((w) => {
            const pct = Math.round((w.occupied / w.total) * 100)
            const critical = pct > 90
            return (
              <Card key={w.ward} className={cn(critical && 'border-destructive/40')}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500/10 text-primary-300">
                        <BedDouble className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{w.ward} Ward</p>
                        <p className="text-xs text-muted-foreground">{w.total} total beds</p>
                      </div>
                    </div>
                    {critical && <AlertTriangle className="h-4 w-4 text-destructive" />}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => handleBedAdjust(w.ward, w.occupied, -1, w.total)}
                        disabled={w.occupied <= 0}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="font-display text-2xl font-bold text-foreground mono-tabular w-8 text-center">{w.occupied}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => handleBedAdjust(w.ward, w.occupied, 1, w.total)}
                        disabled={w.occupied >= w.total}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <Badge variant={critical ? 'destructive' : pct > 70 ? 'warning' : 'success'}>{pct}% full</Badge>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        critical ? 'bg-destructive' : pct > 70 ? 'bg-warning' : 'bg-primary-500'
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{w.total - w.occupied} beds available now</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
