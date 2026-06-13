"use client"

import { useState } from "react"

interface NameModalProps {
  onSubmit: (name: string) => void
}

export function NameModal({ onSubmit }: NameModalProps) {
  const [value, setValue] = useState("")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(value)
        }}
        className="w-full max-w-md rounded-xl border-2 border-[var(--primary)] bg-[var(--card)] p-8 shadow-[0_0_40px_rgba(0,212,255,0.3)]"
      >
        <h2 className="text-2xl font-bold text-[var(--primary)] [text-shadow:0_0_15px_rgba(0,212,255,0.3)]">
          Bienvenido al Taller OptiSkill
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#9aa0b4]">
          Ingresa tu nombre de Maestro Tallador para comenzar.
        </p>
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Tu nombre"
          className="mt-5 w-full rounded-lg border border-[var(--primary)] bg-[rgba(0,212,255,0.05)] px-4 py-3 text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        <button
          type="submit"
          className="mt-5 w-full rounded-lg bg-[var(--primary)] px-6 py-3 font-bold uppercase tracking-wide text-[#0f0f1e] shadow-[0_4px_15px_rgba(0,212,255,0.3)] transition hover:-translate-y-0.5 hover:bg-white"
        >
          Entrar al taller
        </button>
      </form>
    </div>
  )
}
