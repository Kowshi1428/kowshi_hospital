import React from 'react'
import { Link } from 'react-router-dom'
import { ActivitySquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-300">
        <ActivitySquare className="h-6 w-6" />
      </div>
      <h1 className="mt-5 font-display text-2xl font-bold text-foreground">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        This record doesn't exist in the Kowshi Hospitals system. Check the URL or head back to the overview.
      </p>
      <Button asChild className="mt-5">
        <Link to="/">Back to Overview</Link>
      </Button>
    </div>
  )
}
