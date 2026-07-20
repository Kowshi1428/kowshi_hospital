import React, { useRef, useState } from 'react'

export default function Tilt3D({ children, className, glowColor = 'rgba(62, 107, 250, 0.18)' }) {
  const ref = useRef(null)
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
  const [glowStyle, setGlowStyle] = useState({ opacity: 0, x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const card = ref.current
    const rect = card.getBoundingClientRect()
    
    // Position of cursor relative to element bounding box
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Normalized coordinates from center (-0.5 to 0.5)
    const normX = (x / rect.width) - 0.5
    const normY = (y / rect.height) - 0.5

    // Multiplied by angle range for max 12deg tilt
    const rotateX = -(normY * 12).toFixed(2)
    const rotateY = (normX * 12).toFixed(2)

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`)
    
    setGlowStyle({
      opacity: 1,
      x,
      y
    })
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
    setGlowStyle(prev => ({ ...prev, opacity: 0 }))
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className={`relative overflow-hidden rounded-xl border border-border bg-card shadow-lg transition-all duration-200 hover:shadow-2xl hover:shadow-primary-500/10 ${className || ''}`}
    >
      {/* 3D Glass Light reflection shine overlay */}
      <div 
        style={{
          background: `radial-gradient(180px circle at ${glowStyle.x}px ${glowStyle.y}px, ${glowColor}, transparent 80%)`,
          opacity: glowStyle.opacity,
          pointerEvents: 'none',
        }}
        className="absolute inset-0 z-0 transition-opacity duration-300"
      />
      {/* Container holding children with 3D translation depth */}
      <div className="relative z-10" style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  )
}
