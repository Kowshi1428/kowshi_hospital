import React from 'react'

// Signature brand motif: a clinical vital-sign waveform used across the
// dashboard header to visually tie the "SaaS dashboard" to the hospital's
// own instrumentation aesthetic — a live-look heartbeat trace.
export default function PulseStrip({ className = '', color = '#3e6bfa' }) {
  return (
    <svg viewBox="0 0 240 40" className={className} preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points="0,20 20,20 28,20 34,6 40,34 46,20 54,20 70,20 78,20 84,10 90,30 96,20 104,20 120,20 128,20 134,4 140,36 146,20 154,20 170,20 178,20 184,10 190,30 196,20 204,20 220,20 228,20 234,8 240,20"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="240"
        className="animate-pulse-line"
        style={{ opacity: 0.85 }}
      />
    </svg>
  )
}
