"use client"

interface AscensoModalProps {
  nivel: number
  nombre: string
  descripcion: string
  onClose: () => void
}

export function AscensoModal({ nivel, nombre, descripcion, onClose }: AscensoModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl border-2 border-[var(--accent)] bg-[var(--card)] p-8 text-center shadow-[0_0_40px_rgba(255,0,123,0.4)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Nivel {nivel} desbloqueado
        </p>
        <h2 className="mt-3 text-2xl font-bold text-[var(--primary)] [text-shadow:0_0_15px_rgba(0,212,255,0.3)]">
          {nombre}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#9aa0b4]">{descripcion}</p>
        <button
          onClick={onClose}
          className="mt-6 rounded-lg bg-[var(--accent)] px-6 py-3 font-bold uppercase tracking-wide text-white shadow-[0_4px_15px_rgba(255,0,123,0.3)] transition hover:-translate-y-0.5 hover:bg-[#ff1a8c]"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
