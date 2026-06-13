"use client"

import { useState } from "react"
import { useGame } from "@/hooks/use-game"
import { NIVELES, LOGROS } from "@/lib/game-data"
import { StatHeader } from "@/components/stat-header"
import { LensCanvas } from "@/components/lens-canvas"
import { NameModal } from "@/components/name-modal"
import { AscensoModal } from "@/components/ascenso-modal"
import { AchievementToasts } from "@/components/achievement-toasts"
import { RankingModal } from "@/components/ranking-modal"

export function Workshop() {
  const game = useGame()
  const nivelActual = NIVELES[game.nivel - 1]
  const [showRanking, setShowRanking] = useState(false)

  const logColor =
    game.log.type === "success"
      ? "border-l-[var(--success)] text-[var(--success)]"
      : game.log.type === "error"
        ? "border-l-[var(--accent)] text-[var(--accent)]"
        : "border-l-[var(--primary)] text-[#aaa]"

  return (
    <main className="flex min-h-screen flex-col items-center">
      <StatHeader nombre={game.nombre} nivel={game.nivel} puntos={game.puntos} racha={game.racha} />

      <div className="mt-4 flex w-[90%] max-w-[650px] justify-end gap-2">
        <button
          onClick={() => setShowRanking(true)}
          className="rounded-lg border border-[var(--primary)] bg-[rgba(0,212,255,0.05)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--primary)] transition hover:bg-[rgba(0,212,255,0.15)]"
        >
          Ranking
        </button>
        <button
          onClick={game.toggleSound}
          aria-pressed={game.soundOn}
          aria-label={game.soundOn ? "Desactivar sonido" : "Activar sonido"}
          className="rounded-lg border border-[var(--primary)] bg-[rgba(0,212,255,0.05)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--primary)] transition hover:bg-[rgba(0,212,255,0.15)]"
        >
          {game.soundOn ? "Sonido: ON" : "Sonido: OFF"}
        </button>
      </div>

      <section className="mt-6 w-[90%] max-w-[650px] pb-16 text-center">
        <h1 className="text-balance text-3xl font-bold text-[var(--primary)] [text-shadow:0_0_15px_rgba(0,212,255,0.3)]">
          {nivelActual.nombre}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-[#9aa0b4]">
          {nivelActual.descripcion} Haz clic y mantén presionado sobre la lente para simular el
          tallado.
        </p>

        <div className="my-6">
          <LensCanvas
            progreso={game.progreso}
            isTallando={game.isTallando}
            onStart={game.startTallado}
            onStop={game.stopTallado}
          />
        </div>

        {/* Progress bar */}
        <div className="my-5 h-[30px] w-full overflow-hidden rounded-full border-2 border-[var(--primary)] bg-[#1a1a2e] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] shadow-[0_0_10px_rgba(0,212,255,0.5)] transition-[width] duration-100"
            style={{ width: `${Math.floor(game.progreso)}%` }}
          />
        </div>

        {/* Controls */}
        <div className="mt-7 rounded-xl border-2 border-[var(--primary)] bg-[rgba(45,45,68,0.7)] p-6">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={game.completarPrueba}
              className="rounded-lg bg-[var(--primary)] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-[#0f0f1e] shadow-[0_4px_15px_rgba(0,212,255,0.3)] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_6px_25px_rgba(0,212,255,0.5)]"
            >
              Entregar lente
            </button>
            <button
              onClick={game.resetLente}
              className="rounded-lg bg-[var(--accent)] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_4px_15px_rgba(255,0,123,0.3)] transition hover:-translate-y-0.5 hover:bg-[#ff1a8c] hover:shadow-[0_6px_25px_rgba(255,0,123,0.5)]"
            >
              Reintentar
            </button>
          </div>
          <div
            className={`mt-5 min-h-[40px] rounded border-l-[3px] bg-black/30 p-4 text-sm italic ${logColor}`}
            aria-live="polite"
          >
            {game.log.text}
          </div>
        </div>

        {/* Unlocked achievements list */}
        {game.logros.size > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#9aa0b4]">
              Logros desbloqueados ({game.logros.size}/{Object.keys(LOGROS).length})
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {Array.from(game.logros).map((id) => {
                const logro = LOGROS[id]
                if (!logro) return null
                return (
                  <div
                    key={id}
                    className="rounded-lg border-2 border-[var(--accent)] bg-[rgba(255,0,123,0.1)] px-4 py-3 text-left"
                  >
                    <p className="text-sm font-bold text-[var(--accent)]">{logro.nombre}</p>
                    <p className="text-xs text-[#c9cde0]">{logro.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {game.needsName && <NameModal onSubmit={game.guardarNombre} />}
      {game.ascenso && (
        <AscensoModal
          nivel={game.ascenso.nivel}
          nombre={game.ascenso.nombre}
          descripcion={game.ascenso.descripcion}
          onClose={game.cerrarAscenso}
        />
      )}
      <AchievementToasts toasts={game.toasts} />
      {showRanking && (
        <RankingModal
          ranking={game.ranking}
          nombreActual={game.nombre}
          onClose={() => setShowRanking(false)}
        />
      )}
    </main>
  )
}
