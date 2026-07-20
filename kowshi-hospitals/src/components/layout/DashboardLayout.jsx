import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'

const pageMeta = {
  '/': { title: 'Overview', subtitle: 'Live snapshot of hospital operations' },
  '/patients': { title: 'Patients', subtitle: 'Admissions, records and patient status' },
  '/appointments': { title: 'Appointments', subtitle: "Today's schedule across all departments" },
  '/doctors': { title: 'Doctors & Staff', subtitle: 'Duty roster and specialist directory' },
  '/wards': { title: 'Wards & Beds', subtitle: 'Real-time bed occupancy by ward' },
  '/laboratory': { title: 'Laboratory', subtitle: 'Test orders, results and turnaround' },
  '/pharmacy': { title: 'Pharmacy', subtitle: 'Inventory levels and reorder alerts' },
  '/billing': { title: 'Billing', subtitle: 'Invoices, payments and outstanding balances' },
  '/settings': { title: 'Settings', subtitle: 'Facility configuration and preferences' },
}

const patientPageMeta = {
  '/': { title: 'My Profile', subtitle: 'Your active clinical health status and admission details' },
  '/appointments': { title: 'My Appointments', subtitle: 'Book or reschedule your consultation appointments' },
  '/laboratory': { title: 'Medical Records', subtitle: 'Diagnostic reports and laboratory result transcripts' },
  '/billing': { title: 'My Invoices', subtitle: 'Detailed invoice breakdown and payment log' },
}

export default function DashboardLayout() {
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isPatient = user.role === 'patient'
  const meta = isPatient
    ? (patientPageMeta[location.pathname] || { title: 'Patient Portal', subtitle: '' })
    : (pageMeta[location.pathname] || { title: 'Kowshi Hospitals', subtitle: '' })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 flex-col">
        {/* Page title and subtitle block inside main container for clear professional context */}
        <div className="mx-auto w-full max-w-[1600px] px-4 pt-6 sm:px-6 lg:px-8">
          <div className="border-b border-border/60 pb-4">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{meta.title}</h1>
            {meta.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{meta.subtitle}</p>}
          </div>
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1600px] animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
