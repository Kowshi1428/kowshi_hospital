# Kowshi Hospitals — Care Operations Platform

A production-quality **frontend-only** Hospital Management System dashboard, built with React, Vite, Tailwind CSS, shadcn/ui-style components, React Router, Lucide icons, and Recharts.

> This is a UI/frontend demo only. There is no backend, no API, no database, and no authentication — all data lives in `src/data/mockData.js` and is fully static/in-memory.

## Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS** with a custom dark healthcare-SaaS design system
- **shadcn/ui**-style components (hand-built on Radix primitives)
- **React Router DOM v6**
- **Lucide React** icons
- **Recharts** for data visualization

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/         # Sidebar, Topbar, DashboardLayout
│   ├── dashboard/       # StatCard, PulseStrip (signature vitals motif)
│   └── ui/              # shadcn-style primitives (button, card, table, dialog, ...)
├── data/
│   └── mockData.js      # All static/mock hospital data
├── lib/
│   └── utils.js         # cn(), formatCurrency(), formatDate(), initials()
├── pages/
│   ├── Dashboard.jsx     # Overview with KPIs + charts
│   ├── Patients.jsx
│   ├── Appointments.jsx
│   ├── Doctors.jsx
│   ├── Wards.jsx
│   ├── Laboratory.jsx
│   ├── Pharmacy.jsx
│   ├── Billing.jsx
│   ├── Settings.jsx
│   └── NotFound.jsx
├── App.jsx               # Route definitions
├── main.jsx               # Entry point
└── index.css              # Design tokens + global styles
```

## Modules

- **Overview** — live KPI grid, admissions/discharge trend, department distribution, revenue chart, bed occupancy, activity feed, today's appointments
- **Patients** — searchable/filterable directory with patient detail dialog
- **Appointments** — date-tabbed schedule with status tracking
- **Doctors & Staff** — specialist roster cards with duty status
- **Wards & Beds** — real-time-style occupancy visualization per ward
- **Laboratory** — test order tracking with priority and status
- **Pharmacy** — inventory levels with reorder threshold indicators
- **Billing** — invoice tracking with payment status
- **Settings** — facility info, notification preferences, roles, shifts

## Notes

- No login/signup/auth flows are included by design.
- No backend, Express server, MongoDB, or API calls are included by design.
- All data is mock data intended to demonstrate the UI/UX only.
