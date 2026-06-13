"use client"

import type { RankingEntry } from "@/lib/game-data"

interface RankingModalProps {
  ranking: RankingEntry[]
  nombreActual: string
  onClose: () => void
}

const MEDALLAS = ["1", "2", "3"]

export function RankingModal({ ranking, nombreActual, onClose }: RankingModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Ranking de talladores"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border-2 border-[var(--primary)] bg-[#1a1a2e] p-6 shadow-[0_0_40px_rgba(0,212,255,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center text-2xl font-bold text-[var(--primary)] [text-shadow:0_0_15px_rgba(0,212,255,0.4)]">
          Ranking de Talladores
        </h2>
        <p className="mt-1 text-center text-xs uppercase tracking-wider text-[#9aa0b4]">
          Mejores puntajes
        </p>

        <ol className="mt-5 flex flex-col gap-2">
          {ranking.length === 0 && (
            <li className="rounded-lg bg-black/30 p-4 text-center text-sm text-[#9aa0b4]">
              Aún no hay puntajes. ¡Completa una lente para aparecer aquí!
            </li>
          )}
          {ranking.map((entry, i) => {
            const esActual = entry.nombre === nombreActual
            return (
              <li
                key={`${entry.nombre}-${i}`}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
                  esActual
                    ? "border-[var(--accent)] bg-[rgba(255,0,123,0.12)]"
                    : "border-[#333] bg-black/30"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    i < 3
                      ? "bg-[var(--primary)] text-[#0f0f1e]"
                      : "bg-[#2d2d44] text-[#9aa0b4]"
                  }`}
                >
                  {MEDALLAS[i] ?? i + 1}
                </span>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-bold text-[#e8e8f0]">
                    {entry.nombre}
                    {esActual && (
                      <span className="ml-2 text-xs font-normal text-[var(--accent)]">(tú)</span>
                    )}
                  </p>
                  <p className="text-xs text-[#9aa0b4]">Nivel {entry.nivel}</p>
                </div>
                <span className="text-lg font-bold text-[var(--primary)]">{entry.puntos}</span>
              </li>
            )
          })}
        </ol>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#0f0f1e] transition hover:bg-white"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}
