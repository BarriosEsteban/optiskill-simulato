"use client"

import { useEffect, useRef } from "react"

interface LensCanvasProps {
  progreso: number
  isTallando: boolean
  onStart: () => void
  onStop: () => void
}

interface Particle {
  id: number
  size: number
  left: number
  top: number
  tx: number
  ty: number
}

export function LensCanvas({ progreso, isTallando, onStart, onStop }: LensCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const particleId = useRef(0)

  // Spawn particles while tallando
  useEffect(() => {
    if (!isTallando) return
    const interval = setInterval(() => {
      if (Math.random() > 0.7) return
      const node = containerRef.current
      if (!node) return

      const id = particleId.current++
      const size = Math.random() * 4 + 2
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 100 + 50

      const el = document.createElement("div")
      el.className = "particle"
      el.style.width = `${size}px`
      el.style.height = `${size}px`
      el.style.left = `${Math.random() * 100}%`
      el.style.top = `${Math.random() * 100}%`
      el.style.setProperty("--tx", `${Math.cos(angle) * distance}px`)
      el.style.setProperty("--ty", `${Math.sin(angle) * distance}px`)
      void id
      node.appendChild(el)
      setTimeout(() => el.remove(), 500)
    }, 50)
    return () => clearInterval(interval)
  }, [isTallando])

  const opacity = Math.min(progreso / 100, 0.8)

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Superficie de la lente. Mantén presionado para tallar."
      onMouseDown={onStart}
      onMouseUp={onStop}
      onMouseLeave={onStop}
      onTouchStart={(e) => {
        e.preventDefault()
        onStart()
      }}
      onTouchEnd={(e) => {
        e.preventDefault()
        onStop()
      }}
      className={`relative mx-auto flex h-[300px] w-[300px] max-w-full cursor-crosshair items-center justify-center overflow-hidden rounded-full border-[5px] border-[#444] transition-all duration-150 [background:radial-gradient(circle_at_30%_30%,#555_0%,#222_50%,#0a0a0a_100%)] sm:h-[300px] sm:w-[300px] ${
        isTallando
          ? "scale-[0.98] shadow-[0_0_50px_rgba(255,0,123,0.4),inset_0_0_30px_rgba(0,0,0,0.5)]"
          : "shadow-[0_0_30px_rgba(0,212,255,0.1),inset_0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(0,212,255,0.3),inset_0_0_30px_rgba(0,0,0,0.5)]"
      }`}
    >
      {/* Surface fill */}
      <div
        className="absolute h-full w-full rounded-full transition-colors duration-150"
        style={{ backgroundColor: `rgba(0, 212, 255, ${opacity})` }}
      />
      {/* Particle layer */}
      <div ref={containerRef} className="absolute h-full w-full" aria-hidden="true" />
      {/* Progress text */}
      <span className="relative z-10 text-3xl font-bold text-[var(--primary)] [text-shadow:0_0_10px_rgba(0,212,255,0.8)]">
        {Math.floor(progreso)}%
      </span>
    </div>
  )
}
