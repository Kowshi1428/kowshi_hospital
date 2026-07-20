import React from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Dashboard from '@/pages/Dashboard'
import Patients from '@/pages/Patients'
import Appointments from '@/pages/Appointments'
import Doctors from '@/pages/Doctors'
import Wards from '@/pages/Wards'
import Laboratory from '@/pages/Laboratory'
import Pharmacy from '@/pages/Pharmacy'
import Billing from '@/pages/Billing'
import Settings from '@/pages/Settings'
import Login from '@/pages/login'
import NotFound from '@/pages/NotFound'

// Protected Route Guard
function ProtectedRoute() {
  const token = localStorage.getItem("token")
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/wards" element={<Wards />} />
          <Route path="/laboratory" element={<Laboratory />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  )
}
